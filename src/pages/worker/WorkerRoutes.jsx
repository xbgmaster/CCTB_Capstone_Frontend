import { Route, Routes } from 'react-router-dom';
import { Briefcase, ClipboardList, LayoutDashboard, Search, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import WorkerDashboard from './WorkerDashboard.jsx';
import WorkerProfilePage from './WorkerProfilePage.jsx';
import WorkerJobsPage from './WorkerJobsPage.jsx';
import WorkerApplicationsPage from './WorkerApplicationsPage.jsx';

export default function WorkerRoutes() {
  const { currentUser } = useAuth();
  const { applications } = useData();

  const myApps = applications.filter((a) => a.workerId === currentUser.id);
  const activeCount = myApps.filter((a) => ['submitted', 'shortlisted'].includes(a.status)).length;

  const nav = [
    { to: '/worker', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/worker/jobs', label: 'Find Jobs', icon: Search },
    { to: '/worker/applications', label: 'My Applications', icon: ClipboardList, badge: activeCount || undefined },
    { to: '/worker/profile', label: 'My Profile', icon: User },
  ];

  return (
    <Routes>
      <Route
        element={
          <DashboardLayout
            title="Worker Workspace"
            subtitle="Find jobs, track your applications, and grow your profile."
            nav={nav}
          />
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route path="profile" element={<WorkerProfilePage />} />
        <Route path="jobs" element={<WorkerJobsPage />} />
        <Route path="applications" element={<WorkerApplicationsPage />} />
      </Route>
    </Routes>
  );
}
