import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Course from './pages/Course/Course';
import CoursesCatalog from './pages/CoursesCatalog/CoursesCatalog';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/cursos" element={<CoursesCatalog />} />
      </Routes>
    </>
  );
}

export default App;


