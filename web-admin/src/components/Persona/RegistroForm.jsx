import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as faceapi from 'face-api.js';

const RegistroForm = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    telefono: '',
    correo: '',
    imagen: null,
    descriptor: null,
  });
  const [faceDetectionProgress, setFaceDetectionProgress] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const videoWidth = 640;
  const videoHeight = 480;

  // Cargar modelos de face-api.js
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
        console.log('Modelos de face-api.js cargados correctamente');
      } catch (error) {
        console.error('Error al cargar modelos:', error);
        toast.error('Error al cargar modelos de reconocimiento facial');
      }
    };
    loadModels();
  }, []);

  // Actualizar formData si hay datos iniciales (edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido_paterno: initialData.apellido_paterno || '',
        apellido_materno: initialData.apellido_materno || '',
        fecha_nacimiento: initialData.fecha_nacimiento || '',
        telefono: initialData.telefono || '',
        correo: initialData.correo || '',
        imagen: null,
        descriptor: null,
      });
    }
  }, [initialData]);

  // Iniciar/detener la cámara y detección facial
  useEffect(() => {
    if (isCameraActive && modelsLoaded) {
      startVideo();
      const interval = setInterval(detectFace, 100);
      return () => {
        clearInterval(interval);
        stopVideo();
      };
    } else if (!isCameraActive) {
      stopVideo();
    }
  }, [isCameraActive, modelsLoaded]);

  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Iniciar el video
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraStream(stream);
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
        toast.error('No se pudo acceder a la cámara. Verifica los permisos o la disponibilidad de la cámara.');
        setIsCameraActive(false);
      });
  };

  // Detener el video
  const stopVideo = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  };

  // Función para iniciar la cámara desde el botón
  const handleStartCamera = () => {
    if (!modelsLoaded) {
      toast.error('Los modelos aún no están cargados. Espera.');
      return;
    }
    setIsCameraActive(true);
    setCapturedImage(null);
    setFaceDetectionProgress(0);
  };

  // Detectar rostro en el flujo de video
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
          const resizedDetections = faceapi.resizeResults([detections], { width: videoWidth, height: videoHeight });
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

  // Capturar imagen desde la cámara
  const captureImage = async () => {
    if (!videoRef.current) {
      toast.error('El video no está disponible.');
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
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured_face.jpg', { type: 'image/jpeg' });
        setFormData({ ...formData, imagen: file, descriptor });
        setIsCameraActive(false);
      }, 'image/jpeg');
    } else {
      toast.error('No se detectó un rostro. Intenta de nuevo.');
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar datos para /api/personas
      const personaFormData = new FormData();
      personaFormData.append('nombre', formData.nombre);
      personaFormData.append('apellido_paterno', formData.apellido_paterno);
      personaFormData.append('apellido_materno', formData.apellido_materno);
      personaFormData.append('fecha_nacimiento', formData.fecha_nacimiento);
      personaFormData.append('telefono', formData.telefono);
      personaFormData.append('correo', formData.correo);

      let personaId;
      if (initialData) {
        // Actualizar persona existente
        const response = await axios.put(
          `http://localhost:8000/api/personas/${initialData.id}`,
          personaFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        personaId = initialData.id;
      } else {
        // Registrar nueva persona
        const response = await axios.post(
          `http://localhost:8000/api/personas`,
          personaFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        personaId = response.data.persona.id;
      }

      // Si se capturó una imagen y un descriptor, registrar datos biométricos
      if (formData.imagen && formData.descriptor) {
        const biometricoFormData = new FormData();
        biometricoFormData.append('id_persona', personaId);
        biometricoFormData.append('imagen', formData.imagen);
        biometricoFormData.append('descriptor', JSON.stringify(formData.descriptor));

        await axios.post(
          `http://localhost:8000/api/biometricos`,
          biometricoFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      toast.success(initialData ? 'Persona y biométrico actualizados con éxito' : 'Persona y biométrico registrados con éxito');
      onSuccess();
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error);
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.message || 'Error al guardar';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="apellido_paterno" className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="apellido_materno" className="block text-sm font-medium text-gray-700">Apellido Materno</label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sección para capturar la imagen del rostro */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen del Rostro</label>
        {!isCameraActive && !capturedImage && (
          <button
            type="button"
            onClick={handleStartCamera}
            disabled={!modelsLoaded}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
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
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Capturar Rostro
            </button>
            <button
              type="button"
              onClick={() => setIsCameraActive(false)}
              className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Detener Cámara
            </button>
          </div>
        )}
        {capturedImage && (
          <div className="mt-2">
            <div className="relative w-64 h-64 mx-auto">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover rounded-md" />
            </div>
            <button
              type="button"
              onClick={handleStartCamera}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a Capturar
            </button>
          </div>
        )}
        {!modelsLoaded && (
          <p className="text-sm text-gray-500 mt-1">Cargando modelos de reconocimiento facial...</p>
        )}
        {isCameraActive && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Progreso de Detección del Rostro: {faceDetectionProgress}%
            </label>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${faceDetectionProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={!modelsLoaded || (capturedImage && !formData.descriptor)}
        >
          {initialData ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default RegistroForm;