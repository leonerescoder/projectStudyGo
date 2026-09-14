<<<<<<< Updated upstream
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
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
>>>>>>> Stashed changes
