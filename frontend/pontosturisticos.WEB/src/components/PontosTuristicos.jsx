import { useEffect, useState } from "react";
import api from "../services/api";
import CardPontoTuristico from "./CardPontoTuristico";
import "../styles/PontosTuristicos.css";

const PontosTuristicos = () => {
  const [pontos, setPontos] = useState([]); // Estado para armazenar os pontos turísticos
  const [pesquisa, setPesquisa] = useState(""); //Armazena o que for pesquisado
  const [pagina, setPagina] = useState(1); //Pagina atual
  const [totalPaginas, setTotalPaginas] = useState(1); //Total de paginas
  const itensPaginas = 8; //Número de itens por pagina



  useEffect(() => {
    buscarPontos();
  }, [pagina]);

  const buscarPontos = () => {
    api.get(`/PontosTuristicos?page=${Number(pagina)}&pageSize=${Number(itensPaginas)}`) //Requisição GET para buscar os pontos turísticos com paginação
    .then((response) => {
      console.log("Dados recebidos da API:", response.data);
      setPontos(response.data.data); //Atualiza o estado com os dados recebidos
      setTotalPaginas(response.data.totalPaginas); //atualiza o total das paginas
    })
    .catch((error) => {
      console.error("Erro ao buscar Pontos Turisticos:", error);
    });
  }




  console.log("Pontos turísticos a serem exibidos:", pontos); 
  return (
    <div className="container">
      <h2 className="titulo">Pontos Turísticos</h2>
      <p className="subtitulo">Confira o melhor guia para sua viagem</p>

      {/*BARRA DE PESQUISA */}
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar pontos turísticos..."
        value={pesquisa} //valor digitado armazenado
        onChange={(e) => setPesquisa(e.target.value)} //atualiza o estado
      />

      <div className="cards-container">
        {pontos.map((ponto) => (
          <CardPontoTuristico
            key={ponto.id}
            nome={ponto.nome}
            cidade={ponto.cidade}
            estado={ponto.estado}
            imagem={`/${ponto.nome.toLowerCase().replace(/\s+/g, "-")}.jpg`}
          />
        ))}
      </div>


      {/* BOTÕES DE PAGINAÇÃO */}
      <div className="pagination">
        <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas}>
          Próximo
        </button>
      </div>

    </div>
  );
};

export default PontosTuristicos;
