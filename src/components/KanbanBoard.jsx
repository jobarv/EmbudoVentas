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

    // 1. Cargar datos desde Supabase
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('kanban')
            .select('*');

        if (error) console.error('Error cargando proyectos:', error);
        else setProjects(data);
        setLoading(false);
    };

    // 2. Actualizar estado (Cambiar de columna)
    const handleMoveStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('kanban')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) alert("Error al actualizar");
        else fetchProjects();
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
                                        <div className="card-footer">
                                            <span>👤 {project.lead_owner_name || 'Sin asignar'}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}

                {/* MODAL DETALLE (CANVAS) */}
                {selectedProject && (
                    <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Detalle del Proyecto</h2>
                                <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
                            </div>

                            <div className="modal-body">
                                <section>
                                    <label>Proyecto</label>
                                    <h3>{selectedProject.project_name}</h3>
                                    <label>Empresa / Cliente</label>
                                    <p>{selectedProject.company} - {selectedProject.client_name}</p>
                                </section>

                                <hr />

                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Contacto</label>
                                        <p>📞 {selectedProject.phone}</p>
                                        <p>✉️ {selectedProject.email}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Monto Cotizado</label>
                                        <p className="highlight-price">${Number(selectedProject.quantity).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="modal-field">
                                    <label>Información General</label>
                                    <p className="text-area-display">{selectedProject.general_info || "Sin descripción"}</p>
                                </div>

                                <div className="links-section">
                                    <a href={selectedProject.gdrive_url} target="_blank" rel="noreferrer" className="btn-link">
                                        📂 Ver Cotización (PDF)
                                    </a>
                                    <a href={selectedProject.gmaps_url} target="_blank" rel="noreferrer" className="btn-link map">
                                        📍 Ubicación Google Maps
                                    </a>
                                </div>

                                <div className="dates-footer">
                                    <p><strong>Último contacto:</strong> {selectedProject.last_contact}</p>
                                    <p><strong>Cierre estimado:</strong> {selectedProject.estimated_close}</p>
                                </div>

                                {/* Selector rápido de estado dentro del modal */}
                                <div className="status-changer">
                                    <label>Cambiar Etapa:</label>
                                    <select
                                        value={selectedProject.status}
                                        onChange={(e) => handleMoveStatus(selectedProject.id, e.target.value)}
                                    >
                                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default KanbanDashboard;