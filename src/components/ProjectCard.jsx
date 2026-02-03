import React from 'react';
import '../styles/global.css'

const ProjectCard = ({ project, onClick }) => {
    // Función para dar formato a moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(value);
    };

    return (
        <>
            <div className="project-card" onClick={() => onClick(project)}>
                <div className="card-header">
                    <span className="card-company">{project.company}</span>
                </div>
                <h4 className="card-title">{project.project_name}</h4>

                <div className="card-details">
                    <p className="card-client">👤 {project.client_name}</p>
                    <p className="card-value">{formatCurrency(project.value)}</p>
                </div>

                <div className="card-footer">
                    <span className="last-contact">📅 {project.last_contact || 'Sin fecha'}</span>
                </div>
            </div>
        </>
    );
};

export default ProjectCard;