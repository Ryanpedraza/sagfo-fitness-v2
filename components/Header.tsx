import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, LayoutGrid, LogIn, ChevronDown, User, LogOut, ClipboardList, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onGymBuilderClick: () => void;
  onNavigate: (view: 'catalog' | 'orders') => void;
  onAdminViewToggle: () => void;
  adminView: 'dashboard' | 'site';
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLoginClick, onGymBuilderClick, onNavigate, onAdminViewToggle, adminView, searchTerm, onSearchChange }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (view: 'catalog' | 'orders') => {
    onNavigate(view);
    setIsMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-700 ${isScrolled
        ? 'py-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
        : 'py-6 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">

          {/* Brand Identity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('catalog')}
          >
            <div className="relative">
              <img
                src="/logo-light.png"
                alt="SAGFO Logo"
                className="h-10 md:h-12 w-auto object-contain transition-all duration-500 group-hover:scale-105 dark:hidden"
              />
              <img
                src="/logo-sf.png"
                alt="SAGFO Logo"
                className="h-10 md:h-12 w-auto object-contain transition-all duration-500 group-hover:scale-105 hidden dark:block"
              />
              <div className="absolute -inset-4 bg-primary-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </motion.div>

          {/* Dynamic Search */}
          <div className="hidden md:flex flex-1 justify-center px-12 lg:px-24">
            {adminView !== 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-lg group"
              >
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <Search size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="search"
                  placeholder="Buscar Equipamiento de Élite..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="w-full h-12 pl-14 pr-6 rounded-full bg-neutral-200/50 dark:bg-white/5 border border-transparent focus:border-white/10 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-500 text-xs font-black uppercase tracking-widest placeholder:text-neutral-500 group-hover:bg-neutral-200 dark:group-hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary-500/5 text-neutral-900 dark:text-white"
                />
              </motion.div>
            )}
          </div>

          {/* Action Hub */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex items-center space-x-1 md:space-x-2">
              {adminView !== 'dashboard' && (
                <button
                  onClick={onGymBuilderClick}
                  className="relative p-3 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all group flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-white"
                >
                  <LayoutGrid size={22} className="group-hover:rotate-[15deg] transition-transform" />
                  <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[0.2em]">Planner</span>
                </button>
              )}

              {adminView !== 'dashboard' && (
                <button
                  onClick={onCartClick}
                  className="relative p-3 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all group flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-white"
                >
                  <div className="relative">
                    <ShoppingBag size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 bg-primary-600 text-white text-[8px] font-black rounded-full ring-2 ring-white dark:ring-black">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[0.2em]">Carrito</span>
                </button>
              )}
            </div>

            <div className="h-6 w-px bg-neutral-200 dark:bg-white/10 mx-2 hidden md:block"></div>

            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-black text-xs transition-transform group-hover:scale-110">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="group flex items-center gap-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all duration-500 shadow-xl"
                >
                  <LogIn size={14} strokeWidth={3} />
                  <span>Ingresar</span>
                </button>
              )}

              <AnimatePresence>
                {isMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    className="absolute right-0 mt-4 w-72 bg-white dark:bg-[#111111] rounded-[2rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] border border-neutral-100 dark:border-white/5 overflow-hidden z-[110]"
                  >
                    {/* User Profile Header */}
                    <div className="relative px-8 py-8 text-center overflow-hidden">
                      {/* Subtitle Glow */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary-500/10 blur-[50px] rounded-full -mt-20" />

                      <div className="relative z-10">
                        <span className="inline-block text-[9px] font-black uppercase tracking-[0.4em] text-primary-500 mb-2 italic">
                          {user.role === 'admin' ? 'Master Admin' : user.role === 'transporter' ? 'Logistic Elite' : 'Elite Member'}
                        </span>
                        <h4 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none mb-1">
                          {user.name}
                        </h4>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest opacity-60">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="px-3 pb-3 space-y-1">
                      {isCustomer && (
                        <button
                          onClick={() => handleNavigation('orders')}
                          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-white transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ClipboardList size={16} className="text-neutral-400 group-hover:text-primary-500" />
                          </div>
                          <span>Mis Pedidos</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={onAdminViewToggle}
                          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-white transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShieldCheck size={16} className="text-neutral-400 group-hover:text-blue-500" />
                          </div>
                          <span>{adminView === 'dashboard' ? 'Ver Tienda' : 'Panel de Control'}</span>
                        </button>
                      )}

                      <div className="h-px bg-neutral-100 dark:bg-white/5 mx-5 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogOut size={16} className="text-red-500" />
                        </div>
                        <span>Desconectar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;