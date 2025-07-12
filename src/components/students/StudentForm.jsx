// components/students/StudentForm.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import FormField from '../common/FormField';

const StudentForm = ({ student, onClose, onSuccess }) => {
  // Campos corregidos para la API
  const [formData, setFormData] = useState({
    Nombre: student?.Nombre || '',
    Carnet: student?.Carnet || '',
    Apellido: student?.Apellido || '',
    Grado: student?.Grado || '',
    Estado: student?.Estado || 'Activo'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Nombre.trim()) newErrors.Nombre = 'El nombre es requerido';
    if (!formData.Carnet || formData.Carnet === '') newErrors.Carnet = 'El carnet es requerido';
    if (!formData.Apellido.trim()) newErrors.Apellido = 'El apellido es requerido';
    if (!formData.Grado.trim()) newErrors.Grado = 'El grado es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const url = student 
        ? `https://retoolapi.dev/qwagXC/escuelita/${student.id}`
        : "https://retoolapi.dev/qwagXC/escuelita";
      
      const method = student ? 'PUT' : 'POST';
      
      // Preparar los datos según la estructura de la API
      const payload = {
        Nombre: formData.Nombre.trim(),
        Carnet: parseInt(formData.Carnet) || 0, // Convertir a número
        Apellido: formData.Apellido.trim(),
        Grado: formData.Grado.trim(),
        Estado: formData.Estado || 'Activo'
      };
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(student ? "Estudiante actualizado correctamente" : "Estudiante registrado correctamente");
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Error al guardar el estudiante');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {student ? 'Editar Estudiante' : 'Nuevo Estudiante'}
            </h3>
            <p className="modal-subtitle">
              {student ? 'Actualiza la información del estudiante' : 'Registra un nuevo estudiante'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="form-container">
          <FormField
            label="Nombre"
            type="text"
            value={formData.Nombre}
            onChange={(value) => setFormData({...formData, Nombre: value})}
            placeholder="Ej: Juan"
            error={errors.Nombre}
          />
          
          <FormField
            label="Carnet"
            type="number"
            value={formData.Carnet}
            onChange={(value) => setFormData({...formData, Carnet: value})}
            placeholder="Ej: 91"
            error={errors.Carnet}
            min="1"
          />
          
          <FormField
            label="Apellido"
            type="text"
            value={formData.Apellido}
            onChange={(value) => setFormData({...formData, Apellido: value})}
            placeholder="Ej: Aery"
            error={errors.Apellido}
          />
          
          <div className="form-field">
            <label className="form-label">Grado</label>
            <textarea
              value={formData.Grado}
              onChange={(e) => setFormData({...formData, Grado: e.target.value})}
              placeholder="Ej: Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
              rows="3"
              className={`form-input ${errors.Grado ? 'error' : ''}`}
              style={{resize: 'vertical'}}
            />
            {errors.Grado && (
              <p className="error-text">{errors.Grado}</p>
            )}
          </div>
          
          <div className="form-field">
            <label className="form-label">Estado</label>
            <select
              value={formData.Estado}
              onChange={(e) => setFormData({...formData, Estado: e.target.value})}
              className="form-select"
            >
              <option value="Activo">Activo</option>
              <option value="On Delivery Vehicle">On Delivery Vehicle</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`form-button ${loading ? '' : 'primary'}`}
            >
              {loading ? 'Guardando...' : (student ? 'Actualizar' : 'Registrar')}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="form-button secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;