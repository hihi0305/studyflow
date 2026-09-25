import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CoursesPage } from "./pages/CoursesPage";
// import { NavBar } from "./components/layout/NavBar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
        {/* Other routes: /, /login, /register */}
      </Routes>
    </Router>
  );
}

export default App;
