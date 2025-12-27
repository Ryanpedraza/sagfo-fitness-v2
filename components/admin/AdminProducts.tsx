import React, { useState } from 'react';
import { EquipmentItem } from '../../types';
import ScrollReveal from '../ScrollReveal';
import { Plus, Search, X, Edit, Trash2 } from 'lucide-react';

interface AdminProductsProps {
    products: EquipmentItem[];
    onEditProduct: (product: EquipmentItem) => void;
    onDeleteProduct: (productId: string) => void;
    onOpenCreateProductModal: () => void;
}

const AdminProducts: React.FC<AdminProductsProps> = ({
    products,
    onEditProduct,
    onDeleteProduct,
    onOpenCreateProductModal
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'All' | 'Maquinaria' | 'Accesorios'>('All');

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-primary-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Inventario Élite</h2>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión de Equipamiento de Alto Rendimiento</p>
                </div>
                <button
                    onClick={onOpenCreateProductModal}
                    className="flex items-center gap-3 px-8 py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Equipo Premium
                </button>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                <div className="relative flex-1 group">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none">
                        <Search className="w-6 h-6 text-neutral-300 dark:text-neutral-600 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-500" />
                        <div className="w-px h-6 bg-neutral-200 dark:bg-white/10" />
                    </div>
                    <input
                        type="text"
                        placeholder="EXPLORAR INVENTARIO ELITE..."
                        className="w-full pl-24 pr-12 py-8 rounded-[3.5rem] border-2 border-transparent bg-neutral-50 dark:bg-white/[0.03] text-neutral-900 dark:text-white text-xl font-black uppercase italic tracking-[0.1em] placeholder:text-neutral-300 dark:placeholder:text-white/10 placeholder:font-black placeholder:not-italic focus:bg-white dark:focus:bg-white/[0.07] focus:border-primary-600/30 outline-none transition-all duration-700 shadow-2xl shadow-neutral-200/50 dark:shadow-none focus:shadow-primary-600/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Category Filter Tabs */}
                <div className="bg-neutral-100 dark:bg-white/5 p-2 rounded-[2.5rem] flex items-center gap-2">
                    {(['All', 'Maquinaria', 'Accesorios'] as const).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase italic tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                        >
                            {cat === 'All' ? 'Todos' : cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                    .filter(p => {
                        // Category Filter
                        if (activeCategory !== 'All' && p.category !== activeCategory) return false;

                        // Search Filter
                        if (!searchTerm) return true;
                        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
                        return searchWords.every(word =>
                            p.name.toLowerCase().includes(word) ||
                            p.category.toLowerCase().includes(word) ||
                            (p.muscleGroup && p.muscleGroup.toLowerCase().includes(word)) ||
                            (p.description && p.description.toLowerCase().includes(word))
                        );
                    })
                    .map((product, index) => {
                        const availabilityClass = product.availabilityStatus === 'in-stock'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
                        const availabilityText = product.availabilityStatus === 'in-stock' ? 'En Stock' : 'Sobre Pedido';

                        return (
                            <ScrollReveal key={product.id} delay={index * 0.05} className="h-full">
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden group h-full">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://placehold.co/400x300?text=SAGFO'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => onEditProduct(product)}
                                                className="p-3 bg-white/95 dark:bg-zinc-800/95 text-neutral-700 dark:text-white rounded-full hover:bg-primary-500 hover:text-white transition-all shadow-lg backdrop-blur-sm active:scale-90"
                                                title="Editar Producto"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                                                        onDeleteProduct(product.id);
                                                    }
                                                }}
                                                className="p-3 bg-white/95 dark:bg-zinc-800/95 text-neutral-700 dark:text-white rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg backdrop-blur-sm active:scale-90"
                                                title="Eliminar Producto"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{product.name}</h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{product.category}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-neutral-900 dark:text-white">
                                                ${product.price.toLocaleString()}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs ${availabilityClass}`}>
                                                {availabilityText}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
            </div>
        </div>
    );
};

export default AdminProducts;
