import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import NewProjectForm from './components/NewProjectForm'; // El que hicimos antes
import Login from './components/Login';
import './styles/global.css';

const COLUMNS = ["prospectos", "cliente potencial", "negociacion", "cierre", "perdido"];

function App() {
  const [session, setSession] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detectar sesión
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('kanban').select('*').order('created_at', { ascending: false });
    if (!error) setProjects(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('kanban').update({ status: newStatus }).eq('id', id);
    if (!error) fetchProjects();
    setSelectedProject(null);
  };

  if (!session) return <Login />;

  return (
    <div className="app-layout">
      <header className="main-header">
        <h1>Kanban CRM</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="add-project-btn" onClick={() => setShowNewForm(true)}>+ Nuevo Proyecto</button>
          <span style={{ fontSize: '0.8rem' }}>{session.user.email}</span>
          <button className="link-btn" style={{ padding: '5px 10px' }} onClick={() => supabase.auth.signOut()}>Salir</button>
        </div>
      </header>

      <div className="kanban-container">
        {COLUMNS.map(col => (
          <div key={col} className="kanban-column">
            <h3 className="column-header">{col}</h3>
            <div className="column-content">
              {projects.filter(p => p.status === col).map(p => (
                <ProjectCard key={p.id} project={p} onClick={setSelectedProject} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onUpdateStatus={handleUpdateStatus} 
          COLUMNS={COLUMNS} 
        />
      )}

      {/* FORMULARIO NUEVO PROYECTO */}
      {showNewForm && (
        <NewProjectForm 
          onClose={() => setShowNewForm(false)} 
          onRefresh={fetchProjects} 
        />
      )}
    </div>
  );
}

export default App;