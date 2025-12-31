import React from 'react';
import {
    LayoutDashboard,
    ShoppingCart,
    MessageSquare,
    Package,
    Calendar,
    Image as ImageIcon,
    Wallet,
    Truck,
    FileText,
    Table,
    Users,
    Settings,
    ArrowUpRight,
    LogOut,
    X
} from 'lucide-react';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onAdminViewToggle: () => void;
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 ${active
            ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/40 scale-[1.02]'
            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:translate-x-2'
            }`}
    >
        <div className={`transition-transform duration-300 ${active ? 'scale-110 rotate-12' : 'group-hover:rotate-12'}`}>
            {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        </div>
        <span className={`font-black uppercase italic tracking-widest text-[11px] transition-all duration-500 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
        {active && (
            <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
        )}
    </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onAdminViewToggle, onLogout, isOpen, onClose }) => {
    // Handle nav item click - close sidebar on mobile after selection
    const handleNavClick = (tab: any) => {
        setActiveTab(tab);
        onClose(); // Close sidebar on mobile after selecting
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`w-72 border-r border-neutral-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] fixed top-0 bottom-0 left-0 z-50 transition-transform duration-500 ease-out flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/20 transition-all lg:hidden"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-10 mb-2">
                    <div className="cursor-pointer group flex items-center gap-4" onClick={() => handleNavClick('overview')}>
                        <img src="/logo-light.png" alt="Logo" className="h-10 w-auto object-contain dark:hidden transition-transform duration-500 group-hover:scale-110" />
                        <img src="/logo-sf.png" alt="Logo" className="h-10 w-auto object-contain hidden dark:block transition-transform duration-500 group-hover:scale-110" />
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar pb-20">
                    <div className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] italic mb-4 px-4">Centro de Control</div>
                    <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'overview'} onClick={() => handleNavClick('overview')} />
                    <NavItem icon={<ShoppingCart />} label="Ventas y Pedidos" active={activeTab === 'orders'} onClick={() => handleNavClick('orders')} />
                    <NavItem icon={<MessageSquare />} label="Comunicaciones" active={activeTab === 'whatsapp'} onClick={() => handleNavClick('whatsapp')} />

                    <div className="pt-8 text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] italic mb-4 px-4">Inventario & Medios</div>
                    <NavItem icon={<Package />} label="Catálogo Elite" active={activeTab === 'products'} onClick={() => handleNavClick('products')} />
                    <NavItem icon={<Calendar />} label="Eventos" active={activeTab === 'events'} onClick={() => handleNavClick('events')} />
                    <NavItem icon={<ImageIcon />} label="Galería" active={activeTab === 'gallery'} onClick={() => handleNavClick('gallery')} />

                    <div className="pt-8 text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] italic mb-4 px-4">Operación Élite</div>
                    <NavItem icon={<Wallet />} label="Cuentas por Cobrar" active={activeTab === 'debts'} onClick={() => handleNavClick('debts')} />
                    <NavItem icon={<FileText />} label="Cotizaciones" active={activeTab === 'quotes'} onClick={() => handleNavClick('quotes')} />
                    <NavItem icon={<Table />} label="Editar Precios" active={activeTab === 'bulk-prices'} onClick={() => handleNavClick('bulk-prices')} />

                    <div className="pt-8 text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] italic mb-4 px-4">Configuración</div>
                    <NavItem icon={<Users />} label="Gestionar Personal" active={activeTab === 'users'} onClick={() => handleNavClick('users')} />
                    <NavItem icon={<Settings />} label="Ajustes de Núcleo" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} />

                    <div className="my-8 mx-6 h-px bg-neutral-100 dark:bg-white/5" />

                    <div className="px-4 space-y-2">
                        <button
                            onClick={() => { onAdminViewToggle(); onClose(); }}
                            className="group w-full flex items-center gap-4 px-6 py-4 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-2xl transition-all duration-500 border border-transparent hover:border-primary-500/20"
                        >
                            <div className="transition-transform duration-300 group-hover:-translate-x-1">
                                <ArrowUpRight className="rotate-[225deg] w-4 h-4" />
                            </div>
                            <span className="font-black uppercase italic tracking-widest text-[10px]">Ir a la Tienda</span>
                        </button>

                        <button
                            onClick={() => { onLogout(); onClose(); }}
                            className="group w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-500 border border-transparent hover:border-red-500/20"
                        >
                            <div className="transition-transform duration-500 group-hover:rotate-12">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-black uppercase italic tracking-widest text-[10px]">Cerrar Sesión</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;
