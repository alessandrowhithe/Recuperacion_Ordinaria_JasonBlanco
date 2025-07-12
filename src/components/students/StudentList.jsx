// components/students/StudentList.jsx
import React, { useState, useEffect } from 'react';
import { UserPlus, Search } from 'lucide-react';
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching students...');
      const response = await fetch("https://retoolapi.dev/qwagXC/escuelita");
      console.log('API Response:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      } 
      const data = await response.json();
      console.log('Fetched students:', data);
      setStudents(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error de conexión al cargar estudiantes');
      setStudents([]); // Array vacío como fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Cannot delete student without id');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      try {
        console.log('Deleting student with id:', id);
        const response = await fetch(`https://retoolapi.dev/qwagXC/escuelita/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          console.log('Student deleted successfully');
          alert('Estudiante eliminado correctamente');
          fetchStudents(); // Recargar lista
        } else {
          console.error('Delete failed');
          alert('Error al eliminar el estudiante');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error de conexión al eliminar el estudiante');
      }
    }
  };

  const handleEdit = (student) => {
    if (!student || !student.id) {
      console.error('Cannot edit student without valid data:', student);
      return;
    }
    
    console.log('Editing student:', student);
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleFormSuccess = () => {
    console.log('Form submitted successfully, refreshing list...');
    fetchStudents();
    handleCloseForm();
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
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="students-container">
        <div className="white-card">
          <h3 className="card-title">Error al cargar estudiantes</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStudents}
            className="form-button primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="students-container">
      <div className="students-header">
        <div>
          <h2 className="students-title">Gestión de Estudiantes</h2>
          <p className="students-subtitle">
            Administra los estudiantes de la escuela ({filteredStudents.length} de {students.length} estudiantes)
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="add-button"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Estudiante
        </button>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="search-container mb-6">
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
      
      <StudentTable 
        students={filteredStudents} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      {showForm && (
        <StudentForm 
          student={editingStudent}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default StudentList;