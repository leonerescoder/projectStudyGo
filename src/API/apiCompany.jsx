import { useEffect, useState } from "react";
import { BASE_URL, getStoredToken } from "./apiClient";

export async function buscaEmpresas() {
  const token = getStoredToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const request = await fetch(`${BASE_URL}/companie`, { headers });
  if (!request.ok) throw new Error("Erro ao buscar escolas");
  const data = await request.json();
  return Array.isArray(data) ? data : [];
}

function App() {
  const [companie, setCompanie] = useState([]);
  const [pesquisa, setPesquisa] = useState(0);
  
  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [foundation, setFoundation] = useState("")
  const [places, setPlaces] = useState("")
  const [fundamentals, setFundamentals] = useState("")
  const [methods, setMethods] = useState("")
  const [ranking, setRanking] = useState(0)

  async function Inserir() {
    try {
      const token = getStoredToken();
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const request = await fetch(`${BASE_URL}/companie`, {
        method: 'POST',
        headers,
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

      const request = await fetch(`${BASE_URL}/companie`, {
        headers
      });

      const data = await request.json();
      setCompanie(Array.isArray(data) ? data : []);
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

      const request = await fetch(`${BASE_URL}/companie/` + id, {
        headers
      });

      const data = await request.json();
      setCompanie(data ? [data] : []);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    buscaTodos();
  }, []);

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
