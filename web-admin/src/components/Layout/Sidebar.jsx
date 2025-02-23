import React from 'react';
import { Users, Calendar, BarChart2, Settings, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['token', 'empleadoInfo']);

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    removeCookie('empleadoInfo', { path: '/' });
    navigate('/auth');
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/inicio' },
    { icon: Users, label: 'Empleados', count: '234', path: '/empleados' },
    { icon: Calendar, label: 'Asistencia', count: '18', path: '/asistencias' },
    { icon: BarChart2, label: 'Reportes', count: '3', path: '/reportes' },
    { icon: Settings, label: 'Configuración', path: '/configuracion' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {isOpen && (
              <div className="flex justify-between items-center flex-1">
                <span>{item.label}</span>
                {item.count && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {item.count}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="m-3 p-3 flex items-center gap-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        {isOpen && <span>Cerrar Sesión</span>}
      </button>
    </div>
  );
};