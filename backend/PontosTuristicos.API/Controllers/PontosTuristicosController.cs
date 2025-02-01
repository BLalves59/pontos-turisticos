using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PontosTuristicos.API.Data;
using PontosTuristicos.API.Models;

namespace PontosTuristicos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PontosTuristicosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PontosTuristicosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet] //LISTAR
        public async Task<ActionResult<IEnumerable<PontoTuristico>>> GetPontosTuristicos(
            int page = 1, int pageSize = 10)
        {
            var query = _context.PontosTuristicos.OrderByDescending(p => p.Id);

            var totalItems = await query.CountAsync(); //Total de registros

            var pontosTuristicos = await query
                .Skip((page - 1) * pageSize) //Pular páginas anteriores
                .Take(pageSize) //Pegar somente os itens da página
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                TotalPaginas = (int)Math.Ceiling((double)totalItems / pageSize),
                Data = pontosTuristicos
            });
        }

        [HttpPost] //ADICIONAR
        public async Task<ActionResult<PontoTuristico>> PostPontoTuristico(PontoTuristico ponto)
        {
            _context.PontosTuristicos.Add(ponto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPontosTuristicos), new { id = ponto.Id }, ponto);
        }

        [HttpPut("{id}")] //EDITAR - não será utilizada
        public async Task<IActionResult> PutPontoTuristico(int id, PontoTuristico ponto)
        {
            if (id != ponto.Id)
            {
                return BadRequest("O ID do parâmetro não corresponde ao ID do corpo da requisição.");
            }

            var pontoExistente = await _context.PontosTuristicos.FindAsync(id);
            if (pontoExistente == null)
            {
                return NotFound();
            }

            // Atualiza os campos do ponto existente
            pontoExistente.Nome = ponto.Nome;
            pontoExistente.Descricao = ponto.Descricao;
            pontoExistente.Localizacao = ponto.Localizacao;
            pontoExistente.Cidade = ponto.Cidade;
            pontoExistente.Estado = ponto.Estado;

            _context.PontosTuristicos.Update(pontoExistente);
            await _context.SaveChangesAsync();

            return Ok(pontoExistente);
        }

        [HttpDelete("{id}")] //DELETAR - não será utilizada
        public async Task<IActionResult> DeletePontoTuristico(int id)
        {
            var ponto = await _context.PontosTuristicos.FindAsync(id);
            if (ponto == null)
            {
                return NotFound();
            }

            _context.PontosTuristicos.Remove(ponto);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
