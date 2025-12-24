import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onGymBuilderClick: () => void;
  onNavigate: (view: 'catalog' | 'orders') => void;
  onAdminViewToggle?: () => void;
  adminView?: 'dashboard' | 'site';
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLoginClick, onGymBuilderClick, onNavigate, onAdminViewToggle, adminView, searchTerm, onSearchChange }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollTo = (id: string) => {
    onNavigate('catalog');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigation = (view: 'catalog' | 'orders') => {
    onNavigate(view);
    setIsMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl z-[100] border-b border-white/20 dark:border-white/5 transition-all duration-500">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Brand Identity */}
          <div
            className="flex items-center cursor-pointer group transition-all duration-[600ms] hover:scale-105 active:scale-95"
            onClick={() => onNavigate('catalog')}
          >
            <img
              src="/logo-light.png"
              alt="SAGFO Logo"
              className="h-10 md:h-12 w-auto object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(37,211,102,0.3)] dark:hidden"
            />
            <img
              src="/logo-sf.png"
              alt="SAGFO Logo"
              className="h-10 md:h-12 w-auto object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(37,211,102,0.3)] hidden dark:block"
            />
          </div>

          {/* Dynamic Search - Minimalist Art */}
          <div className="hidden md:flex flex-1 justify-center px-12 lg:px-24">
            {adminView !== 'dashboard' && (
              <div className="relative w-full max-w-lg group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-all group-focus-within:translate-x-1 group-focus-within:text-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 dark:text-neutral-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Explorar Catálogo Premium..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="w-full h-12 pl-14 pr-6 rounded-[1.5rem] bg-neutral-100/50 dark:bg-white/5 border border-transparent focus:border-white/20 dark:focus:border-white/10 focus:bg-white dark:focus:bg-zinc-800 transition-all duration-500 text-xs font-black uppercase tracking-widest placeholder:text-neutral-400 placeholder:font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/5 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Action Hub */}
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="flex items-center space-x-1 md:space-x-3">
              {adminView !== 'dashboard' && (
                <button
                  onClick={onGymBuilderClick}
                  className="relative text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-white transition-all p-3 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-2xl group flex items-center"
                  aria-label="Arma tu gimnasio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden lg:inline ml-3 text-[10px] font-black uppercase tracking-[0.2em] transform transition-all group-hover:translate-x-1">Planificador</span>
                </button>
              )}

              {adminView !== 'dashboard' && (
                <button
                  onClick={onCartClick}
                  className="relative text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-white transition-all p-3 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-2xl group flex items-center"
                  aria-label={`Carrito de compras, ${cartCount} productos`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center h-5 w-5 bg-primary-600 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-zinc-900 shadow-xl animate-pulse">
                      {cartCount}
                    </span>
                  )}
                  <span className="hidden lg:inline ml-3 text-[10px] font-black uppercase tracking-[0.2em] transform transition-all group-hover:translate-x-1">Carrito</span>
                </button>
              )}
            </div>

            <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 mx-2 hidden md:block"></div>

            <div className="relative" ref={menuRef}>
              {user ? (
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all p-1.5 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-[1.25rem] group" aria-label="Menú de usuario">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 flex items-center justify-center text-white dark:text-neutral-900 font-black text-sm shadow-xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="flex items-center space-x-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl shadow-neutral-900/10 hover:shadow-primary-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  <span>Ingresar</span>
                </button>
              )}

              {isMenuOpen && user && (
                <div className="absolute right-0 mt-5 w-72 origin-top-right bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl ring-1 ring-white/20 dark:ring-white/5 focus:outline-none py-4 animate-scaleIn border border-white dark:border-white/5 overflow-hidden">
                  <div className="px-8 py-6 bg-neutral-50/50 dark:bg-white/5 border-b border-neutral-100 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 dark:text-primary-500 mb-2 italic">
                      {user.role === 'admin' ? 'Master Admin' : user.role === 'transporter' ? 'Logistic Elite' : 'Elite Member'}
                    </p>
                    <p className="text-lg font-black text-neutral-900 dark:text-white truncate italic uppercase tracking-tighter leading-none">{user.name}</p>
                    <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 truncate mt-2 opacity-60 uppercase tracking-[0.1em]">{user.email}</p>
                  </div>
                  <div className="py-4">
                    {isCustomer && (
                      <button onClick={() => handleNavigation('orders')} className="w-full text-left flex items-center space-x-4 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700 dark:text-neutral-200 hover:bg-primary-500 hover:text-white transition-all duration-500 group italic">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        <span>Historial / Elite</span>
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={onAdminViewToggle} className="w-full text-left flex items-center space-x-4 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 group italic">
                        {adminView === 'dashboard' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-40 group-hover:opacity-100 transform transition-all" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-40 group-hover:opacity-100 transform transition-all" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-1 4a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1z" /><path d="M2.5 3A1.5 1.5 0 001 4.5v11A1.5 1.5 0 002.5 17h15a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0017.5 3h-15zM2 4.5a.5.5 0 01.5-.5h15a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5v-11z" /></svg>
                        )}
                        <span>{adminView === 'dashboard' ? 'Exhibición' : 'Centro Control'}</span>
                      </button>
                    )}
                  </div>
                  <div className="py-4 border-t border-neutral-100 dark:border-white/5">
                    <button onClick={handleLogout} className="w-full text-left flex items-center space-x-4 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 group italic">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      <span>Desconexión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;