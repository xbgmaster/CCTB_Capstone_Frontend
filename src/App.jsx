import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import RoleGuard from './components/auth/RoleGuard.jsx';
import { ROLES } from './data/seed.js';

import LandingPage from './pages/public/LandingPage.jsx';
import HowItWorksPage from './pages/public/HowItWorksPage.jsx';
import BrowseJobsPage from './pages/public/BrowseJobsPage.jsx';
import JobDetailPage from './pages/public/JobDetailPage.jsx';
import CompaniesPage from './pages/public/CompaniesPage.jsx';
import CompanyDetailPage from './pages/public/CompanyDetailPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import NotFoundPage from './pages/system/NotFoundPage.jsx';
import ForbiddenPage from './pages/system/ForbiddenPage.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';

import EmployerRoutes from './pages/employer/EmployerRoutes.jsx';
import WorkerRoutes from './pages/worker/WorkerRoutes.jsx';
import AdminRoutes from './pages/admin/AdminRoutes.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<HowItWorksPage />} />
        <Route path="jobs" element={<BrowseJobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="notifications"
          element={
            <RoleGuard allowed={[ROLES.EMPLOYER, ROLES.WORKER, ROLES.ADMIN]}>
              <NotificationsPage />
            </RoleGuard>
          }
        />

        <Route
          path="employer/*"
          element={
            <RoleGuard allowed={[ROLES.EMPLOYER]}>
              <EmployerRoutes />
            </RoleGuard>
          }
        />
        <Route
          path="worker/*"
          element={
            <RoleGuard allowed={[ROLES.WORKER]}>
              <WorkerRoutes />
            </RoleGuard>
          }
        />
        <Route
          path="admin/*"
          element={
            <RoleGuard allowed={[ROLES.ADMIN]}>
              <AdminRoutes />
            </RoleGuard>
          }
        />

        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
