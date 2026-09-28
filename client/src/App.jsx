import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/layout/NavBar";
import { CoursesPage } from "./pages/CoursesPage";
import { TasksPage } from "./pages/TasksPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<div className="p-8 text-center">Dashboard Placeholder</div>} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
