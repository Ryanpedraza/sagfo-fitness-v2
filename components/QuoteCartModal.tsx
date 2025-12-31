
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
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
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        } else if (!user) {
            setFormData({ name: '', email: '', phone: '', message: '', city: '', department: '', country: 'Colombia', mapsLink: '', address: '' });
        }
    }, [user, isOpen]);


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
                        <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.4em]">SAGFOFITNESS ELITE</p>
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
                                    <div key={item.cartItemId || item.equipment.id} className="bg-white dark:bg-zinc-800/50 p-4 sm:p-6 rounded-[2rem] border border-neutral-100 dark:border-white/5 shadow-lg group hover:shadow-2xl transition-all duration-300">
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
                                                    <div className="space-y-1 w-full">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white uppercase italic leading-none">{item.equipment.name}</h4>
                                                            {item.equipment.availabilityStatus === 'in-stock' ? (
                                                                <span className="px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[8px] font-black uppercase tracking-wider whitespace-nowrap">Entrega Inmediata</span>
                                                            ) : (
                                                                <span className="px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[8px] font-black uppercase tracking-wider whitespace-nowrap">Sobre Pedido</span>
                                                            )}
                                                        </div>

                                                        {/* Variants Tags & Customization */}
                                                        <div className="flex flex-wrap gap-2 w-full mt-2">
                                                            {item.equipment.availabilityStatus === 'made-to-order' ? (
                                                                <>
                                                                    {/* Structure Input */}
                                                                    <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1">
                                                                        <label className="text-[8px] font-black text-neutral-400 dark:text-neutral-300 uppercase tracking-widest pl-1 italic">Color Estructura</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Ej: Negro Mate"
                                                                            value={item.structureColor || ''}
                                                                            onChange={(e) => onUpdateItemCustomization(item.cartItemId!, 'structureColor', e.target.value)}
                                                                            className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold uppercase outline-none focus:border-primary-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-neutral-900 dark:text-white"
                                                                        />
                                                                    </div>
                                                                    {/* Upholstery Input */}
                                                                    <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1">
                                                                        <label className="text-[8px] font-black text-neutral-400 dark:text-neutral-300 uppercase tracking-widest pl-1 italic">Color Tapicería</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Ej: Rojo"
                                                                            value={item.upholsteryColor || ''}
                                                                            onChange={(e) => onUpdateItemCustomization(item.cartItemId!, 'upholsteryColor', e.target.value)}
                                                                            className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold uppercase outline-none focus:border-primary-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-neutral-900 dark:text-white"
                                                                        />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {item.selectedWeight && (
                                                                        <div className="flex flex-col gap-1.5 w-fit">
                                                                            <label className="text-[8px] font-black text-neutral-400 uppercase tracking-widest pl-1 italic">Peso</label>
                                                                            <div className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-3 py-2 rounded-xl">
                                                                                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{item.selectedWeight}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {/* Simple Color Input for In-Stock - REMOVED AS PER USER REQUEST */}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Price (Top Right) */}
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white italic tracking-tighter">{formatCurrency(item.equipment.price * item.quantity)}</span>
                                                        <button onClick={() => onRemoveItem(item.cartItemId || item.equipment.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    {/* Quantity Control */}
                                                    <div className="flex items-center bg-neutral-100 dark:bg-black/30 rounded-2xl p-1 border border-neutral-200 dark:border-white/5 shadow-inner gap-1">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.cartItemId!, item.quantity - 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-lg font-black text-neutral-900 dark:text-white bg-white dark:bg-white/5 hover:bg-white/80 rounded-xl transition-all active:scale-95 shadow-sm"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-black text-neutral-900 dark:text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.cartItemId!, item.quantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-lg font-black text-neutral-900 dark:text-white bg-white dark:bg-white/5 hover:bg-white/80 rounded-xl transition-all active:scale-95 shadow-sm"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Financial Summary */}
                            <div className="p-8 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-[2.5rem] shadow-premium space-y-6 relative overflow-hidden group border border-neutral-100 dark:border-white/5">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-300">
                                        <span>Subtotal de Pedido</span>
                                        <span className="font-black">{formatCurrency(calculation.totalOrderValue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                            <span>Pendiente contra entrega</span>
                                        </div>
                                        <span className="font-black">{formatCurrency(calculation.amountPending)}</span>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-white/10">
                                        <div className="flex justify-between items-baseline">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 dark:text-primary-500">Monto del Anticipo</p>
                                                <p className="text-3xl font-black italic tracking-tighter">{formatCurrency(calculation.amountPaid)}</p>
                                            </div>
                                            <span className="text-[9px] font-black px-2 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg uppercase italic border border-neutral-200 dark:border-white/10">
                                                {calculation.amountPending > 0 ? '50% Inicial' : 'Pago Total'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>




                            {/* Authentication Guard */}
                            {!user ? (
                                <div className="p-8 text-center bg-neutral-100 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
                                    <p className="text-xs font-bold text-neutral-500 dark:text-neutral-300 mb-6 uppercase italic">Accede para procesar el carrito</p>
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

                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-neutral-400 uppercase pl-1">Dirección de Entrega</label>
                                            <textarea
                                                name="address"
                                                placeholder="Dirección exacta, barrio, apto..."
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                rows={2}
                                                className="w-full p-4 bg-white dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-xl text-xs font-medium text-neutral-900 dark:text-white outline-none focus:border-primary-500 transition-all"
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
                                                        <p className="text-[7px] font-medium text-neutral-400 dark:text-neutral-500 uppercase mt-1">Titular: {acc.holderName}</p>
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
                                                <p className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase italic text-center py-2">No hay cuentas configuradas</p>
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
                                                    <p className="text-[9px] font-black uppercase text-primary-600">Clic para cambiar comprobante</p>
                                                    <p className="text-[8px] font-medium opacity-50 uppercase text-neutral-900 dark:text-white mt-1">{paymentProof.name}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-[10px] font-black uppercase italic text-neutral-900 dark:text-white">{paymentProof ? '✓ Comprobante Cargado' : 'Subir Comprobante de Pago'}</p>
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
        </div>
    );
};

export default QuoteCartModal;
