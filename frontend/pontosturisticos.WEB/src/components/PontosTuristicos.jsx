import { useEffect, useState } from "react";
import api from "../services/api";
import CardPontoTuristico from "./CardPontoTuristico";
import "../styles/PontosTuristicos.css";
import ModalCadastro from "./ModalCadastro";

const PontosTuristicos = () => {
  const [pontos, setPontos] = useState([]); // Estado para armazenar os pontos turísticos
  const [pesquisa, setPesquisa] = useState(""); //Armazena o que for pesquisado
  const [pagina, setPagina] = useState(1); //Pagina atual
  const [totalPaginas, setTotalPaginas] = useState(1); //Total de paginas
  const [mostrarModal, setMostrarModal] = useState(false);
  const itensPaginas = 8; //Número de itens por pagina



  useEffect(() => {
    buscarPontos();
  }, [pagina]);

  const buscarPontos = () => {
    api.get(`/PontosTuristicos?page=${pagina}&pageSize=${itensPaginas}&pesquisa=${pesquisa}`) //Requisição GET para buscar os pontos turísticos com paginação
    .then((response) => {
      console.log("Dados recebidos da API:", response.data);
      setPontos(response.data.data); //Atualiza o estado com os dados recebidos
      setTotalPaginas(response.data.totalPaginas); //atualiza o total das paginas
    })
    .catch((error) => {
      console.error("Erro ao buscar Pontos Turisticos:", error);
    });
  }

  //Tdetectar a tecla enter e ativar a busca
  const ativarBusca = (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault(); // Evita a recarga da página (comportamento padrão)
      buscarPontos(evento.target.value); // Usa o valor mais atualizado do input
    }
  };

  console.log("Pontos turísticos a serem exibidos:", pontos); 

  return (
    <div className="container">
      <h2 className="titulo">Pontos Turísticos</h2>
      <p className="subtitulo">Confira o melhor guia para sua viagem</p>

      {/*BARRA DE PESQUISA */}
      <div className="topo">
        <div className="container-busca">
          <input
            type="text"
            className="barraPesquisa"
            placeholder="Buscar pontos turísticos..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={ativarBusca}
          />
          <button className="botao-adicionar" onClick={() => setMostrarModal(true)}>
            Adicionar +
          </button>
          <div>
            {mostrarModal && <ModalCadastro fecharModal={() => setMostrarModal(false)} atualizarLista={buscarPontos} />}
          </div>
        </div>
      </div>


      <div className="cards-container">
        {pontos.length > 0 ? (
          pontos.map((ponto) => (
            <CardPontoTuristico
              key={ponto.id}
              nome={ponto.nome}
              cidade={ponto.cidade}
              estado={ponto.estado}
              imagem={`/${ponto.nome.toLowerCase().replace(/\s+/g, "-")}.jpg`}
            />
          ))) : (
            <p>Nenhum resultado encontrado</p>
          )}
      </div>


      {/* BOTÕES DE PAGINAÇÃO */}
      <div className="proximaPagina">
        <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
          Anterior
        </button>
        <span className="pagina">
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
