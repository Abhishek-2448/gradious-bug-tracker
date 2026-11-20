import { useState } from "react";
import client from "../../api/axiosInstance.js";

function ProjectForm({ project, developers, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: project?.name ?? "",
    description: project?.description ?? "",
    clientName: project?.clientName ?? "",
    members: project?.members ?? [],
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleMember = (id) =>
    setForm((f) => ({
      ...f,
      members: f.members.includes(id)
        ? f.members.filter((m) => m !== id)
        : [...f.members, id],
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Project name is required");

    setError(null);
    setSaving(true);
    try {
      if (project) {
        await client.put(`/projects/${project._id}`, form);
      } else {
        await client.post("/projects", form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save project");
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={onSubmit}>
      <h3>{project ? "Edit project" : "New project"}</h3>
      <label>
        Name
        <input name="name" value={form.name} onChange={onChange} />
      </label>
      <label>
        Client or student
        <input name="clientName" value={form.clientName} onChange={onChange} />
      </label>
      <label>
        Description
        <textarea
          name="description"
          rows="3"
          value={form.description}
          onChange={onChange}
        />
      </label>

      <fieldset>
        <legend>Members</legend>
        {developers.map((dev) => (
          <label className="check" key={dev.id}>
            <input
              type="checkbox"
              checked={form.members.includes(dev.id)}
              onChange={() => toggleMember(dev.id)}
            />
            {dev.name}
          </label>
        ))}
      </fieldset>

      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
