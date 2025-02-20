import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { EmployeeTable } from '../components/Empleados/EmployeeTable';
import EmployeeForm from '../components/Empleados/EmpleaadosForm';

const EmployeesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employees, setEmployees] = useState([
    {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      department: 'Tecnología',
      position: 'Desarrollador Senior',
      status: 'Activo'
    },
    {
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      department: 'Recursos Humanos',
      position: 'Gerente RRHH',
      status: 'Activo'
    },
    {
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      department: 'Ventas',
      position: 'Ejecutivo de Ventas',
      status: 'Inactivo'
    }
  ]);

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6">
          <EmployeeTable 
            employees={employees}
            onNewEmployee={() => setIsFormOpen(true)}
          />
          <EmployeeForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleAddEmployee}
          />
        </main>
      </div>
    </div>
  );
};

export default EmployeesPage;