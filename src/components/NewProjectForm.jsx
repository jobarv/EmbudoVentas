import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NewProjectForm = ({ onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_name: '',
        company: '',
        contact_name: '',
        phone: '',
        email: '',
        quantity: '',
        status: 'prospectos',
        created_at: '',
        estimated_close: '',
        closed_at: '',
        last_contact: '',
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
                contact_name: formData.contact_name,
                phone: formData.phone,
                email: formData.email,
                quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
                status: formData.status,
                created_at: formData.created_at,
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
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-section">
                            <label>Nombre del Contacto</label>
                            <input
                                name="contact_name"
                                type="text"
                                value={formData.contact_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-section">
                            <label>Teléfono</label>
                            <input
                                name="phone"
                                type="number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-section">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-section">
                            <label>URL de Google Drive</label>
                            <input
                                name="gdrive_url"
                                type="text"
                                value={formData.gdrive_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-section">
                            <label>URL de Google Maps</label>
                            <input
                                name="gmaps_url"
                                type="text"
                                value={formData.gmaps_url}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="modal-section">
                        <label>Fecha de Registro</label>
                        <input
                            required
                            name="created_at"
                            type="date"
                            value={formData.created_at}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-section">
                        <label>Fecha Estimada de Cierre</label>
                        <input
                            required
                            name="estimated_close"
                            type="date"
                            value={formData.estimated_close}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-section">
                        <label>Fecha Final de Cierre</label>
                        <input
                            name="closed_at"
                            type="date"
                            value={formData.closed_at}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-section">
                        <label>Último Contacto</label>
                        <input
                            name="last_contact"
                            type="date"
                            value={formData.last_contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-section">
                        <label>Información Adicional</label>
                        <input
                            name="general_info"
                            type="text"
                            value={formData.general_info}
                            onChange={handleChange}
                        />
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