import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';

const CATEGORIES = ['Electrical', 'Plumbing', 'HVAC', 'Carpentry', 'Painting', 'Roofing', 'Supervision', 'General Labour', 'Other'];

export default function PostJobPage() {
  const { currentUser } = useAuth();
  const { addJob } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'Electrical',
    description: '',
    activity: '',
    location: '',
    dueDate: '',
    paymentType: 'hourly',
    paymentAmount: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills([...skills, s]);
    setSkillInput('');
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.dueDate) {
      toast({ type: 'error', title: 'Missing fields', message: 'Title, description, location, and due date are required.' });
      return;
    }
    const job = addJob({
      ...form,
      paymentAmount: Number(form.paymentAmount) || 0,
      skillsRequired: skills,
      companyId: currentUser.companyId,
    });
    toast({ type: 'success', title: 'Job posted', message: 'Your job is now live in the marketplace.' });
    navigate(`/employer/jobs/${job.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Job details</h2>
        <p className="text-sm text-ink-500">Be specific - clearer posts attract better applicants.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Job title</label>
            <input
              className="input"
              placeholder="e.g., Commercial Electrician - Tower Project"
              value={form.title}
              onChange={update('title')}
              required
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={update('category')}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input
              className="input"
              placeholder="e.g., Toronto, ON"
              value={form.location}
              onChange={update('location')}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input min-h-[120px] resize-y"
              value={form.description}
              onChange={update('description')}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Activity / Schedule</label>
            <textarea
              className="input min-h-[80px] resize-y"
              placeholder="Hours, shifts, on-site requirements..."
              value={form.activity}
              onChange={update('activity')}
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Required skills</h2>
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
              <PlusCircle size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Schedule & offer</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={form.dueDate} onChange={update('dueDate')} required />
          </div>
          <div>
            <label className="label">Payment type</label>
            <select className="input" value={form.paymentType} onChange={update('paymentType')}>
              <option value="hourly">Hourly</option>
              <option value="fixed">Fixed</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div>
            <label className="label">Amount (CAD)</label>
            <input
              type="number"
              min="0"
              className="input"
              value={form.paymentAmount}
              onChange={update('paymentAmount')}
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={() => navigate('/employer/jobs')}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Publish job
        </button>
      </div>
    </form>
  );
}
