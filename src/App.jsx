// src/App.jsx
import React, { useState } from 'react';
import SplashScreen from './components/layout/SplashScreen';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';

// Importar estilos
import '../src/syles.css';
import './components.css';

const App = () => {
  const [currentView, setCurrentView] = useState('welcome');

  // Renderizado condicional
  if (currentView === 'welcome') {
    return <SplashScreen onEnter={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="container mx-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'students' && <StudentList />}
      </div>
    </div>
  );
};

export default App;