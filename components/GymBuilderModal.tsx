
import React, { useState, useEffect, useMemo } from 'react';
import { EquipmentItem, GymPackage, CartItem } from '../types';
import ProductListItem from './ProductListItem';
import BusinessROICalculator from './BusinessROICalculator';


interface GymBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    allProducts: EquipmentItem[];
    onAddPackageToCart: (items: CartItem[]) => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const GymBuilderModal: React.FC<GymBuilderModalProps> = ({ isOpen, onClose, allProducts, onAddPackageToCart }) => {
    const [currentPackageName, setCurrentPackageName] = useState('Mi Gimnasio Personalizado');
    const [currentPackageItems, setCurrentPackageItems] = useState<CartItem[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'Maquinaria' | 'Accesorios'>('Maquinaria');
    const [isROICalculatorOpen, setIsROICalculatorOpen] = useState(false);


    const [savedPackages, setSavedPackages] = useState<GymPackage[]>([]);

    useEffect(() => {
        if (isOpen) {
            try {
                const storedPackages = localStorage.getItem('sagfo_gym_packages');
                if (storedPackages) {
                    setSavedPackages(JSON.parse(storedPackages));
                }
            } catch (error) {
                console.error("Failed to load gym packages from localStorage", error);
                setSavedPackages([]);
            }
        }
    }, [isOpen]);

    const savePackagesToStorage = (packages: GymPackage[]) => {
        try {
            localStorage.setItem('sagfo_gym_packages', JSON.stringify(packages));
        } catch (error) {
            console.error("Failed to save gym packages to localStorage", error);
        }
    };

    const filteredProducts = useMemo(() => {
        return allProducts
            .filter(p => p.category === activeCategory)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allProducts, activeCategory, searchTerm]);

    const totalPrice = useMemo(() => {
        return currentPackageItems.reduce((total, item) => total + item.equipment.price * item.quantity, 0);
    }, [currentPackageItems]);

    const handleAddItem = (product: EquipmentItem) => {
        if (!currentPackageItems.some(item => item.equipment.id === product.id)) {
            setCurrentPackageItems(prev => [...prev, { equipment: product, quantity: 1 }]);
        }
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveItem(productId);
            return;
        }
        setCurrentPackageItems(prev => prev.map(item => item.equipment.id === productId ? { ...item, quantity: newQuantity } : item));
    };


    const handleRemoveItem = (productId: string) => {
        setCurrentPackageItems(prev => prev.filter(item => item.equipment.id !== productId));
    };

    const handleSavePackage = () => {
        if (currentPackageName.trim() === '' || currentPackageItems.length === 0) {
            alert('Por favor, nombra tu paquete y añade al menos un producto.');
            return;
        }
        const newPackage: GymPackage = {
            id: new Date().toISOString() + Math.random(),
            name: currentPackageName,
            items: currentPackageItems,
            createdAt: new Date().toISOString(),
        };
        const updatedPackages = [...savedPackages, newPackage];
        setSavedPackages(updatedPackages);
        savePackagesToStorage(updatedPackages);
        alert(`Paquete "${currentPackageName}" guardado!`);
    };

    const handleLoadPackage = (packageId: string) => {
        const packageToLoad = savedPackages.find(p => p.id === packageId);
        if (packageToLoad) {
            setCurrentPackageName(packageToLoad.name);
            setCurrentPackageItems(packageToLoad.items);
        }
    };

    const handleDeletePackage = (packageId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este paquete guardado?')) {
            const updatedPackages = savedPackages.filter(p => p.id !== packageId);
            setSavedPackages(updatedPackages);
            savePackagesToStorage(updatedPackages);
        }
    };

    const handleAddToCartAndClose = () => {
        if (currentPackageItems.length === 0) {
            alert('Añade al menos un producto a tu paquete para añadirlo al carrito.');
            return;
        }
        onAddPackageToCart(currentPackageItems);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div
                className={`relative bg-neutral-50/95 dark:bg-zinc-900/95 backdrop-blur-md w-full h-[100dvh] md:w-[94vw] md:h-[90vh] md:rounded-[2.5rem] overflow-hidden flex flex-col transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-12 opacity-0'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Integrated & Minimal */}
                <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 border-b border-neutral-200 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-lg">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">GYM<span className="text-primary-600">ARCHITECT</span></h2>
                            <p className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.3em] opacity-60">SAGFOFITNESS ELITE PLANNING</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

                    {/* Left: Product Selection (60%) */}
                    <div className="lg:col-span-12 xl:col-span-8 flex flex-col overflow-hidden border-r border-neutral-200 dark:border-white/5">
                        <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/30 dark:bg-black/10">
                            <div className="relative w-full md:max-w-xs">
                                <input
                                    type="search"
                                    placeholder="Filtrar catálogo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border-none focus:ring-1 focus:ring-primary-500/30 text-xs font-bold transition-all"
                                />
                                <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <div className="flex bg-neutral-100 dark:bg-white/5 p-1 rounded-xl">
                                {['Maquinaria', 'Accesorios'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat as any)}
                                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white dark:bg-zinc-800 text-primary-600 shadow-sm italic' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProducts.map(product => (
                                <ProductListItem
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddItem}
                                    isAdded={currentPackageItems.some(i => i.equipment.id === product.id)}
                                />
                            ))}
                        </div>

                        {/* ROI Section Integration */}
                        {currentPackageItems.length > 0 && (
                            <div className="p-6 border-t border-neutral-200 dark:border-white/5 bg-white/10">
                                {!isROICalculatorOpen ? (
                                    <button
                                        onClick={() => setIsROICalculatorOpen(true)}
                                        className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors group"
                                    >
                                        <div className="p-2 bg-primary-600/10 rounded-lg group-hover:bg-primary-600/20">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">¿Qué tan rentable será este proyecto? Calcular ROI</span>
                                    </button>
                                ) : (
                                    <BusinessROICalculator
                                        totalInvestment={totalPrice}
                                        isOpen={isROICalculatorOpen}
                                        onClose={() => setIsROICalculatorOpen(false)}
                                    />
                                )}
                            </div>
                        )}
                    </div>


                    {/* Right: Configuration Sidebar (40%) */}
                    <div className="lg:hidden xl:flex xl:col-span-4 flex flex-col bg-white dark:bg-zinc-950/20 overflow-hidden">

                        <div className="p-8 flex flex-col h-full">
                            {/* Project Header */}
                            <div className="mb-8">
                                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1 block italic opacity-60">Nombre del Proyecto</span>
                                <input
                                    type="text"
                                    value={currentPackageName}
                                    onChange={(e) => setCurrentPackageName(e.target.value)}
                                    className="w-full bg-transparent text-3xl font-black text-neutral-900 dark:text-white border-none focus:ring-0 p-0 uppercase italic tracking-tighter"
                                    placeholder="NOMBRES TU GIMNASIO"
                                />
                            </div>

                            {/* Cart List */}
                            <div className="flex-grow overflow-y-auto no-scrollbar mb-8 space-y-3">
                                {currentPackageItems.length > 0 ? (
                                    currentPackageItems.map(item => (
                                        <div key={item.equipment.id} className="group flex items-center gap-4 bg-neutral-100 dark:bg-white/5 p-3 rounded-2xl border border-transparent hover:border-primary-500/10 transition-all">
                                            <div className="w-12 h-12 bg-white dark:bg-black/20 rounded-xl overflow-hidden p-2 flex-shrink-0">
                                                <img src={item.equipment.imageUrls[0]} alt={item.equipment.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="text-[10px] font-black text-neutral-900 dark:text-white uppercase italic truncate">{item.equipment.name}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center bg-white dark:bg-zinc-800 rounded-lg p-0.5 border border-neutral-200 dark:border-white/5">
                                                        <button onClick={() => handleUpdateQuantity(item.equipment.id, item.quantity - 1)} className="w-5 h-5 text-xs font-black">-</button>
                                                        <span className="w-6 text-center text-[9px] font-black">{item.quantity}</span>
                                                        <button onClick={() => handleUpdateQuantity(item.equipment.id, item.quantity + 1)} className="w-5 h-5 text-xs font-black">+</button>
                                                    </div>
                                                    <span className="text-[10px] font-black text-primary-600 italic">{formatCurrency(item.equipment.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.equipment.id)} className="text-neutral-300 hover:text-red-500 transition-colors p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-8 border-2 border-dashed border-neutral-300 dark:border-white/5 rounded-[2rem]">
                                        <p className="text-[9px] font-black uppercase tracking-widest italic">Añade equipos para comenzar el diseño</p>
                                    </div>
                                )}
                            </div>

                            {/* Saved Vault (Horizontal Scroll) */}
                            {savedPackages.length > 0 && (
                                <div className="mb-8 p-4 bg-neutral-100 dark:bg-black/20 rounded-2xl">
                                    <p className="text-[8px] font-black uppercase text-neutral-400 mb-2 italic">Proyectos Archivados</p>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                        {savedPackages.map(pkg => (
                                            <div
                                                key={pkg.id}
                                                onClick={() => handleLoadPackage(pkg.id)}
                                                className="flex-shrink-0 bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl cursor-pointer border border-transparent hover:border-primary-500/30 transition-all shadow-sm group"
                                            >
                                                <p className="text-[9px] font-black uppercase italic truncate max-w-[80px]">{pkg.name}</p>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeletePackage(pkg.id); }} className="text-neutral-300 hover:text-red-500 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-white dark:bg-zinc-800 rounded-full shadow-md p-1 transition-all">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Stats & Actions */}
                            <div className="pt-8 border-t border-neutral-200 dark:border-white/10 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] italic mb-1">Presupuesto del Espacio</span>
                                    <span className="text-3xl font-black italic tracking-tighter text-neutral-900 dark:text-white leading-none">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handleSavePackage} className="py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all italic">Archivar</button>
                                    <button onClick={handleAddToCartAndClose} className="py-4 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl flex items-center justify-center gap-2 italic">
                                        Integrar Plan
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default GymBuilderModal;
