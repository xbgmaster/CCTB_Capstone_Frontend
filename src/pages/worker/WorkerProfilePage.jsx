import { useEffect, useState } from 'react';
import { Award, Briefcase, Plus, Save, Trash2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import { reviewsApi } from '../../services/endpoints.js';
import StarRating from '../../components/ui/StarRating.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const AVAILABILITIES = ['Full-time', 'Part-time', 'Flexible', 'Weekends only'];

export default function WorkerProfilePage() {
  const { currentUser, refreshMe } = useAuth();
  const { workerProfiles, upsertWorkerProfile } = useData();
  const { toast } = useToast();
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    reviewsApi
      .forUser(currentUser.id)
      .then((rows) => { if (!cancelled) setMyReviews(rows || []); })
      .catch(() => { if (!cancelled) setMyReviews([]); });
    return () => { cancelled = true; };
  }, [currentUser.id]);
  const profile = workerProfiles.find((p) => p.userId === currentUser.id) || {
    userId: currentUser.id,
    headline: '',
    bio: '',
    yearsExperience: 0,
    hourlyRate: 0,
    availability: 'Flexible',
    skills: [],
    certifications: [],
    experience: [],
    rating: 0,
    reviewCount: 0,
  };

  const [form, setForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phone: currentUser.phone || '',
    city: currentUser.city || '',
    province: currentUser.province || '',
    headline: profile.headline || '',
    bio: profile.bio || '',
    yearsExperience: profile.yearsExperience || 0,
    hourlyRate: profile.hourlyRate || 0,
    availability: profile.availability || 'Flexible',
  });
  const [skills, setSkills] = useState(profile.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [certs, setCerts] = useState(profile.certifications || []);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', year: '' });
  const [experiences, setExperiences] = useState(profile.experience || []);
  const [expForm, setExpForm] = useState({ title: '', company: '', from: '', to: '' });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills([...skills, s]);
    setSkillInput('');
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const addCert = () => {
    if (!certForm.name.trim()) return;
    setCerts([...certs, { ...certForm, year: certForm.year || new Date().getFullYear() }]);
    setCertForm({ name: '', issuer: '', year: '' });
  };

  const removeCert = (idx) => setCerts(certs.filter((_, i) => i !== idx));

  const addExperience = () => {
    if (!expForm.title.trim() || !expForm.company.trim()) return;
    setExperiences([...experiences, { ...expForm }]);
    setExpForm({ title: '', company: '', from: '', to: '' });
  };

  const removeExperience = (idx) => setExperiences(experiences.filter((_, i) => i !== idx));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // upsertWorkerProfile sends both user-level fields and profile fields
      // in a single request handled by PUT /api/workers/me.
      await upsertWorkerProfile(currentUser.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        city: form.city,
        province: form.province,
        headline: form.headline,
        bio: form.bio,
        yearsExperience: Number(form.yearsExperience) || 0,
        hourlyRate: Number(form.hourlyRate) || 0,
        availability: form.availability,
        skills,
        certifications: certs,
        experiences,
      });
      await refreshMe();
      toast({ type: 'success', title: 'Profile saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Save failed', message: err.message });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar initials={currentUser.avatar} seed={currentUser.id} size="xl" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-ink-900">
              {form.firstName} {form.lastName}
            </h2>
            <p className="text-sm text-ink-500">{form.headline || 'Add a headline below'}</p>
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={profile.rating} size={14} />
              <span className="text-xs text-ink-500">
                {profile.rating ? `${profile.rating.toFixed(1)} (${profile.reviewCount})` : 'No reviews yet'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">First name</label>
            <input className="input" value={form.firstName} onChange={update('firstName')} required />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" value={form.lastName} onChange={update('lastName')} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={update('phone')} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={update('city')} />
          </div>
          <div>
            <label className="label">Province</label>
            <input className="input" value={form.province} onChange={update('province')} />
          </div>
          <div>
            <label className="label">Availability</label>
            <select className="input" value={form.availability} onChange={update('availability')}>
              {AVAILABILITIES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Headline</label>
            <input
              className="input"
              value={form.headline}
              onChange={update('headline')}
              placeholder="e.g., Journeyman Electrician - Red Seal Certified"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">About</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={form.bio}
              onChange={update('bio')}
              placeholder="Tell employers about your experience..."
            />
          </div>
          <div>
            <label className="label">Years of experience</label>
            <input type="number" min="0" className="input" value={form.yearsExperience} onChange={update('yearsExperience')} />
          </div>
          <div>
            <label className="label">Hourly rate (CAD)</label>
            <input type="number" min="0" className="input" value={form.hourlyRate} onChange={update('hourlyRate')} />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Skills</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {skills.map((s) => (
            <span key={s} className="badge-brand">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="ml-1 -mr-0.5 rounded-full p-0.5 hover:bg-brand-100">
                <X size={10} />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-2">
            <input
              className="input w-48"
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button type="button" className="btn-secondary" onClick={addSkill}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Certifications</h2>
        <div className="mt-3 space-y-2">
          {certs.length === 0 && <p className="text-sm text-ink-500">No certifications added yet.</p>}
          {certs.map((c, i) => (
            <div key={`${c.name}-${i}`} className="flex items-center justify-between rounded-lg border border-ink-200 bg-ink-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Award size={14} className="text-brand-600" />
                <div className="text-sm">
                  <p className="font-semibold text-ink-900">{c.name}</p>
                  <p className="text-xs text-ink-500">{c.issuer} - {c.year}</p>
                </div>
              </div>
              <button type="button" className="text-ink-400 hover:text-red-600" onClick={() => removeCert(i)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
          <input className="input" placeholder="Certificate name" value={certForm.name} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} />
          <input className="input" placeholder="Issuer" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
          <input type="number" className="input" placeholder="Year" value={certForm.year} onChange={(e) => setCertForm({ ...certForm, year: e.target.value })} />
          <button type="button" className="btn-secondary" onClick={addCert}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Experience</h2>
        <div className="mt-3 space-y-2">
          {experiences.length === 0 && <p className="text-sm text-ink-500">No experience entries yet.</p>}
          {experiences.map((x, i) => (
            <div key={`${x.title}-${i}`} className="flex items-center justify-between rounded-lg border border-ink-200 bg-ink-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold text-ink-900">{x.title}</p>
                  <p className="text-xs text-ink-500">{x.company} - {x.from} to {x.to}</p>
                </div>
              </div>
              <button type="button" className="text-ink-400 hover:text-red-600" onClick={() => removeExperience(i)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_120px_120px_auto]">
          <input className="input" placeholder="Job title" value={expForm.title} onChange={(e) => setExpForm({ ...expForm, title: e.target.value })} />
          <input className="input" placeholder="Company" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} />
          <input className="input" placeholder="From (year)" value={expForm.from} onChange={(e) => setExpForm({ ...expForm, from: e.target.value })} />
          <input className="input" placeholder="To" value={expForm.to} onChange={(e) => setExpForm({ ...expForm, to: e.target.value })} />
          <button type="button" className="btn-secondary" onClick={addExperience}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {myReviews.length > 0 && (
        <div className="card p-5">
          <h2 className="text-lg font-bold text-ink-900">Reviews you've received</h2>
          <div className="mt-3 space-y-2">
            {myReviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-ink-200 bg-ink-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-900">{r.fromUserName || 'Employer'}</p>
                  <StarRating value={r.rating} size={14} />
                </div>
                {r.jobTitle && <p className="text-xs text-ink-500">On: {r.jobTitle}</p>}
                <p className="mt-1 text-sm text-ink-700">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {myReviews.length === 0 && (
        <EmptyState icon={Award} title="No reviews yet" description="Complete a job to start collecting reviews." />
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          <Save size={14} /> Save profile
        </button>
      </div>
    </form>
  );
}
