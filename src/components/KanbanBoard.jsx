import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../styles/global.css';

// Supabase
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'tu-api-key-anonima';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const COLUMNS = ["prospectos", "cliente potencial", "negociacion", "cierre", "perdido"];

const KanbanDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('kanban').select('*');
        if (!error) setProjects(data);
        setLoading(false);
    };

    const handleMoveStatus = async (id, newStatus) => {
        await supabase.from('kanban').update({ status: newStatus }).eq('id', id);
        fetchProjects();
    };

    const handleUpdateProject = async (updatedProject) => {
        const { id, ...fields } = updatedProject;
        await supabase.from('kanban').update(fields).eq('id', id);
        fetchProjects();
        setSelectedProject(null);
    };

    if (loading) return <div className="loading">Cargando tablero...</div>;

    return (
        <>
            <div className="kanban-container">
                {COLUMNS.map((col) => (
                    <div key={col} className="kanban-column">
                        <h3 className="column-title">{col}</h3>
                        <div className="column-body">
                            {projects
                                .filter((p) => p.status === col)
                                .map((project) => (
                                    <div
                                        key={project.id}
                                        className="project-card"
                                        onClick={() => setSelectedProject(project)}
                                    >
                                        <div className="card-title">{project.project_name}</div>
                                        <div className="card-company">{project.company}</div>
                                        <div className="card-value">${Number(project.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <ProjectEditModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onSave={handleUpdateProject}
                    onMoveStatus={handleMoveStatus}
                    COLUMNS={COLUMNS}
                />
            )}
        </>
    );
};

export default KanbanDashboard;
