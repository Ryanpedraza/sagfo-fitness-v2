
import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { colombianDepartments } from '../data/colombia';
import { venezuelanStates } from '../data/venezuela';
import { useMemo } from 'react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Profile) => void;
  user: Profile | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<Profile | null>(user);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData(user);
      } else {
        // Creation mode
        setFormData({
          id: '', // Empty ID signals creation to parent
          name: '',
          email: '',
          role: 'transporter', // Default to transporter
          phone: '',
          address: '',
          city: '',
          department: '',
          country: 'Colombia',
          password: ''
        });
      }
      setIsChanged(false); // Reset changed state
    }
  }, [user, isOpen]);

  const availableDepartments = useMemo(() => {
    if (!formData) return [];
    return formData.country === 'Venezuela' ? venezuelanStates : colombianDepartments;
  }, [formData?.country]);

  const availableCities = useMemo(() => {
    if (!formData) return [];
    const dept = availableDepartments.find(d => d.name === formData.department);
    return dept ? dept.cities : [];
  }, [formData?.department, availableDepartments]);

  useEffect(() => {
    if (formData) {
      if (!user) {
        // If creating, check if fields are filled
        setIsChanged(!!formData.name && !!formData.email && !!formData.password);
      } else {
        // If editing
        const hasChanged = user.name !== formData.name ||
          (user.phone || '') !== (formData.phone || '') ||
          user.role !== formData.role ||
          (user.address || '') !== (formData.address || '') ||
          (user.city || '') !== (formData.city || '') ||
          (user.department || '') !== (formData.department || '') ||
          (user.country || '') !== (formData.country || '') ||
          (user.password || '') !== (formData.password || '');
        setIsChanged(hasChanged);
      }
    }
  }, [formData, user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div className={`relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">{user ? 'Editar Usuario' : 'Crear Usuario'}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Nombre Completo</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!user}
                  required
                  className={`mt-1 w-full p-3 rounded-md border text-neutral-900 dark:text-white ${!!user ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500 cursor-not-allowed' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'}`}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Contraseña de Acceso</label>
                <input
                  id="password"
                  type="text"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  required={!user}
                  placeholder={user ? "********" : "Asignar contraseña"}
                  className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Visible para facilitar la gestión por parte del administrador.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Teléfono</label>
                  <input id="phone" type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Rol</label>
                  <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-zinc-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
                    <option value="customer" className="dark:bg-zinc-900">Cliente</option>
                    <option value="admin" className="dark:bg-zinc-900">Administrador</option>
                    <option value="transporter" className="dark:bg-zinc-900">Transportador</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">País</label>
                <select
                  name="country"
                  value={formData.country || 'Colombia'}
                  onChange={(e) => setFormData(prev => ({ ...prev!, country: e.target.value, department: '', city: '' }))}
                  className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-zinc-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="Colombia" className="dark:bg-zinc-900">Colombia</option>
                  <option value="Venezuela" className="dark:bg-zinc-900">Venezuela</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">{formData.country === 'Venezuela' ? 'Estado' : 'Depto'}</label>
                  <select
                    name="department"
                    value={formData.department || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev!, department: e.target.value, city: '' }))}
                    className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-zinc-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    <option value="" className="dark:bg-zinc-900">...</option>
                    {availableDepartments.map(d => <option key={d.name} value={d.name} className="dark:bg-zinc-900">{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Ciudad</label>
                  <select
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    disabled={!formData.department}
                    className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-zinc-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white disabled:opacity-30"
                  >
                    <option value="" className="dark:bg-zinc-900">...</option>
                    {availableCities.map(c => <option key={c} value={c} className="dark:bg-zinc-900">{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Dirección</label>
                <input id="address" type="text" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 px-8 py-4 flex justify-end space-x-3 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-sm font-semibold">Cancelar</button>
            <button
              type="submit"
              disabled={!isChanged}
              className="px-5 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-semibold transition-colors disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed"
            >
              {user ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;