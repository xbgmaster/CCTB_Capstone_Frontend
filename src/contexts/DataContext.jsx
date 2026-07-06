import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ROLES } from '../data/seed.js';
import { useAuth } from './AuthContext.jsx';
import {
  adminApi,
  applicationsApi,
  companiesApi,
  jobsApi,
  notificationsApi,
  reviewsApi,
  usersApi,
  workersApi,
} from '../services/endpoints.js';

const DataContext = createContext(null);

const EMPTY_STATE = {
  users: [],
  companies: [],
  workerProfiles: [],
  jobs: [],
  applications: [],
  reviews: [],
  notifications: [],
};

/**
 * Front-end store backed by the .NET API.
 *
 *   - On every auth change we re-hydrate the slices the current role needs.
 *   - Mutations call the API; on success we patch the local slice in place
 *     (or re-fetch the affected slice) so the rest of the UI stays reactive
 *     without a full page reload.
 *
 * The public interface deliberately matches the original in-memory store
 * (addJob / updateApplication / ...) so page components don't have to change.
 */
export function DataProvider({ children }) {
  const { currentUser, isAuthenticated, bootstrapping } = useAuth();
  const [state, setState] = useState(EMPTY_STATE);

  // Cache of worker profiles fetched lazily (e.g. when an employer expands
  // the applicants of a job). Keyed by userId.
  const profileCacheRef = useRef(new Map());

  // ------------------------------------------------------------------
  // Re-hydrate the store whenever the auth state changes.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (bootstrapping) return;
    let cancelled = false;

    async function load() {
      try {
        // Public data anyone (signed-in or not) can see.
        const [jobsPage, companies] = await Promise.all([
          jobsApi.list({ pageSize: 200 }),
          companiesApi.list(),
        ]);
        const jobs = jobsPage?.items || jobsPage || [];

        const next = { ...EMPTY_STATE, jobs, companies };

        if (isAuthenticated && currentUser) {
          if (currentUser.role === ROLES.WORKER) {
            const [applications, notifications, myProfile] = await Promise.all([
              applicationsApi.mine(),
              notificationsApi.mine(),
              workersApi.getMe().catch(() => null),
            ]);
            next.applications = applications;
            next.notifications = notifications;
            if (myProfile) next.workerProfiles = [myProfile];
          } else if (currentUser.role === ROLES.EMPLOYER) {
            const [notifications] = await Promise.all([notificationsApi.mine()]);
            next.notifications = notifications;
            // Applications-for-my-jobs are loaded per-job in EmployerJobDetailPage.
            next.applications = [];
          } else if (currentUser.role === ROLES.ADMIN) {
            const [users, notifications] = await Promise.all([
              usersApi.list(),
              notificationsApi.mine(),
            ]);
            next.users = users;
            next.notifications = notifications;
          }
        }

        if (!cancelled) {
          profileCacheRef.current = new Map(
            next.workerProfiles.map((p) => [p.userId, p]),
          );
          setState(next);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load data from API:', err);
          setState(EMPTY_STATE);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [bootstrapping, isAuthenticated, currentUser?.id, currentUser?.role]);

  // ------------------------------------------------------------------
  // Mutators - keep the same names as the old in-memory store.
  // Each one calls the API, then refreshes the relevant slice locally.
  // ------------------------------------------------------------------

  const refreshJobs = useCallback(async () => {
    const page = await jobsApi.list({ pageSize: 200 });
    setState((s) => ({ ...s, jobs: page?.items || page || [] }));
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!currentUser) return;
    const notifications = await notificationsApi.mine();
    setState((s) => ({ ...s, notifications }));
  }, [currentUser]);

  const refreshApplications = useCallback(async () => {
    if (!currentUser || currentUser.role !== ROLES.WORKER) return;
    const applications = await applicationsApi.mine();
    setState((s) => ({ ...s, applications }));
  }, [currentUser]);

  const refreshUsers = useCallback(async () => {
    if (!currentUser || currentUser.role !== ROLES.ADMIN) return;
    const users = await usersApi.list();
    setState((s) => ({ ...s, users }));
  }, [currentUser]);

  const refreshCompanies = useCallback(async () => {
    const companies = await companiesApi.list();
    setState((s) => ({ ...s, companies }));
  }, []);

  const refreshMyWorkerProfile = useCallback(async () => {
    if (!currentUser || currentUser.role !== ROLES.WORKER) return;
    const me = await workersApi.getMe();
    profileCacheRef.current.set(me.userId, me);
    setState((s) => {
      const others = s.workerProfiles.filter((p) => p.userId !== me.userId);
      return { ...s, workerProfiles: [...others, me] };
    });
  }, [currentUser]);

  // Allow other pages to ensure a worker profile is loaded into the store
  // (used by employer pages so they can show skills/headline on applicants).
  const ensureWorkerProfile = useCallback(async (userId) => {
    if (!userId) return null;
    if (profileCacheRef.current.has(userId)) return profileCacheRef.current.get(userId);
    try {
      const p = await workersApi.get(userId);
      profileCacheRef.current.set(userId, p);
      setState((s) => {
        const others = s.workerProfiles.filter((x) => x.userId !== userId);
        return { ...s, workerProfiles: [...others, p] };
      });
      return p;
    } catch {
      return null;
    }
  }, []);

  // ----- Users -----
  const updateUser = useCallback(async (id, patch) => {
    if (Object.prototype.hasOwnProperty.call(patch, 'status')) {
      await usersApi.setStatus(id, patch.status);
      await refreshUsers();
    }
  }, [refreshUsers]);

  // ----- Companies -----
  const updateCompany = useCallback(async (id, patch) => {
    const payload = {
      name: patch.name,
      industry: patch.industry ?? null,
      businessNumber: patch.businessNumber ?? null,
      website: patch.website ?? null,
      email: patch.email ?? null,
      phone: patch.phone ?? null,
      address: patch.address ?? null,
      city: patch.city ?? null,
      province: patch.province ?? null,
      foundedYear: patch.foundedYear ? Number(patch.foundedYear) : null,
      employeeCount: patch.employeeCount ?? null,
      description: patch.description ?? null,
    };
    if (Object.prototype.hasOwnProperty.call(patch, 'verified')) {
      await companiesApi.verify(id, patch.verified);
    } else {
      await companiesApi.update(id, payload);
    }
    await refreshCompanies();
  }, [refreshCompanies]);

  // ----- Worker profiles -----
  const upsertWorkerProfile = useCallback(async (userId, patch) => {
    const payload = {
      headline: patch.headline ?? null,
      bio: patch.bio ?? null,
      yearsExperience: Number(patch.yearsExperience) || 0,
      hourlyRate: Number(patch.hourlyRate) || 0,
      availability: patch.availability || 'Flexible',
      skills: patch.skills || [],
      certifications: patch.certifications || [],
      experiences: (patch.experience || patch.experiences || []).map((e) => ({
        title: e.title || '',
        company: e.company || '',
        from: e.from || '',
        to: e.to || '',
      })),
      phone: patch.phone ?? null,
      city: patch.city ?? null,
      province: patch.province ?? null,
      firstName: patch.firstName ?? null,
      lastName: patch.lastName ?? null,
    };
    await workersApi.upsertMe(payload);
    await refreshMyWorkerProfile();
  }, [refreshMyWorkerProfile]);

  // ----- Jobs -----
  const addJob = useCallback(async (job) => {
    const payload = {
      title: job.title,
      category: job.category,
      description: job.description,
      activity: job.activity ?? null,
      location: job.location,
      dueDate: new Date(job.dueDate).toISOString(),
      paymentType: job.paymentType?.toLowerCase?.() || 'hourly',
      paymentAmount: Number(job.paymentAmount) || 0,
      skillsRequired: job.skillsRequired || [],
    };
    const created = await jobsApi.create(payload);
    await refreshJobs();
    return created;
  }, [refreshJobs]);

  const updateJob = useCallback(async (id, patch) => {
    if (Object.prototype.hasOwnProperty.call(patch, 'status') && Object.keys(patch).length === 1) {
      await jobsApi.changeStatus(id, patch.status);
    } else {
      const existing = state.jobs.find((j) => j.id === id) || {};
      const merged = { ...existing, ...patch };
      const payload = {
        title: merged.title,
        category: merged.category,
        description: merged.description,
        activity: merged.activity ?? null,
        location: merged.location,
        dueDate: new Date(merged.dueDate).toISOString(),
        paymentType: merged.paymentType?.toLowerCase?.() || 'hourly',
        paymentAmount: Number(merged.paymentAmount) || 0,
        skillsRequired: merged.skillsRequired || [],
      };
      await jobsApi.update(id, payload);
    }
    await refreshJobs();
  }, [state.jobs, refreshJobs]);

  const deleteJob = useCallback(async (id) => {
    await jobsApi.remove(id);
    await refreshJobs();
  }, [refreshJobs]);

  // ----- Applications -----
  const addApplication = useCallback(async (application) => {
    const payload = {
      jobId: application.jobId,
      coverLetter: application.coverLetter,
      expectedRate: Number(application.expectedRate) || 0,
    };
    const created = await applicationsApi.apply(payload);
    await Promise.all([refreshApplications(), refreshJobs()]);
    return created;
  }, [refreshApplications, refreshJobs]);

  const updateApplication = useCallback(async (id, patch) => {
    if (!Object.prototype.hasOwnProperty.call(patch, 'status')) return;
    await applicationsApi.changeStatus(id, patch.status);
    await Promise.all([refreshApplications(), refreshJobs(), refreshNotifications()]);
  }, [refreshApplications, refreshJobs, refreshNotifications]);

  // ----- Reviews -----
  const addReview = useCallback(async (review) => {
    const payload = {
      toUserId: review.toUserId ?? null,
      toCompanyId: review.toCompanyId ?? null,
      jobId: review.jobId ?? null,
      rating: Number(review.rating),
      comment: review.comment,
    };
    const created = await reviewsApi.create(payload);
    // Refresh companies (rating may have moved) and notifications.
    await Promise.all([refreshCompanies(), refreshNotifications()]);
    if (currentUser?.role === ROLES.WORKER) await refreshMyWorkerProfile();
    return created;
  }, [refreshCompanies, refreshNotifications, refreshMyWorkerProfile, currentUser]);

  // ----- Notifications -----
  // The backend creates these automatically as a side effect of business
  // actions. We keep this method so old call-sites (which manually
  // enqueued a notification right after a mutation) still compile - we
  // simply re-fetch instead of writing anything.
  const addNotification = useCallback(async () => {
    await refreshNotifications();
  }, [refreshNotifications]);

  const markNotificationRead = useCallback(async (id) => {
    await notificationsApi.markRead(id);
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await notificationsApi.markAllRead();
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  // ----- Admin reset -----
  const resetData = useCallback(async () => {
    await adminApi.reset();
    await Promise.all([refreshJobs(), refreshCompanies(), refreshUsers(), refreshNotifications()]);
  }, [refreshJobs, refreshCompanies, refreshUsers, refreshNotifications]);

  // ------------------------------------------------------------------
  // Loaders intended to be used directly by pages that need fresh data
  // outside of the global store (e.g. applicants for a single job).
  // ------------------------------------------------------------------
  const loadJobApplications = useCallback(async (jobId) => {
    return jobsApi.applications(jobId);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      ROLES,

      // mutators
      updateUser,
      updateCompany,
      upsertWorkerProfile,
      addJob,
      updateJob,
      deleteJob,
      addApplication,
      updateApplication,
      addReview,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      resetData,

      // helpers
      ensureWorkerProfile,
      loadJobApplications,
      refreshJobs,
      refreshNotifications,
      refreshApplications,
      refreshCompanies,
      refreshUsers,
      refreshMyWorkerProfile,
    }),
    [
      state,
      updateUser, updateCompany, upsertWorkerProfile,
      addJob, updateJob, deleteJob,
      addApplication, updateApplication,
      addReview,
      addNotification, markNotificationRead, markAllNotificationsRead,
      resetData,
      ensureWorkerProfile, loadJobApplications,
      refreshJobs, refreshNotifications, refreshApplications,
      refreshCompanies, refreshUsers, refreshMyWorkerProfile,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
