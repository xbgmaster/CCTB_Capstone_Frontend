import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { Briefcase, Building2, LayoutDashboard, PlusCircle, Star } from 'lucide-react';
import EmployerDashboard from './EmployerDashboard.jsx';
import CompanyProfilePage from './CompanyProfilePage.jsx';
import EmployerJobsPage from './EmployerJobsPage.jsx';
import EmployerJobDetailPage from './EmployerJobDetailPage.jsx';
import PostJobPage from './PostJobPage.jsx';
import EmployerReviewsPage from './EmployerReviewsPage.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';

export default function EmployerRoutes() {
  const { currentUser } = useAuth();
  const { jobs } = useData();
  const myJobs = jobs.filter((j) => j.companyId === currentUser.companyId);
  // We don't have the full applications list on the client for employers, so
  // we approximate "new applications to review" by summing JobDto.applicationCount
  // across open jobs. Exact breakdown lives on the per-job page.
  const newApplications = myJobs
    .filter((j) => j.status === 'open')
    .reduce((sum, j) => sum + (j.applicationCount ?? 0), 0);

  const nav = [
    { to: '/employer', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/employer/jobs', label: 'My Jobs', icon: Briefcase, badge: myJobs.filter((j) => j.status === 'open').length || undefined },
    { to: '/employer/post', label: 'Post a Job', icon: PlusCircle },
    { to: '/employer/company', label: 'Company Profile', icon: Building2 },
    { to: '/employer/reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <Routes>
      <Route
        element={
          <DashboardLayout
            title="Employer Workspace"
            subtitle={newApplications > 0 ? `You have ${newApplications} new application${newApplications === 1 ? '' : 's'} to review.` : 'Manage your jobs and applicants.'}
            nav={nav}
          />
        }
      >
        <Route index element={<EmployerDashboard />} />
        <Route path="jobs" element={<EmployerJobsPage />} />
        <Route path="jobs/:id" element={<EmployerJobDetailPage />} />
        <Route path="post" element={<PostJobPage />} />
        <Route path="company" element={<CompanyProfilePage />} />
        <Route path="reviews" element={<EmployerReviewsPage />} />
      </Route>
    </Routes>
  );
}
