import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '../assets/Logo MOTIONTECH_letrasBlancas.png'
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
        <div className="login-container">
            <div className="login-box">
                <div className="login-branding">
                    <div className="logo-placeholder">
                        <img src={logo} alt="logo_motiontech" />
                        <h1>Kanban Pro</h1>
                        <p>Organiza tu flujo de trabajo de forma eficiente.</p>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Acceso</h2>
                    <div className="modal-field">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            required
                        />
                    </div>
                    <div className="login-buttons">
                        <button type="submit" disabled={loading} className="add-project-btn">
                            {loading ? 'Cargando...' : 'Entrar'}
                        </button>
                        <button type="button" onClick={handleSignUp} className="link-btn">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;