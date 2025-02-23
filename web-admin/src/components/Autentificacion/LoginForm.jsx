import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const LoginForm = ({ onRegisterClick }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [, setCookie] = useCookies(['token', 'personaInfo', 'usuarioInfo']);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const personaResponse = await fetch(`http://localhost:8000/api/personas`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const personas = await personaResponse.json();
      const persona = personas.find(p => p.correo === correo);
      
      if (!persona) {
        throw new Error('Correo no encontrado');
      }

      const usuariosResponse = await fetch(`http://localhost:8000/api/usuarios`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const usuarios = await usuariosResponse.json();
      const usuario = usuarios.find(u => u.id_persona === persona.id);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (usuario.contraseña !== contraseña) {
        throw new Error('Contraseña incorrecta');
      }
      
      const token = btoa(`${usuario.id}:${Date.now()}`);
      
      setCookie('token', token, { path: '/' });
      setCookie('personaInfo', JSON.stringify(persona), { path: '/' });
      setCookie('usuarioInfo', JSON.stringify(usuario), { path: '/' });
      
      setSuccess(`Bienvenido, ${persona.nombre}`);
      
      setTimeout(() => {
        navigate('/inicio');
      }, 1500);
      
    } catch (error) {
      setError(error.message);
      console.error('Error de autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center" role="alert">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center" role="alert">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            {success}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="correo"
                name="correo"
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ejemplo@correo.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                required
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </div>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
        
        {onRegisterClick && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button 
                onClick={onRegisterClick}
                className="font-medium text-indigo-600 hover:text-indigo-500"
                disabled={isLoading}
                type="button"
              >
                Registrarse
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
