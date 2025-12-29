
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CartItem, PaymentMethod, BankAccount } from '../types';
import { useAuth } from '../hooks/useAuth';
import { colombianDepartments } from '../data/colombia';
import { venezuelanStates } from '../data/venezuela';


declare global {
    interface Window {
        L: any;
    }
}

interface QuoteCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveItem: (productId: string) => void;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onSubmit: (
        userInfo: { name: string; email: string; phone: string; message: string; city: string; department: string; country: string; mapsLink?: string; address?: string },
        paymentMethod: PaymentMethod,
        financials: { totalOrderValue: number; amountPaid: number; amountPending: number },
        productionDetails?: { structureColor: string; upholsteryColor: string },
        paymentProofFile?: File
    ) => void;
    onLoginClick: () => void;
    onUpdateItemCustomization: (productId: string, field: 'structureColor' | 'upholsteryColor', value: string, color?: string, weight?: string) => void;
    bankAccounts: BankAccount[];
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const QuoteCartModal: React.FC<QuoteCartModalProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onSubmit, onLoginClick, onUpdateItemCustomization, bankAccounts }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', city: '', department: '', country: 'Colombia', mapsLink: '', address: '' });

    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Map Refs
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);

    const availableDepartments = useMemo(() => {
        return formData.country === 'Venezuela' ? venezuelanStates : colombianDepartments;
    }, [formData.country]);

    const availableCities = useMemo(() => {
        const dept = availableDepartments.find(d => d.name === formData.department);
        return dept ? dept.cities : [];
    }, [formData.department, availableDepartments]);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                department: user.department || '',
                country: user.country || 'Colombia',
                address: user.address || '',
                message: '',
                mapsLink: user.locationUrl || ''
            });

            // If user has a location saved, try to show map
            if (user.locationUrl && user.locationUrl.includes('maps')) {
                setIsMapVisible(true);
            }
        } else if (!user) {
            setFormData({ name: '', email: '', phone: '', message: '', city: '', department: '', country: 'Colombia', mapsLink: '', address: '' });
            setIsMapVisible(false);
        }
    }, [user, isOpen]);

    // Initialize Map when visible
    useEffect(() => {
        if (isOpen && isMapVisible && mapContainerRef.current) {
            // Use requestAnimationFrame for smoother initialization
            requestAnimationFrame(() => {
                const coords = parseMapsLink(formData.mapsLink) || { lat: 4.6097, lng: -74.0817 }; // Default Bogota
                initMap(coords.lat, coords.lng);
            });
        }
    }, [isOpen, isMapVisible, formData.mapsLink]);

    // Parse Google Maps Link
    const parseMapsLink = (link: string) => {
        try {
            const url = new URL(link);
            const q = url.searchParams.get('q');
            if (q) {
                const [lat, lng] = q.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    const initMap = (lat: number, lng: number) => {
        if (typeof window === 'undefined' || !window.L || !mapContainerRef.current) {
            console.warn('Map dependencies not ready');
            return;
        }

        try {
            if (!mapRef.current) {
                // Force container to have dimensions
                mapContainerRef.current.style.width = '100%';
                mapContainerRef.current.style.height = '100%';

                mapRef.current = window.L.map(mapContainerRef.current, {
                    center: [lat, lng],
                    zoom: 16,
                    zoomControl: true
                });

                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap',
                    maxZoom: 19
                }).addTo(mapRef.current);
            } else {
                mapRef.current.setView([lat, lng], 16);
                // Force map to recalculate size
                setTimeout(() => {
                    if (mapRef.current) {
                        mapRef.current.invalidateSize();
                    }
                }, 100);
            }

            // Custom Icon to avoid 404s with webpack/react issues in some setups
            const icon = window.L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = window.L.marker([lat, lng], { draggable: true, icon }).addTo(mapRef.current);
                markerRef.current.on('dragend', (event: any) => {
                    const position = event.target.getLatLng();
                    const mapsUrl = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
                    setFormData(prev => ({ ...prev, mapsLink: mapsUrl }));
                });
            }
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    };

    // --- LOGIC FOR SPLIT PAYMENTS ---
    const calculation = useMemo(() => {
        let inStockTotal = 0;
        let productionTotal = 0;
        let hasProductionItems = false;
        let hasInStockItems = false;

        cartItems.forEach(item => {
            const itemTotal = item.equipment.price * item.quantity;
            if (item.equipment.availabilityStatus === 'made-to-order') {
                productionTotal += itemTotal;
                hasProductionItems = true;
            } else {
                inStockTotal += itemTotal;
                hasInStockItems = true;
            }
        });

        const totalOrderValue = inStockTotal + productionTotal;

        // Logic: 100% of In-Stock + 50% of Production
        const amountPaid = inStockTotal + (productionTotal * 0.5);
        const amountPending = productionTotal * 0.5;

        let paymentMethod: PaymentMethod = 'standard';
        if (hasProductionItems && hasInStockItems) paymentMethod = 'mixed';
        else if (hasProductionItems) paymentMethod = 'production';

        return {
            inStockTotal,
            productionTotal,
            totalOrderValue,
            amountPaid,
            amountPending,
            paymentMethod,
            hasProductionItems,
            hasInStockItems
        };
    }, [cartItems]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, country: e.target.value, department: '', city: '' }));
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, department: e.target.value, city: '' }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("La geolocalización no es compatible con tu navegador.");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                setFormData(prev => ({ ...prev, mapsLink: mapsUrl }));
                setIsLocating(false);
                setIsMapVisible(true);
                // Init map will happen via useEffect
            },
            (error) => {
                console.error(error);
                alert("No se pudo obtener tu ubicación. Por favor, asegúrate de dar permisos de ubicación o ingresa el enlace manualmente.");
                setIsLocating(false);
            }
        );
    };

    const toggleMapManual = () => {
        setIsMapVisible(!isMapVisible);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Validate production items have colors
        if (calculation.hasProductionItems) {
            const missingCustomization = cartItems.some(item =>
                item.equipment.availabilityStatus === 'made-to-order' &&
                (!item.structureColor?.trim() || !item.upholsteryColor?.trim())
            );

            if (missingCustomization) {
                alert('Por favor, completa los colores de estructura y tapicería para todos los productos de producción.');
                return;
            }
        }

        if (!paymentProof) {
            alert('Es obligatorio adjuntar el comprobante de pago/transferencia.');
            return;
        }

        if (!formData.address || formData.address.trim() === '') {
            alert('Por favor ingresa una dirección de entrega escrita.');
            return;
        }

        const financials = {
            totalOrderValue: calculation.totalOrderValue,
            amountPaid: calculation.amountPaid,
            amountPending: calculation.amountPending
        };

        onSubmit(formData, calculation.paymentMethod, financials, undefined, paymentProof || undefined);

        // RESET STATE
        setPaymentProof(null);
        setFormData(prev => ({ ...prev, message: '' }));
        setIsMapVisible(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex justify-end transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500" onClick={onClose} />
            <div
                className={`relative bg-neutral-50/95 dark:bg-zinc-900/95 backdrop-blur-md w-full sm:max-w-xl md:max-w-2xl h-full flex flex-col transform transition-all duration-700 cubic-bezier(0.32, 0.72, 0, 1) shadow-[-20px_0_60px_rgba(0,0,0,0.3)] border-l border-white/20 dark:border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Compact */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">
                            TU<span className="text-primary-600">CARRITO</span>
                        </h2>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] opacity-60">SAGFOFITNESS ELITE</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 bg-neutral-200/50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-30">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            </div>
                            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-2 uppercase italic">El catálogo te espera</h3>
                            <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">Comenzar exploración</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Product List */}
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.equipment.id + (item.selectedColor || '') + (item.selectedWeight || '')} className="bg-white dark:bg-zinc-800/50 p-4 sm:p-6 rounded-[2rem] border border-neutral-100 dark:border-white/5 shadow-lg group hover:shadow-2xl transition-all duration-300">
                                        <div className="flex gap-6 sm:gap-8 items-center">
                                            {/* Big Image */}
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 dark:bg-black/20 rounded-2xl overflow-hidden p-4 flex-shrink-0 border border-neutral-200 dark:border-white/5">
                                                <img
                                                    src={(item.equipment.imageUrls && item.equipment.imageUrls.length > 0) ? item.equipment.imageUrls[0] : 'https://placehold.co/100x100?text=SAGFO'}
                                                    alt={item.equipment.name}
                                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0 flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white uppercase italic leading-none">{item.equipment.name}</h4>
                                                            {item.equipment.availabilityStatus === 'in-stock' && (
                                                                <span className="px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[8px] font-black uppercase tracking-wider whitespace-nowrap">Entrega Inmediata</span>
                                                            )}
                                                        </div>

                                                        {/* Variants Tags */}
                                                        {(item.selectedColor || item.selectedWeight) && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.selectedColor && (
                                                                    <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded-lg bg-neutral-50 dark:bg-white/5">
                                                                        <div className="w-2 h-2 rounded-full border border-neutral-300" style={{ backgroundColor: item.selectedColor.toLowerCase().includes('rojo') ? '#ef4444' : item.selectedColor.toLowerCase().includes('azul') ? '#3b82f6' : item.selectedColor.toLowerCase().includes('negro') ? '#171717' : item.selectedColor.toLowerCase().includes('blanco') ? '#ffffff' : '#9ca3af' }} />
                                                                        <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{item.selectedColor}</span>
                                                                    </div>
                                                                )}
                                                                {item.selectedWeight && (
                                                                    <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded-lg bg-neutral-50 dark:bg-white/5">
                                                                        <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{item.selectedWeight}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price (Top Right) */}
                                                    <span className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white italic tracking-tighter">{formatCurrency(item.equipment.price * item.quantity)}</span>
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    {/* Quantity Control */}
                                                    <div className="flex items-center bg-neutral-100 dark:bg-black/30 rounded-2xl p-1.5 border border-neutral-200 dark:border-white/5 shadow-inner gap-1">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity - 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-lg font-black text-neutral-900 dark:text-white bg-white dark:bg-white/5 hover:bg-white/80 rounded-xl transition-all active:scale-95 shadow-sm"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-black text-neutral-900 dark:text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-lg font-black text-neutral-900 dark:text-white bg-white dark:bg-white/5 hover:bg-white/80 rounded-xl transition-all active:scale-95 shadow-sm"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => onRemoveItem(item.equipment.id)}
                                                        className="group/trash flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-neutral-300 hover:text-red-500 transition-all"
                                                    >
                                                        <span className="text-[10px] font-black uppercase hidden sm:block opacity-0 group-hover/trash:opacity-100 transition-all">Eliminar</span>
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Financial Summary */}
                            <div className="p-8 bg-neutral-900 dark:bg-zinc-800 text-white rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden group border border-white/5">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider opacity-60">
                                        <span>Subtotal de Pedido</span>
                                        <span className="font-black">{formatCurrency(calculation.totalOrderValue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-primary-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                            <span>Pendiente contra entrega</span>
                                        </div>
                                        <span className="font-black">{formatCurrency(calculation.amountPending)}</span>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-white/10">
                                        <div className="flex justify-between items-baseline">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Monto del Anticipo</p>
                                                <p className="text-3xl font-black italic tracking-tighter">{formatCurrency(calculation.amountPaid)}</p>
                                            </div>
                                            <span className="text-[9px] font-black px-2 py-1 bg-white/10 rounded-lg uppercase italic border border-white/10">
                                                {calculation.amountPending > 0 ? '50% Inicial' : 'Pago Total'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>




                            {/* Authentication Guard */}
                            {!user ? (
                                <div className="p-8 text-center bg-neutral-100 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
                                    <p className="text-xs font-bold text-neutral-500 mb-6 uppercase italic">Accede para procesar el carrito</p>
                                    <button onClick={onLoginClick} className="w-full py-4 bg-primary-600 text-white font-black rounded-xl uppercase tracking-widest text-[10px] italic shadow-lg">Iniciar Sesión / Registro</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                                    {/* Logistics */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic border-l-2 border-primary-500 pl-3">Destino de Entrega</h3>
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-neutral-400 uppercase pl-1">País</label>
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleCountryChange}
                                                    required
                                                    className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-neutral-100 dark:border-white/10 rounded-xl text-xs font-black uppercase italic text-neutral-900 dark:text-white outline-none"
                                                >
                                                    <option value="Colombia" className="dark:bg-zinc-900">Colombia</option>
                                                    <option value="Venezuela" className="dark:bg-zinc-900">Venezuela</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-neutral-400 uppercase pl-1">{formData.country === 'Venezuela' ? 'Estado' : 'Depto'}</label>
                                                    <select
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleDepartmentChange}
                                                        required
                                                        disabled={!formData.country}
                                                        className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-neutral-100 dark:border-white/10 rounded-xl text-xs font-black uppercase italic text-neutral-900 dark:text-white outline-none disabled:opacity-30"
                                                    >
                                                        <option value="" className="dark:bg-zinc-900">...</option>
                                                        {availableDepartments.map(dept => <option key={dept.name} value={dept.name} className="dark:bg-zinc-900">{dept.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-neutral-400 uppercase pl-1">Ciudad</label>
                                                    <select
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={!formData.department}
                                                        className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-neutral-100 dark:border-white/10 rounded-xl text-xs font-black uppercase italic text-neutral-900 dark:text-white outline-none disabled:opacity-30"
                                                    >
                                                        <option value="" className="dark:bg-zinc-900">...</option>
                                                        {availableCities.map(city => <option key={city} value={city} className="dark:bg-zinc-900">{city}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={handleGetLocation} className="flex-grow py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-[9px] font-black uppercase italic tracking-widest">Obtener GPS Precise</button>
                                                <button type="button" onClick={toggleMapManual} className="p-3 bg-neutral-100 dark:bg-white/5 rounded-xl text-neutral-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></button>
                                            </div>

                                            {isMapVisible && (
                                                <div className="w-full h-48 rounded-2xl overflow-hidden border border-primary-500/20 shadow-inner">
                                                    <div ref={mapContainerRef} className="w-full h-full" />
                                                </div>
                                            )}

                                            <textarea
                                                name="address"
                                                placeholder="Dirección exacta, barrio, apto..."
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                rows={2}
                                                className="w-full p-4 bg-white dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-xl text-xs font-medium text-neutral-900 dark:text-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Verification */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic border-l-2 border-primary-500 pl-3">Comprobante de Pago</h3>
                                        <div className="bg-neutral-100 dark:bg-white/5 p-4 rounded-2xl space-y-4 divide-y divide-neutral-200 dark:divide-white/5">
                                            {bankAccounts.map(acc => (
                                                <div key={acc.id} className="flex justify-between items-center pt-3 first:pt-0">
                                                    <div>
                                                        <p className="text-[8px] font-black text-neutral-400 uppercase">{acc.bankName} - {acc.accountType}</p>
                                                        <p className="text-sm font-black text-neutral-900 dark:text-white italic tracking-wider leading-none mt-1">{acc.accountNumber}</p>
                                                        <p className="text-[7px] font-medium text-neutral-400 uppercase mt-1">Titular: {acc.holderName}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(acc.accountNumber);
                                                            alert('Número de cuenta copiado');
                                                        }}
                                                        className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center text-primary-600 shadow-sm border border-neutral-100 dark:border-white/5 hover:scale-110 active:scale-90 transition-all"
                                                        title="Copiar número"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {bankAccounts.length === 0 && (
                                                <p className="text-[9px] font-black text-neutral-400 uppercase italic text-center py-2">No hay cuentas configuradas</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full py-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${paymentProof ? 'border-primary-500 bg-primary-500/5' : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'}`}
                                        >
                                            {paymentProof && paymentProof.type.startsWith('image/') ? (
                                                <div className="w-full px-4 flex flex-col items-center">
                                                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-white dark:bg-black/20 mb-2 border border-neutral-200 dark:border-white/10">
                                                        <img
                                                            src={URL.createObjectURL(paymentProof)}
                                                            alt="Comprobante Preview"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <p className="text-[9px] font-black uppercase text-primary-600">Clic para cambiar imagen</p>
                                                    <p className="text-[8px] font-medium opacity-50 uppercase text-neutral-900 dark:text-white mt-1">{paymentProof.name}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-[10px] font-black uppercase italic text-neutral-900 dark:text-white">{paymentProof ? '✓ Comprobante Cargado' : 'Subir Comprobante'}</p>
                                                    {paymentProof && <p className="text-[8px] font-medium opacity-50 uppercase text-neutral-900 dark:text-white">{paymentProof.name}</p>}
                                                </>
                                            )}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                                    </div>

                                    {/* Action */}
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-black rounded-2xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-[0.2em] text-xs italic group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 text-white transition-transform duration-500 skew-y-12" />
                                        <span className="relative z-10">Confirmar Pedido Élite</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default QuoteCartModal;
