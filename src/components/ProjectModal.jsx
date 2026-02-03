import React from 'react';
import '../styles/global.css';

const ProjectModal = ({ project, onClose, onUpdateStatus, COLUMNS }) => {
    if (!project) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <button className="close-btn" onClick={onClose}>&times;</button>
                        <h2>Detalles del Proyecto</h2>
                    </div>

                    <div className="modal-scroll-area">
                        <section className="modal-section">
                            <label>Nombre del Proyecto</label>
                            <h3>{project.project_name}</h3>
                        </section>

                        <section className="modal-section grid-2">
                            <div>
                                <label>Cliente</label>
                                <p>{project.client_name}</p>
                            </div>
                            <div>
                                <label>Empresa</label>
                                <p>{project.company}</p>
                            </div>
                        </section>

                        <section className="modal-section grid-2">
                            <div>
                                <label>Teléfono</label>
                                <p>{project.phone || 'No registrado'}</p>
                            </div>
                            <div>
                                <label>Email</label>
                                <p>{project.email || 'No registrado'}</p>
                            </div>
                        </section>

                        <section className="modal-section">
                            <label>Valor de la Oferta</label>
                            <p className="price-tag">${Number(project.value).toLocaleString()}</p>
                        </section>

                        <section className="modal-section">
                            <label>Información General</label>
                            <p className="description-text">{project.general_info || 'Sin descripción adicional.'}</p>
                        </section>

                        <section className="modal-section links">
                            <label>Documentación y Ubicación</label>
                            <a href={project.gdrive_url} target="_blank" rel="noreferrer" className="link-btn">
                                📂 Abrir Cotización (GDrive)
                            </a>
                            <a href={project.gmaps_url} target="_blank" rel="noreferrer" className="link-btn maps">
                                📍 Ver Ubicación (Maps)
                            </a>
                        </section>

                        <section className="modal-section status-update">
                            <label>Dueño del Lead: <strong>{project.lead_owner}</strong></label>
                            <div className="selector-wrapper">
                                <label>Mover a Etapa:</label>
                                <select
                                    value={project.status}
                                    onChange={(e) => onUpdateStatus(project.id, e.target.value)}
                                >
                                    {COLUMNS.map(col => (
                                        <option key={col} value={col}>{col.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectModal;