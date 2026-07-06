import { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';
import StarRating from '../../components/ui/StarRating.jsx';

const PROVINCES = ['', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
const TEAM_SIZES = ['1-10', '10-50', '50-200', '200+'];

export default function CompanyProfilePage() {
  const { currentUser } = useAuth();
  const { companies, updateCompany } = useData();
  const { toast } = useToast();

  const company = companies.find((c) => c.id === currentUser.companyId);
  const [form, setForm] = useState(company || {});

  if (!company) {
    return (
      <div className="card p-6">
        <p className="text-sm text-ink-600">No company linked to your account.</p>
      </div>
    );
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany(company.id, form);
    toast({ type: 'success', title: 'Company profile saved' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Building2 size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-ink-900">Company information</h2>
            <p className="text-sm text-ink-500">
              This information appears on your public company page and job posts.
            </p>
          </div>
          <div className="text-right">
            <StarRating value={company.rating} size={14} />
            <p className="text-xs text-ink-500">{company.rating.toFixed(1)} ({company.reviewCount} reviews)</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Company name</label>
            <input className="input" value={form.name || ''} onChange={update('name')} required />
          </div>
          <div>
            <label className="label">Industry</label>
            <input className="input" value={form.industry || ''} onChange={update('industry')} />
          </div>
          <div>
            <label className="label">Business number</label>
            <input className="input" value={form.businessNumber || ''} onChange={update('businessNumber')} placeholder="123456789RC0001" />
          </div>
          <div>
            <label className="label">Founded year</label>
            <input
              type="number"
              className="input"
              value={form.foundedYear || ''}
              onChange={update('foundedYear')}
            />
          </div>
          <div>
            <label className="label">Team size</label>
            <select className="input" value={form.employeeCount || ''} onChange={update('employeeCount')}>
              <option value="">Select...</option>
              {TEAM_SIZES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={form.description || ''}
              onChange={update('description')}
              placeholder="Tell workers what your company is known for..."
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink-900">Contact & location</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Street address</label>
            <input className="input" value={form.address || ''} onChange={update('address')} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city || ''} onChange={update('city')} />
          </div>
          <div>
            <label className="label">Province</label>
            <select className="input" value={form.province || ''} onChange={update('province')}>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p || 'Select...'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone || ''} onChange={update('phone')} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email || ''} onChange={update('email')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Website</label>
            <input className="input" value={form.website || ''} onChange={update('website')} placeholder="https://" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          <Save size={14} /> Save changes
        </button>
      </div>
    </form>
  );
}
