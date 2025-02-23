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
    imagen: null, // Campo para la imagen capturada
  });
  const [faceDetectionProgress, setFaceDetectionProgress] = useState(0); // Progreso de detección del rostro
  const [modelsLoaded, setModelsLoaded] = useState(false); // Estado de carga de modelos de face-api.js
  const [cameraStream, setCameraStream] = useState(null); // Flujo de la cámara
  const [isCameraActive, setIsCameraActive] = useState(false); // Estado de la cámara
  const [capturedImage, setCapturedImage] = useState(null); // Imagen capturada
  const videoRef = useRef(null); // Referencia al video
  const canvasRef = useRef(null); // Referencia al canvas para detecciones

  const videoWidth = 640;
  const videoHeight = 480;

  // Cargar modelos de face-api.js al montar el componente
  useEffect(() => {
    const loadModels = async () => {
      const uri = '/models'; // Ajusta la ruta según donde estén tus modelos
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
          faceapi.nets.faceLandmark68Net.loadFromUri(uri),
          faceapi.nets.faceRecognitionNet.loadFromUri(uri),
        ]);
        setModelsLoaded(true);
        console.log('Modelos de face-api.js cargados correctamente');
      } catch (error) {
        console.error('Error al cargar modelos de face-api.js:', error);
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
      });
    }
  }, [initialData]);

  // Iniciar la cámara y la detección facial cuando isCameraActive cambie y los modelos estén cargados
  useEffect(() => {
    if (isCameraActive && modelsLoaded) {
      startVideo();
      const interval = setInterval(detectFace, 100); // Detectar rostros cada 100 ms
      return () => {
        clearInterval(interval); // Limpiar intervalo al desmontar
        stopVideo(); // Detener la cámara cuando isCameraActive cambie a false
      };
    } else if (!isCameraActive) {
      stopVideo(); // Asegurarse de detener la cámara si se desactiva
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
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play(); // Reproducir el video cuando los metadatos estén cargados
          };
        } else {
          toast.error('El elemento de video no está listo. Intenta de nuevo.');
          stream.getTracks().forEach(track => track.stop()); // Detener el flujo si falla
        }
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
        toast.error('No se pudo acceder a la cámara. Verifica los permisos o la disponibilidad de la cámara.');
        setIsCameraActive(false); // Desactivar la cámara si falla
      });
  };

  // Detener el video
  const stopVideo = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Función para iniciar la cámara desde el botón
  const handleStartCamera = () => {
    if (!modelsLoaded) {
      toast.error('Los modelos de reconocimiento facial aún no están cargados. Por favor, espera.');
      return;
    }
    setIsCameraActive(true);
    setCapturedImage(null); // Limpiar imagen capturada previa
    setFaceDetectionProgress(0); // Reiniciar progreso
  };

  // Detectar rostro en el flujo de video
  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    faceapi.matchDimensions(canvasRef.current, { width: videoWidth, height: videoHeight });

    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const context = canvasRef.current.getContext('2d');
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
  };

  // Capturar imagen desde la cámara
  const captureImage = () => {
    if (!videoRef.current) {
      toast.error('El video no está disponible para capturar.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured_face.jpg', { type: 'image/jpeg' });
      setFormData({ ...formData, imagen: file });
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      setIsCameraActive(false); // Detener la cámara tras capturar
    }, 'image/jpeg');
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellido_paterno', formData.apellido_paterno);
      formDataToSend.append('apellido_materno', formData.apellido_materno);
      formDataToSend.append('fecha_nacimiento', formData.fecha_nacimiento);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('correo', formData.correo);
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      if (initialData) {
        await axios.put(
          `http://localhost:8000/api/personas/${initialData.id}`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (formData.imagen) {
          await axios.post(
            `http://localhost:8000/api/biometricos`,
            { id_persona: initialData.id, imagen: formData.imagen },
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }
        toast.success('Persona y biométrico actualizados con éxito');
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/personas`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (formData.imagen) {
          const personaId = response.data.persona.id;
          await axios.post(
            `http://localhost:8000/api/biometricos`,
            { id_persona: personaId, imagen: formData.imagen },
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }
        toast.success('Persona y biométrico registrados con éxito');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar persona o biométrico:', error);
      toast.error(error.response?.data?.message || 'Error al guardar la persona o biométrico');
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
              <video
                ref={videoRef}
                width={videoWidth}
                height={videoHeight}
                className="rounded-md"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
                width={videoWidth}
                height={videoHeight}
              />
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
          disabled={!modelsLoaded || (formData.imagen && faceDetectionProgress === 0)}
        >
          {initialData ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default RegistroForm;