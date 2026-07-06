const APP_STATUS = {
  submitted:   { label: 'Submitted',   cls: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', cls: 'badge-amber' },
  selected:    { label: 'Selected',    cls: 'badge-green' },
  rejected:    { label: 'Not selected', cls: 'badge-red' },
  withdrawn:   { label: 'Withdrawn',   cls: 'badge-gray' },
};

const JOB_STATUS = {
  open:   { label: 'Open',   cls: 'badge-green' },
  paused: { label: 'Paused', cls: 'badge-amber' },
  closed: { label: 'Closed', cls: 'badge-gray' },
  filled: { label: 'Filled', cls: 'badge-blue' },
};

const USER_STATUS = {
  active:    { label: 'Active',    cls: 'badge-green' },
  suspended: { label: 'Suspended', cls: 'badge-red' },
  pending:   { label: 'Pending',   cls: 'badge-amber' },
};

export default function StatusBadge({ value, kind = 'application' }) {
  const map = kind === 'job' ? JOB_STATUS : kind === 'user' ? USER_STATUS : APP_STATUS;
  const config = map[value] || { label: value, cls: 'badge-gray' };
  return <span className={config.cls}>{config.label}</span>;
}
