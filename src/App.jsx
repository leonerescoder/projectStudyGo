import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Course from './pages/Course/Course';
import CoursesCatalog from './pages/CoursesCatalog/CoursesCatalog';
import Escolas from './pages/Escolas/Escolas';
import EscolaSelecionada from './pages/Escolas/EscolaSelecionada';
import Admin from './components/Admin';
import { AuthProvider } from './context/AuthContext';
import { LoginModal } from './components/Auth/LoginModal';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/cursos" element={<CoursesCatalog />} />
        <Route path="/escolas" element={<Escolas />} />
        <Route path="/escolas/:id" element={<EscolaSelecionada />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <LoginModal />
    </AuthProvider>
  );
}

export default App;


