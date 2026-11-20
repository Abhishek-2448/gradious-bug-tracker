import { useState } from "react";
import client from "../../api/axiosInstance.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useUsers } from "../../hooks/useUsers.js";
import Status from "../../components/Status.jsx";
import ProjectForm from "./ProjectForm.jsx";

function ProjectsPage() {
  const { user } = useAuth();
  const { developers, nameOf } = useUsers();
  const { data: projects, loading, error, reload } = useFetch("/projects");
  const [editing, setEditing] = useState(null); 
  const [actionError, setActionError] = useState(null);

  const isAdmin = user.role === "admin";

  const handleSaved = () => {
    setEditing(null);
    reload();
  };

  const handleDelete = async (project) => {
    if (
      !window.confirm(
        `Delete "${project.name}"? This also deletes its bugs and comments.`,
      )
    )
      return;
    setActionError(null);
    try {
      await client.delete(`/projects/${project._id}`);
      reload();
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not delete project");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Projects</h2>
        {isAdmin && !editing && (
          <button onClick={() => setEditing("new")}>New project</button>
        )}
      </div>

      {isAdmin && editing && (
        <ProjectForm
          key={editing === "new" ? "new" : editing._id}
          project={editing === "new" ? null : editing}
          developers={developers}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      )}

      {actionError && <p className="error">{actionError}</p>}
      <Status loading={loading} error={error} />

      {projects && projects.length === 0 && (
        <p className="muted">No projects yet.</p>
      )}

      <div className="card-grid">
        {projects?.map((project) => (
          <div className="card" key={project._id}>
            <h3>{project.name}</h3>
            <p className="muted">{project.clientName || "No client"}</p>
            <p>{project.description || "No description"}</p>
            <p className="muted">
              Members:{" "}
              {project.members.length
                ? project.members.map(nameOf).join(", ")
                : "none"}
            </p>
            {isAdmin && (
              <div className="actions">
                <button
                  className="secondary"
                  onClick={() => setEditing(project)}
                >
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => handleDelete(project)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
