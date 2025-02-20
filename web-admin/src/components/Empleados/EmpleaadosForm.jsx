import React, { useState, useRef } from 'react';
import { Fingerprint, Scan, Check, Eye, EyeOff } from 'lucide-react';

const departments = [
  'Tecnología',
  'Recursos Humanos',
  'Ventas',
  'Marketing',
  'Finanzas'
];

const positions = {
  'Tecnología': ['Desarrollador Senior', 'Desarrollador Junior', 'Arquitecto de Software', 'QA Engineer'],
  'Recursos Humanos': ['Gerente RRHH', 'Especialista RRHH', 'Reclutador'],
  'Ventas': ['Gerente de Ventas', 'Ejecutivo de Ventas', 'Representante Comercial'],
  'Marketing': ['Director de Marketing', 'Especialista en Marketing Digital', 'Diseñador Gráfico'],
  'Finanzas': ['Controller', 'Analista Financiero', 'Contador']
};

const EmployeeForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    password: '',
    confirmPassword: '',
    useFaceId: false,
    useFingerprint: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState({
    faceId: { registered: false, inProgress: false },
    fingerprint: { registered: false, inProgress: false }
  });

  const videoRef = useRef(null);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      password: '',
      confirmPassword: '',
      useFaceId: false,
      useFingerprint: false,
    });
    
    setShowPassword(false);
    setShowConfirmPassword(false);
    
    setBiometricStatus({
      faceId: { registered: false, inProgress: false },
      fingerprint: { registered: false, inProgress: false }
    });

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const startFaceRegistration = async () => {
    try {
      setBiometricStatus(prev => ({
        ...prev,
        faceId: { ...prev.faceId, inProgress: true }
      }));

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setTimeout(() => {
        if (stream.getTracks) {
          stream.getTracks().forEach(track => track.stop());
        }
        setBiometricStatus(prev => ({
          ...prev,
          faceId: { registered: true, inProgress: false }
        }));
        setFormData(prev => ({ ...prev, useFaceId: true }));
      }, 3000);

    } catch (error) {
      alert('Error al acceder a la cámara: ' + error.message);
      setBiometricStatus(prev => ({
        ...prev,
        faceId: { registered: false, inProgress: false }
      }));
    }
  };

  const startFingerprintRegistration = async () => {
    try {
      setBiometricStatus(prev => ({
        ...prev,
        fingerprint: { ...prev.fingerprint, inProgress: true }
      }));

      setTimeout(() => {
        setBiometricStatus(prev => ({
          ...prev,
          fingerprint: { registered: true, inProgress: false }
        }));
        setFormData(prev => ({ ...prev, useFingerprint: true }));
      }, 3000);

    } catch (error) {
      alert('Error al registrar huella dactilar: ' + error.message);
      setBiometricStatus(prev => ({
        ...prev,
        fingerprint: { registered: false, inProgress: false }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    onSubmit({
      ...formData,
      status: 'Activo'
    });
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registrar Nuevo Empleado</h2>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="juan.perez@empresa.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar departamento</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              disabled={!formData.department}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar cargo</option>
              {formData.department && positions[formData.department].map(pos => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Métodos de inicio de sesión adicionales
            </label>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={startFaceRegistration}
                  disabled={biometricStatus.faceId.registered || biometricStatus.faceId.inProgress}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    biometricStatus.faceId.registered
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : biometricStatus.faceId.inProgress
                      ? 'bg-blue-50 border-blue-500 text-blue-700 animate-pulse'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {biometricStatus.faceId.registered ? (
                    <Check className="text-green-500" size={20} />
                  ) : (
                    <Scan size={20} className={biometricStatus.faceId.inProgress ? 'text-blue-500' : 'text-gray-500'} />
                  )}
                  <span>
                    {biometricStatus.faceId.registered
                      ? 'Face ID Registrado'
                      : biometricStatus.faceId.inProgress
                      ? 'Registrando Face ID...'
                      : 'Registrar Face ID'}
                  </span>
                </button>
                {biometricStatus.faceId.inProgress && (
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-48 bg-gray-100 rounded-lg object-cover"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={startFingerprintRegistration}
                disabled={biometricStatus.fingerprint.registered || biometricStatus.fingerprint.inProgress}
                className={`flex items-center gap-2 p-3 rounded-lg border w-full transition-all ${
                  biometricStatus.fingerprint.registered
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : biometricStatus.fingerprint.inProgress
                    ? 'bg-blue-50 border-blue-500 text-blue-700 animate-pulse'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                {biometricStatus.fingerprint.registered ? (
                  <Check className="text-green-500" size={20} />
                ) : (
                  <Fingerprint size={20} className={biometricStatus.fingerprint.inProgress ? 'text-blue-500' : 'text-gray-500'} />
                )}
                <span>
                  {biometricStatus.fingerprint.registered
                    ? 'Huella Dactilar Registrada'
                    : biometricStatus.fingerprint.inProgress
                    ? 'Registrando Huella Dactilar...'
                    : 'Registrar Huella Dactilar'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;