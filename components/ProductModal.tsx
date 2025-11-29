
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EquipmentItem, CartItem } from '../types';

interface ProductModalProps {
  product: EquipmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: EquipmentItem, color?: string, weight?: string) => void;
  cartItems: CartItem[];
  isEditing: boolean;
  onSave: (product: EquipmentItem, newImagesMap?: Record<string, File>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, cartItems, isEditing, onSave }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState<EquipmentItem | null>(null);
  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(undefined);
  const [blobFileMap, setBlobFileMap] = useState<Record<string, File>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const machineryOptions = ['Pecho', 'Espalda', 'Pierna', 'Brazo', 'Hombro', 'Abdomen', 'Cardio'];
  const accessoryOptions = ['Peso Libre', 'Funcional', 'Barras', 'Discos', 'Mancuernas', 'Bancos', 'Agarres', 'Soportes', 'General'];

  // Check if current product configuration is in cart
  const isProductInCart = useMemo(() => {
    if (!product || !cartItems) return false;

    return cartItems.some(item => {
      if (item.equipment.id !== product.id) return false;

      // If made-to-order, any item with same ID counts as "in cart"
      if (product.availabilityStatus === 'made-to-order') return true;

      // For in-stock items, we must match the specific configuration (color/weight)
      const sameColor = item.selectedColor === selectedColor;
      const sameWeight = item.selectedWeight === selectedWeight;
      return sameColor && sameWeight;
    });
  }, [product, cartItems, selectedColor, selectedWeight]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSpecs(Object.entries(product.specifications).map(([key, value]) => ({ key, value })));
      // Only set default color if it's In Stock. For production, we want them to configure it in Cart unless forced.
      if (product.availabilityStatus === 'in-stock' && product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      } else {
        setSelectedColor(undefined);
      }

      if (product.availableWeights && product.availableWeights.length > 0) {
        setSelectedWeight(product.availableWeights[0]);
      } else {
        setSelectedWeight(undefined);
      }
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [product, isOpen]);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % (formData?.imageUrls.length || 1));
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + (formData?.imageUrls.length || 1)) % (formData?.imageUrls.length || 1));
  const goToImage = (index: number) => setCurrentImageIndex(index);

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget as HTMLInputElement;
    if (!formData) return;

    if (type === 'checkbox') {
      const checked = (e.currentTarget as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }

    if (name === 'price' || name === 'promotionalPrice') {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === 'category') {
      setFormData({ ...formData, category: value as 'Maquinaria' | 'Accesorios', muscleGroup: undefined });
    } else if (name === 'availabilityStatus') {
      setFormData({ ...formData, availabilityStatus: value as 'in-stock' | 'made-to-order' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!formData) return;
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddFeature = () => {
    if (!formData) return;
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    if (!formData) return;
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Color Management for Admin
  const handleColorChange = (index: number, value: string) => {
    if (!formData) return;
    const newColors = [...(formData.availableColors || [])];
    newColors[index] = value;
    setFormData({ ...formData, availableColors: newColors });
  };

  const handleAddColor = () => {
    if (!formData) return;
    setFormData({ ...formData, availableColors: [...(formData.availableColors || []), ''] });
  };

  const handleRemoveColor = (index: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      availableColors: (formData.availableColors || []).filter((_, i) => i !== index)
    });
  };

  // Weight Management for Admin
  const handleWeightChange = (index: number, value: string) => {
    if (!formData) return;
    const newWeights = [...(formData.availableWeights || [])];
    newWeights[index] = value;
    setFormData({ ...formData, availableWeights: newWeights });
  };

  const handleAddWeight = () => {
    if (!formData) return;
    setFormData({ ...formData, availableWeights: [...(formData.availableWeights || []), ''] });
  };

  const handleRemoveWeight = (index: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      availableWeights: (formData.availableWeights || []).filter((_, i) => i !== index)
    });
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData || !event.target.files) return;

    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newImageUrls = files.map(file => URL.createObjectURL(file as Blob));

    const newMap = { ...blobFileMap };
    newImageUrls.forEach((url, index) => {
      newMap[url] = files[index];
    });
    setBlobFileMap(newMap);

    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ...newImageUrls],
    });

    if (event.target) event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    if (!formData) return;
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (formData) {
      const specsObject = specs.reduce((obj, item) => {
        if (item.key) { // Only add if key is not empty
          obj[item.key] = item.value;
        }
        return obj;
      }, {} as { [key: string]: string });

      // Clean empty values
      const cleanedColors = (formData.availableColors || []).filter(c => c.trim() !== '');
      const cleanedWeights = (formData.availableWeights || []).filter(w => w.trim() !== '');

      // Validation for promo price
      if (formData.isPromotion && formData.promotionalPrice) {
        if (formData.promotionalPrice >= formData.price) {
          alert("El precio promocional debería ser menor al precio regular.");
          // We allow saving anyway, just a warning
        }
      }

      onSave({ ...formData, specifications: specsObject, availableColors: cleanedColors, availableWeights: cleanedWeights }, blobFileMap);
    }
  };

  if (!product || !formData) return null;
  const activeImageUrl = formData.imageUrls[currentImageIndex];

  // Determine price to show in VIEW mode
  const hasDiscount = product.isPromotion && product.promotionalPrice && product.promotionalPrice < product.price;
  const currentPrice = hasDiscount ? product.promotionalPrice! : product.price;

  // Logic to show/require color selection
  const showColorSelection = product.availabilityStatus === 'in-stock' && product.availableColors && product.availableColors.length > 0;
  const showWeightSelection = product.availableWeights && product.availableWeights.length > 0;

  // Logic to show Weight Configuration in Edit Mode
  const showWeightConfig = formData.category === 'Accesorios' && ['Peso Libre', 'Discos', 'Mancuernas', 'Funcional', 'Barras'].includes(formData.muscleGroup || '');

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
      <div className={`relative bg-white dark:bg-[#111] w-full h-full md:w-[95vw] md:h-[90vh] md:rounded-[2.5rem] flex flex-col md:flex-row transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-2xl overflow-y-auto md:overflow-hidden ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}`} onClick={(e) => e.stopPropagation()}>

        {/* Close Button: Fixed on mobile (relative to viewport), Absolute on desktop (relative to modal) */}
        <button onClick={onClose} className="fixed md:absolute top-4 right-4 md:top-6 md:right-6 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors z-[60] bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-md rounded-full p-2 shadow-sm border border-neutral-200 dark:border-white/10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* IMAGE SECTION */}
        <div className="w-full md:w-[65%] flex-shrink-0 flex flex-col md:flex-row bg-white dark:bg-[#0a0a0a] relative h-[45vh] md:h-full">

          {/* Vertical Thumbnails (Desktop) */}
          {!isEditing && formData.imageUrls.length > 1 && (
            <div className="hidden md:flex flex-col gap-4 p-6 w-24 lg:w-32 overflow-y-auto py-12 items-center z-10 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              {formData.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden transition-all duration-300 ease-out flex-shrink-0 ${index === currentImageIndex
                    ? 'ring-2 ring-neutral-900 dark:ring-white shadow-lg scale-100 opacity-100'
                    : 'opacity-50 hover:opacity-100 hover:scale-105 grayscale hover:grayscale-0'
                    }`}
                >
                  <img
                    src={url}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/100x100?text=X';
                      e.currentTarget.onerror = null;
                    }}
                    className="w-full h-full object-cover bg-white"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image Stage */}
          <div
            className={`relative flex-grow h-full bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-6 md:p-12 overflow-hidden ${!isEditing ? 'cursor-zoom-in' : ''}`}
            onMouseMove={(e) => {
              if (isEditing) return;
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              e.currentTarget.style.setProperty('--zoom-origin-x', `${x}%`);
              e.currentTarget.style.setProperty('--zoom-origin-y', `${y}%`);
            }}
          >
            {activeImageUrl ? (
              <img
                src={activeImageUrl}
                alt={formData.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400?text=Imagen+No+Disponible';
                  e.currentTarget.onerror = null;
                }}
                style={{
                  transformOrigin: 'var(--zoom-origin-x, 50%) var(--zoom-origin-y, 50%)',
                }}
                className={`w-full h-full object-scale-down drop-shadow-2xl transition-transform duration-200 ease-out ${isEditing ? 'opacity-50' : 'opacity-100 hover:scale-100'} ${!isEditing ? 'hover:scale-[2]' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">Añade una imagen</div>
            )}

            {/* Mobile Navigation Arrows */}
            {!isEditing && formData.imageUrls.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-black/60 text-neutral-900 dark:text-white rounded-full shadow-lg backdrop-blur-md border border-neutral-100 dark:border-white/10 active:scale-90 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-black/60 text-neutral-900 dark:text-white rounded-full shadow-lg backdrop-blur-md border border-neutral-100 dark:border-white/10 active:scale-90 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}

            {/* Mobile Dots Indicator */}
            {!isEditing && formData.imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                {formData.imageUrls.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-neutral-900 dark:bg-white' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Edit Mode: Add Image Overlay Button */}
          {isEditing && (
            <div className="absolute top-4 left-4 z-20">
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAddImages}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-black transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>Añadir Fotos</span>
              </button>
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="w-full md:w-[35%] flex flex-col md:h-full bg-white dark:bg-[#111] border-l border-neutral-100 dark:border-white/5 relative">
          {isEditing ? (
            <div className="p-6 md:p-12 md:flex-grow md:overflow-y-auto">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
                <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">{product.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <p className="text-sm text-neutral-500 mt-1">Configura los detalles del catálogo.</p>
              </div>

              <div className="space-y-6 pb-20">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Información Básica</label>
                  <div className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del producto" className="w-full p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-lg font-semibold outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white transition-all" />
                    <div className="grid grid-cols-2 gap-4">
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white">
                        <option value="Maquinaria">Maquinaria</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                      <select name="muscleGroup" value={formData.muscleGroup || ''} onChange={handleChange} className="w-full p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white">
                        <option value="">{formData.category === 'Maquinaria' ? 'Grupo Muscular...' : 'Tipo de Accesorio...'}</option>
                        {formData.category === 'Maquinaria' ? (
                          machineryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                        ) : (
                          accessoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Precio y Estado</label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="number" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Precio" className="w-full p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white" />
                    <select name="availabilityStatus" value={formData.availabilityStatus || 'made-to-order'} onChange={handleChange} className="w-full p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white">
                      <option value="in-stock">En Stock</option>
                      <option value="made-to-order">Bajo Pedido</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <input id="isPromotion" type="checkbox" name="isPromotion" checked={formData.isPromotion || false} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                    <label htmlFor="isPromotion" className="flex-grow text-sm font-medium text-neutral-700 dark:text-neutral-300">Activar Oferta</label>
                    {formData.isPromotion && (
                      <input type="number" name="promotionalPrice" value={formData.promotionalPrice || ''} onChange={handleChange} placeholder="Precio Oferta" className="w-32 p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-red-500 font-bold outline-none" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Descripción</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white" placeholder="Describe el producto..." />
                </div>

                {/* Weight Configuration - Conditionally Rendered */}
                {showWeightConfig && (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pesos Disponibles</label>
                      <button type="button" onClick={handleAddWeight} className="text-xs font-bold text-primary-600 hover:text-primary-700">+ Añadir Peso</button>
                    </div>
                    <div className="space-y-2">
                      {(formData.availableWeights || []).map((weight, index) => (
                        <div key={index} className="flex gap-2">
                          <input type="text" value={weight} onChange={(e) => handleWeightChange(index, e.target.value)} placeholder="Ej: 10KG" className="flex-grow p-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500" />
                          <button type="button" onClick={() => handleRemoveWeight(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Configuration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Colores Disponibles</label>
                    <button type="button" onClick={handleAddColor} className="text-xs font-bold text-primary-600 hover:text-primary-700">+ Añadir Color</button>
                  </div>
                  <div className="space-y-2">
                    {(formData.availableColors || []).map((color, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={color} onChange={(e) => handleColorChange(index, e.target.value)} placeholder="Ej: Rojo" className="flex-grow p-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500" />
                        <button type="button" onClick={() => handleRemoveColor(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Características</label>
                    <button type="button" onClick={handleAddFeature} className="text-xs font-bold text-primary-600 hover:text-primary-700">+ Añadir</button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-grow p-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500" />
                        <button type="button" onClick={() => handleRemoveFeature(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Especificaciones</label>
                    <button type="button" onClick={handleAddSpec} className="text-xs font-bold text-primary-600 hover:text-primary-700">+ Añadir</button>
                  </div>
                  <div className="space-y-2">
                    {specs.map((spec, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 relative">
                        <input type="text" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} placeholder="Atributo" className="p-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500" />
                        <div className="flex gap-2">
                          <input type="text" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} placeholder="Valor" className="flex-grow p-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500" />
                          <button type="button" onClick={() => handleRemoveSpec(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Management in Edit Mode */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Gestionar Imágenes</label>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.imageUrls.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden">
                        <img src={url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button type="button" onClick={() => handleRemoveImage(idx)} className="text-white hover:text-red-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 md:pt-6 md:mt-8 bg-white dark:bg-[#111] z-20 border-t border-neutral-100 dark:border-white/5 pb-8 md:pb-6 md:sticky md:bottom-0">
                  <button onClick={handleSave} className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // VIEW MODE
            <div className="flex flex-col md:h-full">
              <div className="p-6 md:p-12 md:flex-grow md:overflow-y-auto pb-32 md:pb-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">{product.category}</span>
                  {product.muscleGroup && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                      <span className="text-xs font-bold tracking-widest uppercase text-primary-600 dark:text-primary-400">{product.muscleGroup}</span>
                    </>
                  )}
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-6">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-4 mb-8 border-b border-neutral-100 dark:border-white/10 pb-8">
                  {hasDiscount ? (
                    <>
                      <span className="text-4xl font-bold text-neutral-900 dark:text-white">{formatCurrency(currentPrice)}</span>
                      <span className="text-xl text-neutral-400 line-through decoration-red-500 decoration-2">{formatCurrency(product.price)}</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full uppercase tracking-wide">Oferta</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-neutral-900 dark:text-white">{formatCurrency(product.price)}</span>
                  )}
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Stock Status & Colors/Weights */}
                {product.availabilityStatus === 'in-stock' ? (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-4">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      Disponible para entrega inmediata
                    </div>

                    {showWeightSelection && (
                      <div className="mb-6">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Peso</span>
                        <div className="flex flex-wrap gap-2">
                          {product.availableWeights?.map((weight) => (
                            <button
                              key={weight}
                              onClick={() => setSelectedWeight(weight)}
                              className={`px-4 py-2 border rounded-md text-sm font-semibold transition-all ${selectedWeight === weight
                                ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-black dark:border-white'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
                                }`}
                            >
                              {weight}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {showColorSelection && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Seleccionar Color</span>
                        <div className="flex flex-wrap gap-2">
                          {product.availableColors?.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedColor === color
                                ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white shadow-md'
                                : 'bg-white text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                                }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-500">Fabricación bajo pedido</p>
                      <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1 leading-snug">
                        Este equipo se fabrica exclusivamente para ti. Podrás personalizar los colores de estructura y tapicería en el carrito.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-8 pb-8">
                  {product.features.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Características Destacadas</h3>
                      <ul className="space-y-3">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm text-neutral-700 dark:text-neutral-300">
                            <svg className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Object.keys(product.specifications).length > 0 && (
                    <div className="pt-8 border-t border-neutral-100 dark:border-white/10">
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Especificaciones Técnicas</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-neutral-400 mb-1">{key}</p>
                            <p className="text-sm font-medium text-neutral-800 dark:text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Button Container: Static on mobile (at end of flow), Sticky on desktop */}
              <div className="p-4 md:pt-6 md:mt-8 bg-white dark:bg-[#111] z-20 border-t border-neutral-100 dark:border-white/5 pb-8 md:pb-6 sticky bottom-0">
                <button
                  onClick={() => onAddToCart(product, selectedColor, selectedWeight)}
                  disabled={isProductInCart}
                  className={`w-full py-3 md:py-4 px-6 rounded-xl md:rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 ${isProductInCart
                    ? 'bg-green-500 text-white cursor-default hover:translate-y-0 hover:shadow-xl'
                    : 'bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                    }`}
                >
                  {isProductInCart ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                      <span>En el carrito</span>
                    </>
                  ) : (
                    <>
                      <span>Añadir al Carrito</span>
                      <span className="opacity-70 font-normal ml-1">• {formatCurrency(currentPrice)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
