// components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Users, Eye, BarChart3, BookOpen } from 'lucide-react';
import StatCard from './StatCard';
import StatusSummary from './StatusSummary';
import RecentStudents from './RecentStudents';

const dashboardStyles = {
  dashboard: {
    padding: '1.5rem',
    maxWidth: '80rem',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  dashboardHeader: {
    marginBottom: '2rem'
  },
  dashboardTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem'
  },
  dashboardSubtitle: {
    color: '#6b7280',
    fontSize: '1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh'
  },
  loadingContent: {
    textAlign: 'center'
  },
  loadingSpinner: {
    width: '3rem',
    height: '3rem',
    border: '3px solid #5F9EA0',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  whiteCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solidrgb(14, 64, 164)',
    padding: '1.5rem'
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: '0.5rem'
  },
  formButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#10b981',
    color: 'black'
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, avgAge: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data...');
      
      // Obtener estudiantes desde la API
      const response = await fetch("https://retoolapi.dev/qwagXC/escuelita");
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      
      const data = await response.json();
      console.log('Students Response:', data);
      
      // Validar que data es un array
      const studentsData = Array.isArray(data) ? data : [];
      const validStudents = studentsData.filter(student => student && student.id);
      setStudents(validStudents);
      
      // Calcular estadísticas desde los datos
      const total = validStudents.length;
      const active = validStudents.filter(s => s.Estado === 'Activo' || s.Estado === 'On Delivery Vehicle' || !s.Estado).length;
      const inactive = validStudents.filter(s => s.Estado === 'Inactivo').length;
      
      // Calcular edad promedio si hay campo de edad (aunque no está en tu API actual)
      const avgAge = total > 0 ? Math.round(
        validStudents.reduce((sum, s) => {
          const age = parseInt(s.Edad) || 0;
          return sum + age;
        }, 0) / total
      ) : 0;
      
      setStats({
        total,
        active,
        inactive,
        avgAge
      });
      
      console.log('Calculated stats:', { total, active, inactive, avgAge });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error al cargar los datos del dashboard');
      setStats({ total: 0, active: 0, inactive: 0, avgAge: 0 });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @media (max-width: 768px) {
              .dashboard-content-grid {
                grid-template-columns: 1fr !important;
              }
              .dashboard-stats-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
        <div style={dashboardStyles.loadingContainer}>
          <div style={dashboardStyles.loadingContent}>
            <div style={dashboardStyles.loadingSpinner}></div>
            <p style={dashboardStyles.loadingText}>Cargando estadísticas...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div style={dashboardStyles.dashboard}>
        <div style={dashboardStyles.whiteCard}>
          <h3 style={dashboardStyles.cardTitle}>Error al cargar dashboard</h3>
          <p style={{color: '#5F9EA0', marginBottom: '1rem'}}>{error}</p>
          <button 
            onClick={fetchData}
            style={dashboardStyles.formButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={dashboardStyles.dashboard}>
      <div style={dashboardStyles.dashboardHeader}>
        <h2 style={dashboardStyles.dashboardTitle}>Dashboard</h2>
        <p style={dashboardStyles.dashboardSubtitle}>Estadísticas generales de la Escuela</p>
      </div>
      
      <div style={dashboardStyles.statsGrid} className="dashboard-stats-grid">
        <StatCard
          title="Total Estudiantes"
          value={stats.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Activos"
          value={stats.active}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Inactivos"
          value={stats.inactive}
          icon={BarChart3}
          color="yellow"
        />
        <StatCard
          title="Promedio Edad"
          value={stats.avgAge > 0 ? `${stats.avgAge} años` : 'N/A'}
          icon={BookOpen}
          color="purple"
        />
      </div>
      
      <div style={dashboardStyles.contentGrid} className="dashboard-content-grid">
        <StatusSummary stats={stats} />
        <RecentStudents students={students.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;