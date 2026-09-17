import { useEffect, useState } from "react";


function App() {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJ0eXBlIjoiRElSRUNUT1IiLCJlbWFpbCI6ImdhYmlAdGVzdC5jb20iLCJuYW1lIjoiR2FiaSAiLCJpYXQiOjE3ODkxNjQ4OTcsImV4cCI6MTc4OTI1MTI5N30.5URmYjIa0iPscnTYo5OK0M07HTQFaJ57pp8Pw-CvZXw"

  const [curso, setCursos] = useState([]);

  const [pesquisa, setPesquisa] = useState(0);

  

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [workload, setWorkload] = useState(0)
  const [urlimg, setUrlImg] = useState("")
  const [fieldofstudy, setFieldOfStudy] = useState('')
 


   async function Inserir (){
        try {
          const request = await fetch('http://10.60.44.43:3000/categorie', {
            method: 'POST',
            headers: { 
              'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
              name: nome,
              description: descricao,
              workload: workload,
              urlImg: urlimg,
              fieldOfStudy: fieldofstudy,
              companyId: 1,
              categoryIds: [1, 2]
              })
          })
 
          buscaTodos()
 
          } catch (e) {
        console.log(e)
        }
  }
    
   
  async function buscaTodos() {
    try {


      const request = await fetch("http://10.60.44.43:3000/categorie")

      const data = await request.json()
      
      setCursos(data)
    } catch (e) {
      console.log("")
    }

  }

  async function buscaID(id) {
    try {


      const request = await fetch("http://10.60.44.43:3000/categorie/"+ id)

      const data = await request.json()
      console.log(data)
      setCursos([data])
    } catch (e) {
      console.log("")
    }

  }



  useEffect(() => {
    buscaTodos()
  }, [])

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