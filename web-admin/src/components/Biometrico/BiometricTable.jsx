import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Edit, Trash, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BiometricForm from '../Biometric/BiometricForm';

export const BiometricTable = () => {
  const [biometrics, setBiometrics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingBiometric, setEditingBiometric] = useState(null);
  const biometricsPerPage = 10;

  const fetchBiometrics = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }
      const response = await axios.get('http://localhost:8000/api/biometricos', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setBiometrics(response.data);
    } catch (error) {
      console.error('Error fetching biometrics:', error);
      toast.error(error.message || 'Error al cargar los biometricos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBiometrics();
  }, []);

  const indexOfLastBiometric = currentPage * biometricsPerPage;
  const indexOfFirstBiometric = indexOfLastBiometric - biometricsPerPage;
  const currentBiometrics = biometrics.slice(indexOfFirstBiometric, indexOfLastBiometric);
  const totalPages = Math.ceil(biometrics.length / biometricsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDeleteBiometric = async (id) => {
    toast.warn(
      <div className="w-full max-w-md p-2 min-h-[100px]">
        <p className="mb-6 text-center text-gray-800 font-semibold">
          ¿Estás seguro de que deseas eliminar este biométrico?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => toast.dismiss()} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md">
            Cancelar
          </button>
          <button
            onClick={async () => {
              setIsDeleting(true);
              toast.dismiss();
              try {
                const token = Cookies.get('token');
                await axios.delete(`http://localhost:8000/api/biometricos/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                });
                await fetchBiometrics();
                toast.success('Biométrico eliminado con éxito');
                const newTotalPages = Math.ceil((biometrics.length - 1) / biometricsPerPage);
                if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
              } catch (error) {
                toast.error(error.message || 'Error al eliminar el biométrico');
              } finally {
                setIsDeleting(false);
              }
            }}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md"
          >
            Eliminar
          </button>
        </div>
      </div>,
      { position: 'top-center', autoClose: false, hideProgressBar: true, closeOnClick: false, draggable: false, closeButton: false }
    );
  };

  const handleEditBiometric = (biometric) => {
    setEditingBiometric(biometric);
    setShowRegisterForm(true);
  };

  const handleFormSuccess = () => {
    fetchBiometrics();
    setShowRegisterForm(false);
    setEditingBiometric(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Biométricos</h2>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={isDeleting}
        >
          Nuevo Biométrico
        </button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-6 text-gray-600">Cargando biométricos...</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-gray-600">ID Persona</th>
                  <th className="text-center p-4 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentBiometrics.length > 0 ? (
                  currentBiometrics.map((biometric) => (
                    <tr key={biometric.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{biometric.id_persona}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-blue-600"
                            onClick={() => handleEditBiometric(biometric)}
                            disabled={isDeleting}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                            onClick={() => handleDeleteBiometric(biometric.id)}
                            disabled={isDeleting}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-6 text-gray-500">
                      No hay biométricos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {biometrics.length > biometricsPerPage && (
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Mostrando {indexOfFirstBiometric + 1} a {Math.min(indexOfLastBiometric, biometrics.length)} de {biometrics.length} biométricos
                </div>
                <div className="flex space-x-2">
                  <button onClick={goToPreviousPage} disabled={currentPage === 1 || isDeleting} className={`px-3 py-1 ${currentPage === 1 || isDeleting ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 text-gray-600">Página {currentPage} de {totalPages}</span>
                  <button onClick={goToNextPage} disabled={currentPage === totalPages || isDeleting} className={`px-3 py-1 ${currentPage === totalPages || isDeleting ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">{editingBiometric ? 'Editar Biométrico' : 'Registrar Nuevo Biométrico'}</h2>
              <button onClick={() => { setShowRegisterForm(false); setEditingBiometric(null); }} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <BiometricForm initialData={editingBiometric} onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricTable;