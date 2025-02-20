import React from 'react';
import { MoreVertical, Edit, Trash } from 'lucide-react';

export const EmployeeTable = ({ employees, onNewEmployee }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Lista de Empleados</h2>
      <button 
        onClick={onNewEmployee}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Nuevo Empleado
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Empleado</th>
            <th className="text-left p-4">Departamento</th>
            <th className="text-left p-4">Cargo</th>
            <th className="text-left p-4">Estado</th>
            <th className="text-center p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">{employee.department}</td>
              <td className="p-4">{employee.position}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  employee.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Trash className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);