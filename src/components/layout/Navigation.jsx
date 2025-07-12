// components/layout/Navigation.jsx
import React from 'react';
import { Shield, BarChart3, Users, Home } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-brand">
           
            <div>
              <h1 className="nav-title">Marvel</h1>
              <p className="nav-subtitle">Sistema de Gestión</p>
            </div>
          </div>
          
          <div className="nav-menu">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('students')}
              className={`nav-button ${currentView === 'students' ? 'active' : ''}`}
            >
              <Users className="w-4 h-4" />
              Estudiantes
            </button>
            <button
              onClick={() => setCurrentView('welcome')}
              className="nav-button exit"
            >
              <Home className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;