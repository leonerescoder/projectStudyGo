import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Course from './pages/Course/Course';
<<<<<<< Updated upstream
import CoursesCatalog from './pages/CoursesCatalog/CoursesCatalog';
=======
import Escolas from './pages/Escolas/Escolas';
import EscolaSelecionada from './pages/Escolas/EscolaSelecionada';
>>>>>>> Stashed changes

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<Course />} />
<<<<<<< Updated upstream
        <Route path="/cursos" element={<CoursesCatalog />} />
=======
        <Route path="/escolas" element={<Escolas />} />
        <Route path="/escolas/:id" element={<EscolaSelecionada />} />
>>>>>>> Stashed changes
      </Routes>
    </>
  );
}

export default App;


