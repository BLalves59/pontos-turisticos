import { useEffect, useState } from "react";
import api from "../services/api";
import CardPontoTuristico from "./CardPontoTuristico";
import "../styles/PontosTuristicos.css";

const PontosTuristicos = () => {
  const [pontos, setPontos] = useState([]); // Estado para armazenar os pontos turísticos

  useEffect(() => {
    api.get("/PontosTuristicos") // Requisição GET para buscar os pontos turísticos
      .then((response) => {
        console.log("Dados recebidos da API:", response.data);
        setPontos(response.data); // Atualiza o estado com os dados recebidos
      })
      .catch((error) => {
        console.error("Erro ao buscar Pontos Turisticos:", error);
      });
  }, []);


  console.log("Pontos turísticos a serem exibidos:", pontos); // <-- Adiciona esta linha
  return (
    <div className="container">
      <h2 className="titulo">Pontos Turísticos</h2>
      <p className="subtitulo">Confira o melhor guia para sua viagem</p>

      <input
        type="text"
        className="search-bar"
        placeholder="Buscar pontos turísticos..."
        // disabled //Apenas visual por enquanto
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
    </div>
  );
};

export default PontosTuristicos;
