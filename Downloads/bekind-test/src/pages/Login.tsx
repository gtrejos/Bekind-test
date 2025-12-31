import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import '../styles/App.css';

const loginSchema = z.object({
  username: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await login(data);

      let tokenReal = '';

      if (typeof response === 'string') {
        tokenReal = response;
      } else if (response.token) {
        tokenReal = response.token;
      } else if (response.accessToken) {
        tokenReal = response.accessToken;
      }

      if (!tokenReal) {
        setError('La sesión no inició correctamente. La API no devolvió un token válido.');
        setIsSubmitting(false);
        return;
      }

      setToken(tokenReal);
      navigate('/dashboard');
      
    } catch (err: any) {
      let errorMessage = 'Credenciales inválidas';
      
      if (err.response?.data) {
        const data = err.response.data;
        
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (typeof data === 'object') {
          errorMessage = 
            data.message || 
            data.Message || 
            data.error || 
            data.Error || 
            'Credenciales inválidas';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img 
            src="/bekind.png" 
            alt="Be Kind Network" 
            className="login-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="login-title">
            ¡Empieza a conectar tu comunidad ante buenas acciones!
          </h1>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label className="form-label">Correo Electrónico*</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <input 
                type="email"
                placeholder="Ingresar correo"
                {...register('username')} 
                className="form-input"
              />
            </div>
            {errors.username && (
              <p className="form-error">{errors.username.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña*</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M12 17v-3" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                {...register('password')} 
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <button 
            type="button" 
            className="forgot-password"
            onClick={() => alert('Funcionalidad de recuperación pendiente')}
          >
            Recuperar contraseña
          </button>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }} 
          className="dev-button"
        >
        </button>
      </div>
    </div>
  );
};