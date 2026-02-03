import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/global.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert("Revisa tu correo para confirmar el registro");
        setLoading(false);
    };

    return (
        <>
            <div className="login-container">
                <form className="login-form">
                    <h2>Gestor Kanban - Acceso</h2>
                    <div className="modal-field">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="modal-field">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                        />
                    </div>
                    <div className="login-buttons">
                        <button onClick={handleLogin} disabled={loading} className="add-project-btn">
                            {loading ? 'Cargando...' : 'Entrar'}
                        </button>
                        <button onClick={handleSignUp} className="link-btn">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;