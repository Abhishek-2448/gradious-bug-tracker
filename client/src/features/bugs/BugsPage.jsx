import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useUsers } from "../../hooks/useUsers.js";
import Badge from "../../components/Badge.jsx";
import Status from "../../components/Status.jsx";
import { STATUSES, SEVERITIES, labelOf, formatDate } from "../../utils/constants.js";

const INITIAL_FILTERS = { q: "", project: "", status: "", severity: "", assignee: "" };

function BugsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(filters.q);

  const { developers, nameOf } = useUsers();
  const { data: projects } = useFetch("/projects");
  const { data, loading, error } = useFetch("/bugs", {
    ...filters,
    q: debouncedQ,
    page,
    limit: 8,
  });

  const onChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const reset = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Bugs</h2>
        <Link className="button" to="/bugs/new">Report a bug</Link>
      </div>

      <div className="filters">
        <input name="q" placeholder="Search title..." value={filters.q} onChange={onChange} />
        <select name="project" value={filters.project} onChange={onChange}>
          <option value="">All projects</option>
          {projects?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={onChange}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select name="severity" value={filters.severity} onChange={onChange}>
          <option value="">All severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{labelOf(s)}</option>)}
        </select>
        <select name="assignee" value={filters.assignee} onChange={onChange}>
          <option value="">Anyone</option>
          <option value="unassigned">Unassigned</option>
          {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button className="secondary" onClick={reset}>Reset</button>
      </div>

      <Status loading={loading} error={error} />

      {data && data.bugs.length === 0 && <p className="muted">No bugs match these filters.</p>}

      {data && data.bugs.length > 0 && (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Project</th><th>Severity</th><th>Status</th><th>Assignee</th><th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.bugs.map((bug) => (
                  <tr key={bug._id}>
                    <td><Link to={`/bugs/${bug._id}`}>{bug.title}</Link></td>
                    <td>{bug.project?.name ?? "-"}</td>
                    <td><Badge value={bug.severity} /></td>
                    <td><Badge value={bug.status} /></td>
                    <td>{nameOf(bug.assignee)}</td>
                    <td>{formatDate(bug.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="secondary" disabled={data.page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {data.page} of {data.pages} ({data.total} bugs)</span>
            <button className="secondary" disabled={data.page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default BugsPage;
