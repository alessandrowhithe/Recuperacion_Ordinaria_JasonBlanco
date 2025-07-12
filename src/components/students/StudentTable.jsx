// components/students/StudentTable.jsx
import React from 'react';
import { Users } from 'lucide-react';
import StudentTableRow from './StudentTableRow';

const StudentTable = ({ students, onEdit, onDelete }) => {
  // Validación defensiva
  if (!students || !Array.isArray(students)) {
    console.warn('StudentTable: students prop is not an array:', students);
    return (
      <div className="empty-state">
        <Users className="empty-icon" />
        <h3 className="empty-title">Error cargando estudiantes</h3>
        <p className="empty-subtitle">Por favor, recarga la página</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="empty-state">
        <Users className="empty-icon" />
        <h3 className="empty-title">No hay estudiantes registrados</h3>
        <p className="empty-subtitle">Agrega el primer héroe a la academia</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Edad</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {students.map((student, index) => {
              // Validación adicional para cada student
              if (!student) {
                console.warn(`Student at index ${index} is undefined`);
                return null;
              }

              // Usar el id del student, o el índice como fallback si no hay id
              const key = student.id || `student-${index}`;
              
              return (
                <StudentTableRow 
                  key={key}
                  student={student} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              );
            }).filter(Boolean)} {/* Filtrar elementos null */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;