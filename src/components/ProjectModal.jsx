import React, { useEffect, useState } from "react";

const ProjectModal = ({
  project,
  onClose,
  onSave,
  onMoveStatus,
  COLUMNS = []

}) => {
  const [formData, setFormData] = useState(project || {});
  const [isEditing, setIsEditing] = useState(false);
  const handleOverlayClick = () => {
    if (isEditing) {
      onSave?.(formData);
    }
    onClose();
  };
  // Sincroniza cuando cambia el proyecto seleccionado
  useEffect(() => {
    setFormData(project || {});
    setIsEditing(false);
  }, [project]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData(project || {});
    setIsEditing(false);
  };

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Detalle del Proyecto</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">

          <label>Proyecto</label>
          <input
            disabled={!isEditing}
            value={formData.project_name || ""}
            onChange={(e) => updateField("project_name", e.target.value)}
          />

          <label>Empresa</label>
          <input
            disabled={!isEditing}
            value={formData.company || ""}
            onChange={(e) => updateField("company", e.target.value)}
          />

          <label>Cliente</label>
          <input
            disabled={!isEditing}
            value={formData.client_name || ""}
            onChange={(e) => updateField("client_name", e.target.value)}
          />

          <label>Teléfono</label>
          <input
            disabled={!isEditing}
            value={formData.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
          />

          <label>Email</label>
          <input
            disabled={!isEditing}
            value={formData.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <label>Monto</label>
          <input
            disabled={!isEditing}
            type="number"
            value={formData.quantity ?? 0}
            onChange={(e) => updateField("quantity", Number(e.target.value))}
          />

          <label>Información General</label>
          <textarea
            disabled={!isEditing}
            value={formData.general_info || ""}
            onChange={(e) => updateField("general_info", e.target.value)}
          />

          <label>GDrive URL</label>
          <input
            disabled={!isEditing}
            value={formData.gdrive_url || ""}
            onChange={(e) => updateField("gdrive_url", e.target.value)}
          />

          <label>Google Maps URL</label>
          <input
            disabled={!isEditing}
            value={formData.gmaps_url || ""}
            onChange={(e) => updateField("gmaps_url", e.target.value)}
          />

          <label>Dueño del Lead</label>
          <input
            disabled={!isEditing}
            value={formData.lead_owner_name || ""}
            onChange={(e) => updateField("lead_owner_name", e.target.value)}
          />

          <div className="status-changer">
            <label>Etapa</label>
            <select
              disabled={!isEditing}
              value={formData.status || ""}
              onChange={async (e) => {
                const newStatus = e.target.value;
                updateField("status", newStatus);

                if (formData.id) {
                  await onMoveStatus(formData.id, newStatus);
                }
              }}
            >
              {COLUMNS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>

            {!isEditing && (
              <button
                className="add-project-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar
              </button>
            )}

            {isEditing && (
              <>
                <button
                  className="add-project-btn"
                  onClick={handleSave}
                >
                  💾 Guardar cambios
                </button>

                <button
                  className="link-btn"
                  onClick={handleCancelEdit}
                >
                  Cancelar edición
                </button>
              </>
            )}

            <button className="link-btn" onClick={onClose}>
              Cerrar
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
