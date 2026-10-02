import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { NavBar } from "./components/layout/NavBar";
import { TasksPage } from "./pages/TasksPage";
import { CoursesPage } from "./pages/CoursesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </>
  );
}
