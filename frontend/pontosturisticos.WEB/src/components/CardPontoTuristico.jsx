import "../styles/CardPontoTuristico.css";

const CardPontoTuristico = ({ nome, cidade, estado, imagem }) => {
  console.log("Propriedades recebidas:", { nome, cidade, estado, imagem }); 

  // console.log("Propriedades recebidas:", props);

  return (
    <div className="card">
      <img src={imagem} alt={nome} />
      <div className="info">
        <h3>{nome}</h3>
        <p>{cidade}/{estado}</p>
      </div>
    </div>
  );
};


export default CardPontoTuristico;