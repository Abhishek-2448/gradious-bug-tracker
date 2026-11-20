import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../api/axiosInstance.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useFetch } from "../../hooks/useFetch.js";
import Status from "../../components/Status.jsx";
import { SEVERITIES, PRIORITIES, labelOf } from "../../utils/constants.js";

function BugFields({ bug, projects }) {
  const navigate = useNavigate();
  const isEdit = Boolean(bug);

  const [form, setForm] = useState({
    title: bug?.title ?? "",
    description: bug?.description ?? "",
    severity: bug?.severity ?? "medium",
    priority: bug?.priority ?? "medium",
    project: bug?.project?._id ?? "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    if (!isEdit && !form.project) return setError("Choose a project");

    setError(null);
    setSaving(true);
    try {
      const { data } = isEdit
        ? await client.put(`/bugs/${bug._id}`, form)
        : await client.post("/bugs", form);
      navigate(`/bugs/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save bug");
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={onSubmit}>
      <h2>{isEdit ? "Edit bug" : "Report a bug"}</h2>

      <label>Title<input name="title" value={form.title} onChange={onChange} /></label>
      <label>Description<textarea name="description" rows="5" value={form.description} onChange={onChange} /></label>

      {!isEdit && (
        <label>
          Project
          <select name="project" value={form.project} onChange={onChange}>
            <option value="">Select a project...</option>
            {projects?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {projects && projects.length === 0 && (
            <small className="muted">No projects exist yet. Ask an admin to create one.</small>
          )}
        </label>
      )}

      <div className="two-col">
        <label>
          Severity
          <select name="severity" value={form.severity} onChange={onChange}>
            {SEVERITIES.map((s) => <option key={s} value={s}>{labelOf(s)}</option>)}
          </select>
        </label>
        <label>
          Priority
          <select name="priority" value={form.priority} onChange={onChange}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{labelOf(p)}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        <button type="button" className="secondary" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  );
}

function BugForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: projects } = useFetch("/projects");
  const { data: bug, loading, error } = useFetch(id ? `/bugs/${id}` : null);

  if (id && (loading || error)) return <Status loading={loading} error={error} />;

  if (bug && user.role !== "admin" && bug.reporter !== user.id) {
    return <p className="error">Only an admin or the reporter can edit this bug.</p>;
  }

  return <BugFields key={bug?._id ?? "new"} bug={bug} projects={projects} />;
}

export default BugForm;
