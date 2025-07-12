// components/dashboard/RecentStudents.jsx
import React from 'react';

const recentStudentsStyles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1rem'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s'
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 0.25rem 0'
  },
  details: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0 0 0.25rem 0'
  },
  carnet: {
    fontWeight: '500'
  },
  grade: {
    opacity: 0.8
  },
  lastname: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: 0
  },
  badge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  badgeActive: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  badgeInactive: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '2rem 1rem'
  },
  emptyText: {
    color: '#6b7280',
    fontStyle: 'italic'
  }
};

const RecentStudents = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <div style={recentStudentsStyles.card}>
        <h3 style={recentStudentsStyles.title}>Estudiantes Recientes</h3>
        <div style={recentStudentsStyles.emptyMessage}>
          <p style={recentStudentsStyles.emptyText}>No hay estudiantes registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div style={recentStudentsStyles.card}>
      <h3 style={recentStudentsStyles.title}>Estudiantes Recientes</h3>
      <div style={recentStudentsStyles.list}>
        {students.map(student => (
          <div 
            key={student.id} 
            style={recentStudentsStyles.item}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <div style={recentStudentsStyles.info}>
              <h4 style={recentStudentsStyles.name}>{student.Nombre || 'N/A'}</h4>
              <p style={recentStudentsStyles.details}>
                <span style={recentStudentsStyles.carnet}>Carnet: {student.Carnet || 'N/A'}</span>
                {student.Grado && <span style={recentStudentsStyles.grade}> • Grado: {student.Grado}</span>}
              </p>
              {student.Apellido && (
                <p style={recentStudentsStyles.lastname}>{student.Apellido}</p>
              )}
            </div>
            <span 
              style={{
                ...recentStudentsStyles.badge,
                ...(student.Estado === 'Inactivo' 
                  ? recentStudentsStyles.badgeInactive 
                  : student.Estado === 'On Delivery Vehicle'
                  ? {...recentStudentsStyles.badgeActive, backgroundColor: '#dbeafe', color: '#1e40af'}
                  : recentStudentsStyles.badgeActive)
              }}
            >
              {student.Estado || 'Activo'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentStudents;