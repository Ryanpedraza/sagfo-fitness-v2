import React from 'react';
import { Profile } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface AdminUsersProps {
    profiles: Profile[];
    onOpenUserModal: (user: Profile | null) => void;
    onDeleteProfile: (profileId: string) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ profiles, onOpenUserModal, onDeleteProfile }) => {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-violet-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Comunidad SAGFO</h2>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Administración y Soporte de Usuarios</p>
                </div>
                <button
                    onClick={() => onOpenUserModal(null)}
                    className="flex items-center gap-3 px-8 py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Colaborador
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-zinc-800">
                        {profiles.map((profile) => (
                            <tr key={profile.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300">
                                            {profile.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-900 dark:text-white">{profile.name}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{profile.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                                                        ${profile.role === 'admin'
                                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                        }`}>
                                        {profile.role || 'user'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                    {profile.phone && <div>{profile.phone}</div>}
                                    {profile.city && <div>{profile.city}, {profile.department}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onOpenUserModal(profile)}
                                            className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('¿Eliminar usuario? Esta acción no se puede deshacer.')) {
                                                    onDeleteProfile(profile.id);
                                                }
                                            }}
                                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
};

export default AdminUsers;
