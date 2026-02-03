import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NewProjectForm = ({ onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_name: '',
        company: '',
        value: '',
        status: 'prospectos',
        gdrive_url: '',
        gmaps_url: '',
        general_info: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("No se encontró un usuario autenticado");

            const proyectoAGuardar = {
                project_name: formData.project_name.trim(),
                company: formData.company || null,
                value: formData.value ? parseFloat(formData.value) : 0,
                status: formData.status,
                gdrive_url: formData.gdrive_url || null,
                gmaps_url: formData.gmaps_url || null,
                general_info: formData.general_info || null,
                lead_owner: user.id,
                lead_owner_name: user.email,
                // Estos campos se inicializan en NULL si no están en el form actual
                last_contact: null,
                estimated_close: null,
                closed_at: null
            };

            const { error } = await supabase
                .from('kanban')
                .insert([proyectoAGuardar]);

            if (error) throw error;

            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error completo:", error);
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper para actualizar el estado de forma limpia
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Nuevo Proyecto</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-scroll-area">
                    <div className="modal-section">
                        <label>Nombre del Proyecto *</label>
                        <input 
                            required 
                            name="project_name"
                            type="text" 
                            value={formData.project_name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="grid-2">
                        <div className="modal-section">
                            <label>Empresa</label>
                            <input 
                                name="company"
                                type="text" 
                                value={formData.company} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="modal-section">
                            <label>Monto</label>
                            <input 
                                name="value"
                                type="number" 
                                value={formData.value} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    {/* ... Resto de los campos usando handleChange y el atributo name ... */}
                    <button type="submit" disabled={loading} className="add-project-btn" style={{ width: '100%' }}>
                        {loading ? 'Guardando...' : 'Crear Proyecto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewProjectForm;