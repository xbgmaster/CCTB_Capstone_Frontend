import { Route, Routes } from 'react-router-dom';
import { BarChart3, Briefcase, Building2, LayoutDashboard, Settings, Users } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import AdminOverview from './AdminOverview.jsx';
import AdminUsersPage from './AdminUsersPage.jsx';
import AdminCompaniesPage from './AdminCompaniesPage.jsx';
import AdminJobsPage from './AdminJobsPage.jsx';
import AdminReportsPage from './AdminReportsPage.jsx';
import AdminSettingsPage from './AdminSettingsPage.jsx';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout title="Administration" subtitle="Platform-wide controls and analytics." nav={NAV} />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="companies" element={<AdminCompaniesPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
