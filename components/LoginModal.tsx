


import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const [view, setView] = useState<'login' | 'register'>('login');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    // Reset fields when modal is closed or view is switched
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setAddress('');
                setCity('');
                setDepartment('');
                setError('');
                setView('login');
            }, 300); // Wait for closing animation
        }
    }, [isOpen]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            await register(name, email, password, 'customer', phone, address, city, department);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al registrarse.');
        }
    };

    const switchView = (newView: 'login' | 'register') => {
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setCity('');
        setDepartment('');
        setError('');
        setView(newView);
    }

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-all duration-500" />
            <div
                className={`relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 animate-scaleIn ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button UI */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 z-50 bg-neutral-100/50 dark:bg-white/5 p-2 rounded-full hover:scale-110 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="p-10 md:p-14">
                    <div className="mx-auto mb-10 h-20 w-20 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>

                    {view === 'login' ? (
                        <div className="animate-fadeIn">
                            <h2 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-2 uppercase italic">
                                SAGFO<span className="text-primary-600">ID</span>
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-10">
                                Accede a tu cuenta profesional de atleta.
                            </p>

                            <form onSubmit={handleLogin} className="text-left space-y-5">
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <input
                                            type="email"
                                            placeholder="Correo electrónico"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="group relative">
                                        <input
                                            type="password"
                                            placeholder="Contraseña"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-xl">
                                        <p className="text-sm text-red-600 dark:text-red-400 font-bold">{error}</p>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full mt-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                                >
                                    <span>Iniciar Sesión</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            </form>

                            <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-white/5">
                                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                                    ¿Aún no tienes cuenta?{' '}
                                    <button onClick={() => switchView('register')} className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                                        Regístrate gratis
                                    </button>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            <h2 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-2 uppercase italic">
                                REGISTRO
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-10">
                                Únete a la élite del fitness colombiano.
                            </p>

                            <form onSubmit={handleRegister} className="text-left space-y-4">
                                <div className="max-h-[40vh] overflow-y-auto px-1 space-y-4 no-scrollbar">
                                    <input
                                        type="text"
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Departamento"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Ciudad"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Dirección de entrega"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono / WhatsApp"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Contraseña (Mín. 6 caracteres)"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 focus:border-primary-500 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-neutral-900 dark:text-white font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-xl">
                                        <p className="text-sm text-red-600 dark:text-red-400 font-bold">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 text-white font-black py-5 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                                >
                                    <span>Crear mi cuenta de atleta</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            </form>

                            <div className="mt-10 pt-6 border-t border-neutral-100 dark:border-white/5">
                                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                                    ¿Ya formas parte de la élite?{' '}
                                    <button onClick={() => switchView('login')} className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                                        Inicia sesión aquí
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;