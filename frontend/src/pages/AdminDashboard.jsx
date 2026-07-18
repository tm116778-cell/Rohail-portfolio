import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const emptyForm = {
  title: '',
  description: '',
  techStack: '',
  liveUrl: '',
  githubUrl: '',
  featured: true,
  order: 0,
};

export default function AdminDashboard() {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadProjects = async () => {
    const res = await api.getAdminProjects();
    setProjects(res.data || []);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadProjects().catch((err) => setError(err.message));
  }, [isAuthenticated]);

  if (loading) {
    return <div className="login-wrap">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      if (!files.length) {
        throw new Error('Please select at least one image');
      }

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('techStack', form.techStack);
      formData.append('liveUrl', form.liveUrl);
      formData.append('githubUrl', form.githubUrl);
      formData.append('featured', String(form.featured));
      formData.append('order', String(form.order));
      Array.from(files).forEach((file) => formData.append('images', file));

      await api.createProject(formData);
      setForm(emptyForm);
      setFiles([]);
      event.target.reset();
      setMessage('Project uploaded successfully');
      await loadProjects();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setBusy(true);
    setError('');
    try {
      await api.deleteProject(id);
      setMessage('Project deleted');
      await loadProjects();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="container admin-panel">
        <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Admin Dashboard</h1>
            <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>Signed in as {admin?.email}</p>
          </div>
          <div className="admin-actions">
            <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <Link className="btn" to="/">
              Portfolio
            </Link>
            <button className="btn" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <form className="admin-card form-grid" onSubmit={onSubmit}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Upload Project</h2>
          <label>
            Title
            <input name="title" value={form.title} onChange={onChange} required maxLength={120} />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={onChange} required maxLength={2000} />
          </label>
          <label>
            Tech stack (comma separated)
            <input
              name="techStack"
              value={form.techStack}
              onChange={onChange}
              placeholder="React, Node.js, MongoDB"
            />
          </label>
          <label>
            Live URL
            <input name="liveUrl" value={form.liveUrl} onChange={onChange} placeholder="https://" />
          </label>
          <label>
            GitHub URL
            <input name="githubUrl" value={form.githubUrl} onChange={onChange} placeholder="https://github.com/..." />
          </label>
          <label>
            Order
            <input name="order" type="number" value={form.order} onChange={onChange} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input name="featured" type="checkbox" checked={form.featured} onChange={onChange} />
            Show on portfolio featured section
          </label>
          <label>
            Project images (multiple)
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              required
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          {message ? <p className="success-text">{message}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Saving...' : 'Upload Project'}
          </button>
        </form>

        <section className="admin-card">
          <h2 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Your Projects</h2>
          <div className="admin-list">
            {projects.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No projects uploaded yet.</p>
            ) : (
              projects.map((project) => (
                <article className="admin-project" key={project.id}>
                  <img src={project.images?.[0]?.url} alt={project.title} />
                  <div>
                    <h4>{project.title}</h4>
                    <p>
                      {project.images?.length || 0} image(s) · Featured: {project.featured ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <button className="btn" type="button" onClick={() => onDelete(project.id)} disabled={busy}>
                    Delete
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
