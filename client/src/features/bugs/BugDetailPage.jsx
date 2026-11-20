import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../api/axiosInstance.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useUsers } from "../../hooks/useUsers.js";
import Badge from "../../components/Badge.jsx";
import Status from "../../components/Status.jsx";
import CommentSection from "./CommentSection.jsx";
import { STATUSES, formatDate } from "../../utils/constants.js";

function BugDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { developers, nameOf } = useUsers();
  const { data: bug, loading, error, reload } = useFetch(`/bugs/${id}`);
  const [actionError, setActionError] = useState(null);

  if (loading || error) return <Status loading={loading} error={error} />;

  const isAdmin = user.role === "admin";
  const canEdit = isAdmin || bug.reporter === user.id;
  const canChangeStatus = isAdmin || bug.assignee === user.id;

  // Runs an API action, then refreshes the bug. Shows the server's message on failure.
  const run = async (action) => {
    setActionError(null);
    try {
      await action();
      reload();
    } catch (err) {
      setActionError(err.response?.data?.message || "Action failed");
    }
  };

  const changeStatus = (e) => run(() => client.patch(`/bugs/${id}/status`, { status: e.target.value }));
  const changeAssignee = (e) => run(() => client.patch(`/bugs/${id}/assign`, { assignee: e.target.value || null }));

  const handleDelete = async () => {
    if (!window.confirm("Delete this bug and its comments?")) return;
    setActionError(null);
    try {
      await client.delete(`/bugs/${id}`);
      navigate("/bugs");
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not delete bug");
    }
  };

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/bugs">Bugs</Link>
        <span>/</span>
        <span className="muted">{bug.title}</span>
      </nav>

      <div className="card">
        <div className="page-header">
          <h2>{bug.title}</h2>
          <div className="actions">
            {canEdit && <Link className="button secondary" to={`/bugs/${id}/edit`}>Edit</Link>}
            {isAdmin && <button className="danger" onClick={handleDelete}>Delete</button>}
          </div>
        </div>

        <p>{bug.description || "No description."}</p>

        <dl className="details">
          <dt>Project</dt><dd>{bug.project?.name ?? "-"}</dd>
          <dt>Severity</dt><dd><Badge value={bug.severity} /></dd>
          <dt>Priority</dt><dd><Badge value={bug.priority} /></dd>
          <dt>Reporter</dt><dd>{nameOf(bug.reporter)}</dd>
          <dt>Created</dt><dd>{formatDate(bug.createdAt)}</dd>
          <dt>Updated</dt><dd>{formatDate(bug.updatedAt)}</dd>

          <dt>Status</dt>
          <dd>
            {canChangeStatus ? (
              <select value={bug.status} onChange={changeStatus}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            ) : (
              <Badge value={bug.status} />
            )}
          </dd>

          <dt>Assignee</dt>
          <dd>
            {isAdmin ? (
              <select value={bug.assignee ?? ""} onChange={changeAssignee}>
                <option value="">Unassigned</option>
                {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            ) : (
              nameOf(bug.assignee)
            )}
          </dd>
        </dl>

        {actionError && <p className="error">{actionError}</p>}
      </div>

      <CommentSection bugId={id} />
    </div>
  );
}

export default BugDetailPage;
