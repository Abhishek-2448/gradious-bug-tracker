import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useFetch } from "../../hooks/useFetch.js";
import Badge from "../../components/Badge.jsx";
import Status from "../../components/Status.jsx";
import { STATUSES, SEVERITIES, labelOf } from "../../utils/constants.js";

function ActivityCard({ label, value, total }) {
  const percent = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="activity-card">
      <div className="activity-head">{label}</div>
      <div className="activity-value">{value}</div>
      <div className="activity-bar">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch("/dashboard/stats");

  if (loading || error) return <Status loading={loading} error={error} />;

  const assigned = data.assignedToMe;

  return (
    <div>
      <div className="page-header">
        <h1 className="greeting">Hey {user.name.toUpperCase()} !</h1>
        <Link className="button" to="/bugs/new">Report a bug</Link>
      </div>

      <div className="card">
        <h3>Bugs by status</h3>
        <div className="activity-grid">
          {STATUSES.map((s) => (
            <ActivityCard key={s.value} label={s.label} value={data.byStatus[s.value]} total={data.total} />
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Bugs by severity</h3>
        <div className="activity-grid">
          {SEVERITIES.map((s) => (
            <ActivityCard key={s} label={labelOf(s)} value={data.bySeverity[s]} total={data.total} />
          ))}
        </div>
      </div>

      <div className="strip">
        <div className="strip-main">
          <small>Assigned to me</small>
          <strong>{assigned.length}</strong>
        </div>
        {assigned.length === 0 && (
          <p className="muted strip-empty">
            {user.role === "developer"
              ? "Nothing assigned to you right now."
              : "Bugs assigned to you appear here (developers only)."}
          </p>
        )}
        {assigned.map((bug) => (
          <Link className="strip-item" key={bug._id} to={`/bugs/${bug._id}`}>
            <span className="strip-title">{bug.title}</span>
            <span className="muted">{bug.project?.name}</span>
            <span><Badge value={bug.status} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
