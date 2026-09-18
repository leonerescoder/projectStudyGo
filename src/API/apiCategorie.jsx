import { useEffect, useState } from "react";
import { BASE_URL, getStoredToken } from "./apiClient";

function App() {
  const [curso, setCursos] = useState([]);
  const [pesquisa, setPesquisa] = useState(0);

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [workload, setWorkload] = useState(0)
  const [urlimg, setUrlImg] = useState("")
  const [fieldofstudy, setFieldOfStudy] = useState('')

  async function Inserir() {
    try {
      const token = getStoredToken();
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const request = await fetch(`${BASE_URL}/categorie`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: nome,
          description: descricao,
          workload: workload,
          urlImg: urlimg,
          fieldOfStudy: fieldofstudy,
          companyId: 1,
          categoryIds: [1, 2]
        })
      });

      buscaTodos();
    } catch (e) {
      console.log(e);
    }
  }

  async function buscaTodos() {
    try {
      const token = getStoredToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const request = await fetch(`${BASE_URL}/categorie`, { headers });
      const data = await request.json();
      setCursos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
    }
  }

  async function buscaID(id) {
    try {
      const token = getStoredToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const request = await fetch(`${BASE_URL}/categorie/` + id, { headers });
      const data = await request.json();
      setCursos(data ? [data] : []);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    buscaTodos();
  }, []);

  return (
    <div>

      <h1>Cursos</h1>

      <input placeholder="Digite o ID" onChange={e => setPesquisa(e.target.value) } />
      <button onClick={()=>buscaID(pesquisa)}>Pesquisar</button>

      <hr/>

      <table>
        <tr>
          <td>ID</td>
          <td>Nome</td>
          <td>Descrição</td>
        </tr>
        {
          curso.map(
            i =>
              <tr>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.description}</td>

              </tr>
          )
        }

      </table>

      <hr />
 
        <p>Inserir</p>
        <input  onChange={e => setNome(e.target.value)} placeholder="nome" />
        <input onChange={e => setDescricao(e.target.value)} placeholder="Descrição" />
        <input  onChange={e => setWorkload(e.target.value)} placeholder="Duração"/>
        <input onChange={e => setUrlImg(e.target.value)} placeholder="Url da curso" />
        <input  onChange={e => setFieldOfStudy(e.target.value)} placeholder="Campo de estudo" />
        <button onClick={Inserir}>Inserir</button>
 
        <hr />



















    </div>




  )


}


export default App;