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
        public async Task<ActionResult<IEnumerable<PontoTuristico>>> GetPontosTuristicos()
        {
            return await _context.PontosTuristicos.ToListAsync();
        }

        [HttpPost] //ADICIONAR
        public async Task<ActionResult<PontoTuristico>> PostPontoTuristico(PontoTuristico ponto)
        {
            _context.PontosTuristicos.Add(ponto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPontosTuristicos), new { id = ponto.Id }, ponto);
        }

        [HttpPut("{id}")] //EDITAR
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

        [HttpDelete("{id}")] //DELETAR
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
