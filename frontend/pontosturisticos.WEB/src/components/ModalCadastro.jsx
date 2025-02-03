import { useState } from "react";
import api from "../services/api";
import "../styles/ModalCadastro.css";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

const ModalCadastro = ({ fecharModal, atualizarLista}) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  //capturando a imagem
  const imagemPonto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviewImagem(URL.createObjectURL(file));
    }
  };

  //cadastrar ponto turistico
  const cadastrarPonto = () => {
    if (!nome || !descricao || !localizacao || !cidade || !estado || !imagem) {
      alert("Preencha todos os campos e selecione uma imagem!");
      return;
    }
  
    const formData = new FormData();
    formData.append("arquivo", imagem);
    formData.append("nome", nome); // **Enviar o nome para salvar com o mesmo nome da imagem**
  
    api.post("/PontosTuristicos/upload", formData)
      .then((res) => {
        const caminhoImagem = res.data.caminho;
  
        // Agora, cadastramos o ponto turístico com a imagem salva corretamente
        const novoPonto = { nome, descricao, localizacao, cidade, estado, imagem: caminhoImagem };
  
        return api.post("/PontosTuristicos", novoPonto);
      })
      .then(() => {
        alert("Ponto turístico cadastrado com sucesso!");
        fecharModal();
        atualizarLista();
      })
      .catch((error) => {
        console.error("Erro ao cadastrar", error);
      });
  };
  
  
  

  return (
    <div className="telaSobreposicao" onClick={fecharModal}>
      <div className="containerSobreposicao" onClick={(e) => e.stopPropagation()}>
        <h2>Cadastrar Ponto Turístico</h2>

        <form onSubmit={(e) => { e.preventDefault(); cadastrarPonto(); }}>
          <div className="formularios">
            <label>Nome:</label>
            <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="formularios">
            <label>Descrição:</label>
            <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          </div>

          <div className="formularios">
            <label>Localização:</label>
            <input type="text" placeholder="Localização" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} required />
          </div>

          <div className="formularios">
            <label>Cidade:</label>
            <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
          </div>

          <div className="formularios">
            <label>Estado:</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} required>
              <option value="">Selecione o Estado</option>
              {estados.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          <div className="formularios">
            <label>Imagem:</label>
            <input type="file" accept="image/*" onChange={imagemPonto} required />
          </div>

          {previewImagem && <img src={previewImagem} alt="Pré-visualização" className="preview-imagem" />}

          <div className="botoesFecharSalvar">
            <button type="button" onClick={fecharModal}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCadastro;