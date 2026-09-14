import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Course from './pages/Course/Course';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/course/1" replace />} />
        <Route path="/course/:id" element={<Course />} />
      </Routes>
    </>
  );
}

export default App;
