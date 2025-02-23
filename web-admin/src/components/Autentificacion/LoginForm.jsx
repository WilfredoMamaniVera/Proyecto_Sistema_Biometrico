import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

export const LoginForm = ({ onRegisterClick }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetectionProgress, setFaceDetectionProgress] = useState(0);
  const [, setCookie] = useCookies(['token', 'personaInfo', 'usuarioInfo']);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const videoWidth = 640;
  const videoHeight = 480;

  useEffect(() => {
    const loadModels = async () => {
      const uri = '/models'; // Ajusta según donde estén tus modelos
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
          faceapi.nets.faceLandmark68Net.loadFromUri(uri),
          faceapi.nets.faceRecognitionNet.loadFromUri(uri),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error al cargar modelos:', error);
        setError('Error al cargar modelos de reconocimiento facial');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (isCameraActive && modelsLoaded) {
      startVideo();
      const interval = setInterval(detectFace, 100);
      return () => clearInterval(interval);
    } else if (!isCameraActive) {
      stopVideo();
    }
  }, [isCameraActive, modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
        setError('No se pudo acceder a la cámara.');
        setIsCameraActive(false);
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    faceapi.matchDimensions(canvasRef.current, { width: videoWidth, height: videoHeight });

    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, videoWidth, videoHeight);

        if (detections) {
          const resizedDetections = faceapi.resizeResults([detections], {
            width: videoWidth,
            height: videoHeight,
          });
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          const confidence = detections.detection.score * 100;
          setFaceDetectionProgress(Math.min(Math.round(confidence), 100));
        } else {
          setFaceDetectionProgress(0);
        }
      }
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    if (!correo) {
      setError('Por favor, ingresa tu correo antes de capturar el rostro.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);

    const img = await faceapi.fetchImage(imageData);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (detection) {
      const descriptor = Array.from(detection.descriptor);
      handleFaceLogin(descriptor);
    } else {
      setError('No se detectó un rostro. Intenta de nuevo.');
    }
  };

  const handleFaceLogin = async (descriptor) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, descriptor }),
      });

      if (!response.ok) {
        throw new Error('No se encontró coincidencia facial');
      }

      const data = await response.json();
      const { token, persona, usuario } = data;

      setCookie('token', token, { path: '/' });
      setCookie('personaInfo', JSON.stringify(persona), { path: '/' });
      setCookie('usuarioInfo', JSON.stringify(usuario), { path: '/' });

      setSuccess(`Bienvenido, ${persona.nombre}`);
      setTimeout(() => navigate('/inicio'), 1500);
    } catch (error) {
      setError(error.message || 'Error en la autenticación facial');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsCameraActive(false);
      setCapturedImage(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const personaResponse = await fetch('http://localhost:8000/api/personas', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const personas = await personaResponse.json();
      const persona = personas.find((p) => p.correo === correo);

      if (!persona) throw new Error('Correo no encontrado');

      const usuariosResponse = await fetch('http://localhost:8000/api/usuarios', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const usuarios = await usuariosResponse.json();
      const usuario = usuarios.find((u) => u.id_persona === persona.id);

      if (!usuario) throw new Error('Usuario no encontrado');
      if (usuario.contraseña !== contraseña) throw new Error('Contraseña incorrecta');

      const token = btoa(`${usuario.id_usuario}:${Date.now()}`);
      setCookie('token', token, { path: '/' });
      setCookie('personaInfo', JSON.stringify(persona), { path: '/' });
      setCookie('usuarioInfo', JSON.stringify(usuario), { path: '/' });

      setSuccess(`Bienvenido, ${persona.nombre}`);
      setTimeout(() => navigate('/inicio'), 1500);
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
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center" role="alert">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">O inicia sesión con tu rostro</p>
          {!isCameraActive && !capturedImage && (
            <button
              type="button"
              onClick={() => setIsCameraActive(true)}
              disabled={!modelsLoaded || isLoading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Iniciar Cámara
            </button>
          )}
          {isCameraActive && (
            <div className="mt-2">
              <div className="relative w-[640px] h-[480px] mx-auto">
                <video ref={videoRef} width={videoWidth} height={videoHeight} className="rounded-md" />
                <canvas ref={canvasRef} className="absolute top-0 left-0" width={videoWidth} height={videoHeight} />
              </div>
              <button
                type="button"
                onClick={captureImage}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Capturar Rostro
              </button>
              <button
                type="button"
                onClick={() => setIsCameraActive(false)}
                className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Detener Cámara
              </button>
            </div>
          )}
          {capturedImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Procesando imagen...</p>
            </div>
          )}
          {!modelsLoaded && (
            <p className="text-sm text-gray-500 mt-1">Cargando modelos de reconocimiento facial...</p>
          )}
          {isCameraActive && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Progreso de Detección: {faceDetectionProgress}%
              </label>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${faceDetectionProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>

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