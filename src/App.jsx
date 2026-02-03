import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import './styles/global.css';
import './styles/kanban.css';

const COLUMNS = ["prospectos", "cliente potencial", "negociación", "cierre", "perdido"];

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error:', error);
    else setProjects(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('proyectos')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("No se pudo actualizar el estado");
    } else {
      // Actualizamos el estado local para que sea instantáneo
      setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
      setSelectedProject(null); // Cerramos el modal tras moverlo
    }
  };

  return (
    <>
      <div className="app-layout">
        <header className="main-header">
          <h1>Gestor de Proyectos</h1>
          <button className="add-project-btn">+ Nuevo Proyecto</button>
        </header>

        <div className="kanban-container">
          {COLUMNS.map(col => (
            <div key={col} className="kanban-column">
              <h3 className="column-header">{col} <span className="count">{projects.filter(p => p.status === col).length}</span></h3>
              <div className="column-content">
                {projects
                  .filter(p => p.status === col)
                  .map(p => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      onClick={setSelectedProject}
                    />
                  ))
                }
              </div>
            </div>
          ))}
        </div>

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateStatus={handleUpdateStatus}
          COLUMNS={COLUMNS}
        />
      </div>
    </>
  );
}

export default App;