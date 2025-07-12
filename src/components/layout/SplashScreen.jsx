// components/layout/SplashScreen.jsx
import React, { useState } from 'react';
import API from '../../services/api';

const SplashScreen = ({ onEnter }) => {
  const [loading, setLoading] = useState(false);

  const handleEnter = async () => {
    setLoading(true);
    await API.delay(1000); // Simular carga
    onEnter();
  };

  return (
    <div className="splash-screen">
      <div className="splash-card">
        <div className="mb-6">
         
          <h1 className="splash-title">Escuelita Marvel</h1>
          <p className="splash-subtitle">Sistema de Gestión Estudiantil</p>
        </div>
        
        <div className="space-y-4">
          <div className="feature-card red">
            <h3 className="feature-title red">¡Bienvenido Héroe!</h3>
            <p className="feature-text red">
              Administra tu academia de superhéroes con las mejores herramientas
            </p>
          </div>
          
          <div className="feature-card blue">
            <h4 className="feature-title blue">Características:</h4>
            <ul className="feature-list feature-text blue">
              <li>• Gestión completa de estudiantes</li>
              <li>• Dashboard con estadísticas</li>
              <li>• API REST con Retool</li>
              <li>• Interfaz responsive</li>
            </ul>
          </div>
          
          <button 
            onClick={handleEnter}
            disabled={loading}
            className={`splash-button ${loading ? '' : 'primary'}`}
          >
            {loading ? 'Cargando...' : 'Acceder al Sistema'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;    