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
            string? pesquisa = null, int page = 1, int pageSize = 10)

        {
            var query = _context.PontosTuristicos.AsQueryable();

            //Filtro para pesquisa
            if (!string.IsNullOrEmpty(pesquisa))
            {
                query = query.Where(p =>
                    p.Nome.Contains(pesquisa) ||
                    p.Descricao.Contains(pesquisa) ||
                    p.Localizacao.Contains(pesquisa));
            }

            query = query.OrderByDescending(p => p.DataInclusao);

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

        [HttpPost("upload")] //vai fazer o salvamento da foto na pasta public (teste)[HttpPost("upload")]
        public async Task<IActionResult> UploadImagem([FromForm] IFormFile arquivo, [FromForm] string nome)
        {
            if (arquivo == null || arquivo.Length == 0 || string.IsNullOrWhiteSpace(nome))
            {
                return BadRequest(new { erro = "Imagem e nome são obrigatórios." });
            }

            // **Corrigir caminho para garantir que sai do backend**
            // var caminhoBackend = Directory.GetCurrentDirectory(); // Obtém o caminho do backend
            var caminhoPastaPublic = Path.GetFullPath(Path.Combine( ".." ,"..", "frontend", "pontosturisticos.WEB", "public"));

            // Criar pasta public se não existir
            if (!Directory.Exists(caminhoPastaPublic))
            {
                Directory.CreateDirectory(caminhoPastaPublic);
            }

            // **Salvar a imagem com o mesmo nome do ponto turístico + ".jpg"**
            var nomeArquivo = $"{nome.ToLower().Replace(" ", "-")}.jpg"; 
            var caminhoCompleto = Path.Combine(caminhoPastaPublic, nomeArquivo);

            Console.WriteLine($"📁 Tentando salvar imagem como: {caminhoCompleto}");

            try
            {
                using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                {
                    await arquivo.CopyToAsync(stream);
                }

                Console.WriteLine($"✅ Imagem salva com sucesso: {caminhoCompleto}");
                return Ok(new { caminho = $"/{nomeArquivo}" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao salvar imagem: {ex.Message}");
                return StatusCode(500, new { erro = $"Erro ao salvar a imagem: {ex.Message}" });
            }
        }



    }
}
