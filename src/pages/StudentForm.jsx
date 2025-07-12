// pages/StudentsPage.jsx
import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Edit2, Trash2, X, Search } from 'lucide-react';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del formulario corregidos
  const [formData, setFormData] = useState({
    Nombre: '',
    Carnet: '',
    Apellido: '',
    Grado: '',
    Estado: 'Activo'
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("https://retoolapi.dev/qwagXC/escuelita");
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setStudents(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error de conexión al cargar estudiantes');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Nombre.trim()) newErrors.Nombre = 'El nombre es requerido';
    if (!formData.Carnet || formData.Carnet === '') newErrors.Carnet = 'El carnet es requerido';
    if (!formData.Apellido.trim()) newErrors.Apellido = 'El apellido es requerido';
    if (!formData.Grado.trim()) newErrors.Grado = 'El grado es requerido';
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormLoading(true);

    try {
      const url = editingStudent 
        ? `https://retoolapi.dev/qwagXC/escuelita/${editingStudent.id}`
        : "https://retoolapi.dev/qwagXC/escuelita";
      
      const method = editingStudent ? 'PUT' : 'POST';
      
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
        alert(editingStudent ? "Estudiante actualizado correctamente" : "Estudiante registrado correctamente");
        fetchStudents();
        handleCloseForm();
      } else {
        throw new Error('Error al guardar el estudiante');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      Nombre: student.Nombre || '',
      Carnet: student.Carnet || '', // Mantener como string en el formulario
      Apellido: student.Apellido || '',
      Grado: student.Grado || '',
      Estado: student.Estado || 'Activo'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      try {
        const response = await fetch(`https://retoolapi.dev/qwagXC/escuelita/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Estudiante eliminado correctamente');
          fetchStudents();
        } else {
          throw new Error('Error al eliminar el estudiante');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el estudiante');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData({
      Nombre: '',
      Carnet: '',
      Apellido: '',
      Grado: '',
      Estado: 'Activo'
    });
    setFormErrors({});
  };

  const handleNewStudent = () => {
    setEditingStudent(null);
    setFormData({
      Nombre: '',
      Carnet: '',
      Apellido: '',
      Grado: '',
      Estado: 'Activo'
    });
    setShowForm(true);
  };

  // Filtrar estudiantes por búsqueda
  const filteredStudents = students.filter(student => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (student.Nombre || '').toLowerCase().includes(searchLower) ||
      (student.Carnet || '').toLowerCase().includes(searchLower) ||
      (student.Apellido || '').toLowerCase().includes(searchLower) ||
      (student.Grado || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar estudiantes</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStudents}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Estudiantes</h1>
            <p className="text-gray-600">
              Administra los estudiantes de la escuela ({filteredStudents.length} de {students.length} estudiantes)
            </p>
          </div>
          <button 
            onClick={handleNewStudent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Nuevo Estudiante
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Tabla de estudiantes */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {students.length === 0 ? 'No hay estudiantes registrados' : 'No se encontraron estudiantes'}
          </h3>
          <p className="text-gray-600">
            {students.length === 0 ? 'Agrega el primer estudiante' : 'Intenta con diferentes términos de búsqueda'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carnet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{student.id || index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.Nombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.Carnet || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.Apellido || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={student.Grado}>
                        {student.Grado || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.Estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : student.Estado === 'On Delivery Vehicle'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.Estado || 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {editingStudent ? 'Actualiza la información del estudiante' : 'Registra un nuevo estudiante'}
                  </p>
                </div>
                <button 
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.Nombre}
                    onChange={(e) => setFormData({...formData, Nombre: e.target.value})}
                    placeholder="Ej: Juan"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.Nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.Nombre && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.Nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carnet
                  </label>
                  <input
                    type="number"
                    value={formData.Carnet}
                    onChange={(e) => setFormData({...formData, Carnet: e.target.value})}
                    placeholder="Ej: 91"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.Carnet ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.Carnet && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.Carnet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.Apellido}
                    onChange={(e) => setFormData({...formData, Apellido: e.target.value})}
                    placeholder="Ej: Pérez"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.Apellido ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.Apellido && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.Apellido}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado
                  </label>
                  <textarea
                    value={formData.Grado}
                    onChange={(e) => setFormData({...formData, Grado: e.target.value})}
                    placeholder="Ej: Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical ${
                      formErrors.Grado ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.Grado && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.Grado}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.Estado}
                    onChange={(e) => setFormData({...formData, Estado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="On Delivery Vehicle">On Delivery Vehicle</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                      formLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {formLoading ? 'Guardando...' : (editingStudent ? 'Actualizar' : 'Registrar')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    disabled={formLoading}
                    className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;