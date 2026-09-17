import { useEffect, useState } from "react";

function App() {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJ0eXBlIjoiRElSRUNUT1IiLCJlbWFpbCI6ImdhYmlAdGVzdC5jb20iLCJuYW1lIjoiR2FiaSAiLCJpYXQiOjE3ODkxNjQ4OTcsImV4cCI6MTc4OTI1MTI5N30.5URmYjIa0iPscnTYo5OK0M07HTQFaJ57pp8Pw-CvZXw"

  const [companie, setCompanie] = useState([]);

  const [pesquisa, setPesquisa] = useState(0);
  
  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [foundation, setFoundation] = useState("")
  const [places, setPlaces] = useState("")
  const [fundamentals, setFundamentals] = useState("")
  const [methods, setMethods] = useState("")
  const [ranking, setRanking] = useState(0)
 
   async function Inserir (){
        try {
          const request = await fetch('http://10.60.44.43:3000/companie', {
            method: 'POST',
            headers: { 
              'Authorization': 'Bearer '+token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: nome,
              cnpj: cnpj,
              foundation: foundation,
              places: places,
              fundamentals: fundamentals,
              methods: methods,
              ranking: Number(ranking),
              userId: 1
              })
          })
 
          buscaTodos()
 
          } catch (e) {
        console.log(e)
        }
  }
    
  async function buscaTodos() {
    try {
      const request = await fetch("http://10.60.44.43:3000/companie", {
        headers: {
          'Authorization': 'Bearer '+token
        }
      })

      const data = await request.json()
      
      setCompanie(data)
    } catch (e) {
      console.log(e)
    }

  }

  async function buscaID(id) {
    try {
      const request = await fetch("http://10.60.44.43:3000/companie/"+ id, {
        headers: {
          'Authorization': 'Bearer '+token
        }
      })

      const data = await request.json()
      console.log(data)
      setCompanie([data])
    } catch (e) {
      console.log(e)
    }

  }

  useEffect(() => {
    buscaTodos()
  }, [])

  return (
    <div>

      <h1>Companies</h1>

      <input placeholder="Digite o ID" onChange={e => setPesquisa(e.target.value) } />
      <button onClick={()=>buscaID(pesquisa)}>Pesquisar</button>

      <hr/>

      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nome</td>
            <td>CNPJ</td>
            <td>Fundação</td>
          </tr>
        </thead>
        <tbody>
        {
          companie.map(
            i =>
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.cnpj}</td>
                <td>{i.foundation}</td>
              </tr>
          )
        }
        </tbody>
      </table>

      <hr />
 
        <p>Inserir</p>
        <input onChange={e => setNome(e.target.value)} placeholder="Nome" />
        <input onChange={e => setCnpj(e.target.value)} placeholder="CNPJ" />
        <input onChange={e => setFoundation(e.target.value)} placeholder="Fundação" />
        <input onChange={e => setPlaces(e.target.value)} placeholder="Locais de atuação" />
        <input onChange={e => setFundamentals(e.target.value)} placeholder="Fundamentos" />
        <input onChange={e => setMethods(e.target.value)} placeholder="Métodos" />
        <input onChange={e => setRanking(e.target.value)} placeholder="Ranking" type="number" />
        <button onClick={Inserir}>Inserir</button>
 
        <hr />

    </div>
  )
}

export default App;
