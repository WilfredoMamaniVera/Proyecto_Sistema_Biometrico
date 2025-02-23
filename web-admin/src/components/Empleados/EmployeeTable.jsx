import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MoreVertical, Edit, Trash, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegistroForm from '../Persona/RegistroForm';

export const EmployeeTable = () => {
  const [persons, setPersons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const personsPerPage = 10;

  const fetchPersons = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      }
  
      const response = await axios.get('http://127.0.0.1:8000/api/personas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Eliminamos withCredentials: true
      setPersons(response.data);
    } catch (error) {
      console.error('Error fetching persons:', error);
      toast.error(error.message || 'Error al cargar las personas', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const indexOfLastPerson = currentPage * personsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - personsPerPage;
  const currentPersons = persons.slice(indexOfFirstPerson, indexOfLastPerson);
  const totalPages = Math.ceil(persons.length / personsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDeletePerson = async (personId) => {
    const personName = persons.find((p) => p.id === personId)?.nombre || 'persona';

    toast.warn(
      <div className="w-full max-w-md p-2 min-h-[100px]">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-xl font-bold text-gray-800 text-center">¡Atención!</h3>
        </div>
        <p className="mb-6 text-center text-gray-800 font-semibold">
          ¿Estás seguro de que deseas eliminar a{' '}
          <span className="text-red-600">{personName}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              setIsDeleting(true);
              toast.dismiss();
              try {
                const token = Cookies.get('token');
                if (!token) {
                  throw new Error('No se encontró el token de autenticación.');
                }
                await axios.delete(`http://127.0.0.1:8000/api/personas/${personId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
                });
                await fetchPersons();
                toast.success('Persona eliminada con éxito');
                const newTotalPages = Math.ceil((persons.length - 1) / personsPerPage);
                if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
              } catch (error) {
                console.error('Error al eliminar persona:', error);
                toast.error(error.message || 'Error al eliminar la persona');
              } finally {
                setIsDeleting(false);
              }
            }}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        icon: false,
      }
    );
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setShowRegisterForm(true);
  };

  const handleFormSuccess = () => {
    fetchPersons();
    setShowRegisterForm(false);
    setEditingPerson(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Personas</h2>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isDeleting}
        >
          Nueva Persona
        </button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-6 text-gray-600">Cargando personas...</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-gray-600">Persona</th>
                  <th className="text-left p-4 text-gray-600">Teléfono</th>
                  <th className="text-left p-4 text-gray-600">Fecha Nacimiento</th>
                  <th className="text-left p-4 text-gray-600">Correo</th>
                  <th className="text-center p-4 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPersons.length > 0 ? (
                  currentPersons.map((person) => (
                    <tr key={person.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {person.nombre.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {`${person.nombre} ${person.apellido_paterno} ${person.apellido_materno}`}
                            </p>
                            <p className="text-sm text-gray-500">{person.correo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{person.telefono || 'N/A'}</td>
                      <td className="p-4 text-gray-600">
                        {person.fecha_nacimiento
                          ? new Date(person.fecha_nacimiento).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-4 text-gray-600">{person.correo}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors disabled:text-gray-400"
                            onClick={() => handleEditPerson(person)}
                            title="Editar persona"
                            disabled={isDeleting}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors disabled:text-gray-400"
                            onClick={() => handleDeletePerson(person.id)}
                            title="Eliminar persona"
                            disabled={isDeleting}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No hay personas disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {persons.length > personsPerPage && (
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Mostrando <span className="font-medium">{indexOfFirstPerson + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(indexOfLastPerson, persons.length)}</span>{' '}
                  de <span className="font-medium">{persons.length}</span> personas
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || isDeleting}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      currentPage === 1 || isDeleting
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || isDeleting}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      currentPage === totalPages || isDeleting
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
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
              <h2 className="text-xl font-semibold text-gray-800">
                {editingPerson ? 'Editar Persona' : 'Registrar Nueva Persona'}
              </h2>
              <button
                onClick={() => {
                  setShowRegisterForm(false);
                  setEditingPerson(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <RegistroForm initialData={editingPerson} onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;