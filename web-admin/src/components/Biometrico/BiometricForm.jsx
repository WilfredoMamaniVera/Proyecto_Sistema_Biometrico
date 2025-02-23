import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const BiometricForm = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    id_persona: '',
    imagen: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id_persona: initialData.id_persona || '',
        imagen: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('id_persona', formData.id_persona);
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      if (initialData) {
        await axios.post(`http://localhost:8000/api/biometricos/${initialData.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        toast.success('Biométrico actualizado con éxito');
      } else {
        await axios.post('http://localhost:8000/api/biometricos', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        toast.success('Biométrico registrado con éxito');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar biométrico:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el biométrico');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="id_persona" className="block text-sm font-medium text-gray-700">
          ID Persona
        </label>
        <input
          type="number"
          id="id_persona"
          name="id_persona"
          value={formData.id_persona}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
          Imagen Biométrica
        </label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          onChange={handleChange}
          accept="image/*"
          required={!initialData}
          className="mt-1 block w-full"
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {initialData ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default BiometricForm;