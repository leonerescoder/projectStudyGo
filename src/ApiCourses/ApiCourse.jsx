import { useEffect, useState } from "react";

export const BASE_URL = "http://10.60.44.43:3000";

export async function buscaTodos() {
  const request = await fetch(`${BASE_URL}/course`);
  if (!request.ok) throw new Error("Erro ao buscar cursos");
  const data = await request.json();
  return data;
}

export async function buscaID(id) {
  const request = await fetch(`${BASE_URL}/course/${id}`);
  if (!request.ok) throw new Error("Erro ao buscar curso específico");
  const data = await request.json();
  return data;
}

function App() {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJ0eXBlIjoiRElSRUNUT1IiLCJlbWFpbCI6ImdhYmlAdGVzdC5jb20iLCJuYW1lIjoiR2FiaSAiLCJpYXQiOjE3ODkxNjQ4OTcsImV4cCI6MTc4OTI1MTI5N30.5URmYjIa0iPscnTYo5OK0M07HTQFaJ57pp8Pw-CvZXw"

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
      const request = await fetch(`${BASE_URL}/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          name: nome,
          description: descricao,
          workload: Number(workload),
          urlImg: urlimg,
          fieldOfStudy: fieldofstudy,
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