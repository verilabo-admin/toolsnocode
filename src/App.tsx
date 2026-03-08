import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import ToolFormPage from './pages/ToolFormPage';
import ExpertsPage from './pages/ExpertsPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import ExpertFormPage from './pages/ExpertFormPage';
import TutorialsPage from './pages/TutorialsPage';
import TutorialDetailPage from './pages/TutorialDetailPage';
import TutorialFormPage from './pages/TutorialFormPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectFormPage from './pages/ProjectFormPage';
import AuthPage from './pages/AuthPage';
import FavoritesPage from './pages/FavoritesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/new" element={<ToolFormPage />} />
            <Route path="tools/:slug/edit" element={<ToolFormPage />} />
            <Route path="tools/:slug" element={<ToolDetailPage />} />
            <Route path="experts" element={<ExpertsPage />} />
            <Route path="experts/new" element={<ExpertFormPage />} />
            <Route path="experts/:slug/edit" element={<ExpertFormPage />} />
            <Route path="experts/:slug" element={<ExpertDetailPage />} />
            <Route path="tutorials" element={<TutorialsPage />} />
            <Route path="tutorials/new" element={<TutorialFormPage />} />
            <Route path="tutorials/:slug/edit" element={<TutorialFormPage />} />
            <Route path="tutorials/:slug" element={<TutorialDetailPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/:slug/edit" element={<ProjectFormPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
