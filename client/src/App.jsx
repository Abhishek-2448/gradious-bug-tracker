import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import BugsPage from "./features/bugs/BugsPage.jsx";
import BugForm from "./features/bugs/BugForm.jsx";
import BugDetailPage from "./features/bugs/BugDetailPage.jsx";
import ProjectsPage from "./features/projects/ProjectsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bugs" element={<BugsPage />} />
          <Route path="/bugs/new" element={<BugForm />} />
          <Route path="/bugs/:id" element={<BugDetailPage />} />
          <Route path="/bugs/:id/edit" element={<BugForm />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
