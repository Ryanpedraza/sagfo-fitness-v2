import React, { useState } from 'react';
import { BankAccount } from '../../types';
import { Settings, Save, Phone, Image as ImageIcon, Wallet, Plus, Trash2, Upload, FileText, Shield } from 'lucide-react';

interface AdminSettingsProps {
    whatsAppNumber: string;
    onUpdateWhatsAppNumber: (number: string) => void;
    onEditHero: () => void;
    bankAccounts: BankAccount[];
    onAddBankAccount: (account: BankAccount) => void;
    onDeleteBankAccount: (id: string) => void;
    sealUrl: string;
    onUpdateSeal: (url: string) => void;
    onUploadSeal: (file: File) => void;
    onOptimizeImages?: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
    whatsAppNumber,
    onUpdateWhatsAppNumber,
    onEditHero,
    bankAccounts,
    onAddBankAccount,
    onDeleteBankAccount,
    sealUrl,
    onUpdateSeal,
    onUploadSeal,
    onOptimizeImages
}) => {
    const [tempWhatsApp, setTempWhatsApp] = useState(whatsAppNumber || '');
    const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({ bankName: '', accountNumber: '', accountType: 'Ahorros', holderName: '', holderId: '' });

    // Sincronizar estado local cuando cambian los props (Corrige el warning de controlled component)
    React.useEffect(() => {
        setTempWhatsApp(whatsAppNumber || '');
    }, [whatsAppNumber]);

    const handleSaveWhatsApp = () => {
        onUpdateWhatsAppNumber(tempWhatsApp);
        alert('Número de WhatsApp actualizado');
    };

    const handleAddAccount = () => {
        if (newAccount.bankName && newAccount.accountNumber && newAccount.holderName) {
            onAddBankAccount({
                ...newAccount as BankAccount,
                id: Date.now().toString()
            });
            setNewAccount({ bankName: '', accountNumber: '', accountType: 'Ahorros', holderName: '', holderId: '' });
        }
    };

    return (
        <div className="space-y-12 max-w-4xl">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-neutral-900 dark:bg-white rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Ajustes Nucleares</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Configuración Global del Sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* WHATSAPP CARD */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">Línea de Ventas</h3>
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">WhatsApp Business API</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">+57</span>
                            <input
                                type="text"
                                value={tempWhatsApp}
                                onChange={(e) => setTempWhatsApp(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-neutral-50 dark:bg-zinc-800 rounded-xl border-2 border-transparent focus:border-[#25D366] outline-none font-bold text-neutral-900 dark:text-white transition-all shadow-inner"
                            />
                        </div>
                        <button
                            onClick={handleSaveWhatsApp}
                            className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-black uppercase italic tracking-widest text-[10px] transition-all shadow-lg hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Línea
                        </button>
                    </div>
                </div>

                {/* HERO/BANNER CARD */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-600">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">Banner Principal</h3>
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Hero Section & Promociones</p>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-500 mb-6">
                        Gestiona las imágenes rotativas, títulos y botones de acción de la pantalla principal.
                    </p>
                    <button
                        onClick={onEditHero}
                        className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-black uppercase italic tracking-widest text-[10px] hover:scale-[1.02] transition-transform"
                    >
                        Abrir Editor Visual
                    </button>
                </div>

                {/* BANK ACCOUNTS CARD */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-white/5 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">Pasarela Financiera</h3>
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Cuentas Bancarias Autorizadas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {bankAccounts.map((account) => (
                            <div key={account.id} className="p-8 bg-neutral-50 dark:bg-zinc-800/80 rounded-[2rem] border border-neutral-200 dark:border-white/10 relative group transition-all hover:bg-white dark:hover:bg-zinc-800 shadow-sm hover:shadow-xl">
                                <button
                                    onClick={() => {
                                        if (window.confirm('¿Confirmas eliminar esta cuenta bancaria?')) {
                                            onDeleteBankAccount(account.id);
                                        }
                                    }}
                                    className="absolute top-6 right-6 p-3 bg-white dark:bg-zinc-700 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all sm:opacity-0 group-hover:opacity-100 shadow-lg active:scale-90"
                                    title="Eliminar Cuenta"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 italic">{account.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="font-black text-2xl text-neutral-900 dark:text-white tracking-widest italic">{account.accountNumber}</p>
                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">{account.accountType} • {account.holderName}</p>
                                    </div>
                                    <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                                        <p className="text-[10px] text-neutral-400 font-mono flex items-center gap-2">
                                            <Shield className="w-3 h-3" /> ID TITULAR: {account.holderId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-neutral-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-dashed border-neutral-300 dark:border-white/10">
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-4 uppercase tracking-wide italic">Agregar Nueva Cuenta Bancaria</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Nombre del Banco</label>
                                <input
                                    placeholder="Ej: Bancolombia, Nequi..."
                                    value={newAccount.bankName || ''}
                                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-medium text-neutral-900 dark:text-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Número de Cuenta</label>
                                <input
                                    placeholder="000-000000-00"
                                    value={newAccount.accountNumber || ''}
                                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-medium text-neutral-900 dark:text-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Tipo de Cuenta</label>
                                <select
                                    value={newAccount.accountType || 'Ahorros'}
                                    onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value as 'Ahorros' | 'Corriente' })}
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-medium text-neutral-900 dark:text-white transition-all shadow-sm"
                                >
                                    <option value="Ahorros">Ahorros</option>
                                    <option value="Corriente">Corriente</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Titular de la Cuenta</label>
                                <input
                                    placeholder="Nombre Completo"
                                    value={newAccount.holderName || ''}
                                    onChange={(e) => setNewAccount({ ...newAccount, holderName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-medium text-neutral-900 dark:text-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Documento (NIT/CC)</label>
                                <input
                                    placeholder="900.000.000-0"
                                    value={newAccount.holderId || ''}
                                    onChange={(e) => setNewAccount({ ...newAccount, holderId: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-medium text-neutral-900 dark:text-white transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAddAccount}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase italic tracking-widest text-[11px] transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Sincronizar cuenta bancaria
                        </button>
                    </div>
                </div>

                {/* CORPORATE SEAL CARD */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-white/5 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">Sello Corporativo</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest">Footer & Documentos Oficiales</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-1/3 bg-neutral-100 dark:bg-zinc-800 rounded-2xl p-4 flex items-center justify-center min-h-[200px] border-2 border-dashed border-neutral-300 dark:border-white/10 relative overflow-hidden group">
                            {sealUrl ? (
                                <img src={sealUrl} alt="Sello Corporativo" className="w-full h-auto object-contain max-h-40" />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase">Sin sello configurado</p>
                                </div>
                            )}
                            {sealUrl && (
                                <button
                                    onClick={() => onUpdateSeal('')}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Cargar Nuevo Sello</h4>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                                    Sube una imagen (PNG transparente recomendado) para usar como sello de garantía en el pie de página y documentos PDF.
                                </p>
                                <label className="block w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                onUploadSeal(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <div className="w-full py-4 border-2 border-dashed border-violet-500/30 hover:border-violet-500 bg-violet-50 dark:bg-violet-900/10 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-3 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest">
                                        <Upload className="w-5 h-5" />
                                        Seleccionar Archivo de Imagen
                                    </div>
                                </label>
                            </div>

                            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/20">
                                <p className="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                                    <span className="text-lg">💡</span>
                                    <span>
                                        <strong>Tip Pro:</strong> Para mejores resultados visuales, asegúrate de que el sello tenga fondo transparente y las dimensiones sean cuadradas (ej. 500x500px).
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SYSTEM LOGO/VERSION */}
                <div className="flex flex-col items-center justify-center pt-12 pb-6 border-t border-neutral-100 dark:border-white/5 opacity-40">
                    <img src="/logo-sf.png" alt="SAGFO" className="h-8 w-auto mb-4 grayscale" />
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-primary-600" />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest italic">Nucleus System Version 2.0</p>
                    </div>
                </div>

                {/* OPTIMIZATION CARD - FOR 200+ PRODUCTS */}
                <div className="bg-gradient-to-br from-neutral-900 to-black p-8 rounded-[2rem] border border-white/10 shadow-2xl md:col-span-2 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Settings className="w-24 h-24 text-white animate-spin-slow" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase italic tracking-tight">Optimización de Infraestructura</h3>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Protección de Datos & Rendimiento</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    Hemos detectado más de <span className="text-white font-black italic">200 productos</span> con formatos de imagen antiguos. Esta herramienta procesará toda la base de datos para convertir imágenes a <span className="text-primary-400 font-bold italic">WebP de Alta Definición</span> y reducir su peso hasta un 80%.
                                </p>
                                <ul className="space-y-2 text-xs text-neutral-500 font-bold uppercase tracking-tighter">
                                    <li className="flex items-center gap-2">✅ Conversión masiva a Formato Ultra-Light WebP</li>
                                    <li className="flex items-center gap-2">✅ Redimensión automática a 1200px (Nitidez Premium)</li>
                                    <li className="flex items-center gap-2">✅ Ahorro drástico en el límite de 10GB de Vercel</li>
                                </ul>
                            </div>

                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <button
                                    onClick={() => {
                                        if (window.confirm('⚠️ ATENCIÓN: Este proceso optimizará las imágenes de los 200 productos. ¿Deseas iniciar la limpieza masiva?')) {
                                            onOptimizeImages?.();
                                        }
                                    }}
                                    className="w-full py-6 bg-white text-black hover:bg-primary-500 hover:text-white rounded-xl font-black uppercase italic tracking-[0.2em] text-xs transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex flex-col items-center gap-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5 animate-spin-slow" />
                                        <span>Ejecutar Optimización Maestra</span>
                                    </div>
                                    <span className="text-[8px] opacity-60 tracking-[0.4em]">PROCESO AUTOMÁTICO • SIN PÉRDIDA DE CALIDAD</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
