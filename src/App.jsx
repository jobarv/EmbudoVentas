import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import KanbanDashboard from './components/KanbanBoard'
import Login from './components/Login';
import './styles/global.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Obtener sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuchar cambios en la autenticación (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      <header className="main-header">
        <h1>Gestor de Proyectos</h1>
        <div className="user-info">
          <span>{session.user.email}</span>
          <button onClick={() => supabase.auth.signOut()} className="close-btn" style={{fontSize: '1rem', marginLeft: '10px'}}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main>
        <KanbanDashboard />
      </main>
    </div>
  );
}

export default App;