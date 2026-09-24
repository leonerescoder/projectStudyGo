import { useEffect, useState } from "react";
import { BASE_URL, getStoredToken } from "../API/apiClient";

export { BASE_URL };

export async function buscaTodos() {
  const token = getStoredToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const request = await fetch(`${BASE_URL}/course`, { headers });
  if (!request.ok) throw new Error("Erro ao buscar cursos");
  const data = await request.json();
  return data;
}

export async function buscaID(id) {
  const token = getStoredToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const request = await fetch(`${BASE_URL}/course/${id}`, { headers });
  if (!request.ok) throw new Error("Erro ao buscar curso específico");
  const data = await request.json();
  return data;
}

function App() {
  const [curso, setCursos] = useState([]);
  const [pesquisa, setPesquisa] = useState(0);

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [workload, setWorkload] = useState(0)
  const [urlimg, setUrlImg] = useState("")
  const [fieldofstudy, setFieldOfStudy] = useState('')
  const [companyId, setCompanyId] = useState(1)

  async function Inserir() {
    try {
      const token = getStoredToken();
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const request = await fetch(`${BASE_URL}/course`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: nome,
          description: descricao,
          workload: Number(workload),
          urlImg: urlimg,
          fieldOfStudy: fieldofstudy,
          ranking: 0,
          companyId: Number(companyId),
          categoryIds: [1, 2]
        })
      })

      if (!request.ok) {
        throw new Error("Erro ao inserir o curso");
      }

      carregarTodos()

      setNome("")
      setDescricao("")
      setWorkload(0)
      setUrlImg("")
      setFieldOfStudy("")
      setCompanyId(1)

    } catch (e) {
      console.error(e)
      alert("Erro ao inserir: " + e.message)
    }
  }




  useEffect(() => {
    carregarTodos()
  }, [])

  return (
    <div>

      <h1>Cursos</h1>

      <input placeholder="Digite o ID" onChange={e => setPesquisa(e.target.value)} />
      <button onClick={() => buscarUm(pesquisa)}>Pesquisar</button>

      <hr />

      <table>
        <tr>
          <td>ID</td>
          <td>Nome</td>
          <td>Descrição</td>
          <td>ID da Escola</td>
        </tr>
        {
          curso.map(
            i =>
              <tr>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.description}</td>
                <td>{i.companyId}</td>
              </tr>
          )
        }

      </table>

      <hr />

      <p>Inserir</p>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="nome" />
      <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" />
      <input value={workload} onChange={e => setWorkload(e.target.value)} placeholder="Duração" type="number" />
      <input value={urlimg} onChange={e => setUrlImg(e.target.value)} placeholder="Url da curso" />
      <input value={fieldofstudy} onChange={e => setFieldOfStudy(e.target.value)} placeholder="Campo de estudo" />
      <input value={companyId} onChange={e => setCompanyId(e.target.value)} placeholder="ID da Escola" type="number" />
      <button onClick={Inserir}>Inserir</button>

      <hr />

    </div>

  )

}


export default App;