
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { EquipmentItem, CartItem, CategoryFilter, MuscleFilter } from '../types';
import { Plus, Trash2, X, Camera, Save, ArrowLeft, Maximize2, ZoomIn, Check } from 'lucide-react';


interface ProductModalProps {
  product: EquipmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: EquipmentItem, color?: string, weight?: string) => void;
  cartItems: CartItem[];
  isEditing: boolean;
  onSave: (product: EquipmentItem, newImagesMap?: Record<string, File>) => void;
  allProducts?: EquipmentItem[];
  onProductClick?: (product: EquipmentItem) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  cartItems,
  isEditing,
  onSave,
  allProducts = [],
  onProductClick
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(undefined);

  // High-End Zoom Logic
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // State for editing
  const [formData, setFormData] = useState<EquipmentItem | null>(null);
  const [newImagesMap, setNewImagesMap] = useState<Record<string, File>>({});
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Bloquear scroll de fondo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setFormData({ ...product });
      setNewImagesMap({});
      if (product.availableColors?.length) setSelectedColor(product.availableColors[0]);
      if (product.availableWeights?.length) setSelectedWeight(product.availableWeights[0]);
    }
  }, [product, isEditing]);


  const isProductInCart = useMemo(() => {
    if (!product || !cartItems) return false;
    return cartItems.some(item => item.equipment.id === product.id);
  }, [product, cartItems]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  if (!product || (isEditing && !formData)) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  const hasDiscount = product.isPromotion && product.promotionalPrice && product.promotionalPrice < product.price;

  // Zoom Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.imageUrls[currentImageIndex]})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '250%' // Zoom level
    });
  };

  // Handlers for editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const tempUrl = reader.result as string;
        const newUrls = [...formData.imageUrls];
        const oldUrl = newUrls[index];
        newUrls[index] = tempUrl;
        setFormData({ ...formData, imageUrls: newUrls });
        setNewImagesMap(prev => ({ ...prev, [tempUrl]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => { if (formData) setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] }); };
  const removeImageField = (index: number) => { if (formData && formData.imageUrls.length > 1) setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index) }); };
  const addFeature = () => { if (newFeature.trim() && formData) { setFormData({ ...formData, features: [...formData.features, newFeature.trim()] }); setNewFeature(''); } };
  const removeFeature = (index: number) => { if (formData) setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) }); };
  const addSpec = () => { if (newSpecKey.trim() && newSpecValue.trim() && formData) { setFormData({ ...formData, specifications: { ...formData.specifications, [newSpecKey.trim()]: newSpecValue.trim() } }); setNewSpecKey(''); setNewSpecValue(''); } };
  const removeSpec = (key: string) => { if (formData) { const newSpecs = { ...formData.specifications }; delete newSpecs[key]; setFormData({ ...formData, specifications: newSpecs }); } };
  const handleSave = () => { if (formData) onSave(formData, newImagesMap); };

  return (
    <div
      className={`fixed inset-0 z-[250] bg-white dark:bg-[#070707] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto no-scrollbar ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 invisible'
        }`}
    >
      {/* NAVEGACIÓN ELITE */}
      <nav className="sticky top-0 z-[260] bg-white/80 dark:bg-black/80 backdrop-blur-2xl px-6 md:px-20 flex items-center justify-between h-[90px] border-b border-neutral-100 dark:border-white/5">
        <button onClick={onClose} className="flex items-center gap-6 group">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest italic leading-none mb-1">Catálogo Sagfo</span>
            <span className="block text-sm font-black text-neutral-400 dark:text-neutral-300 uppercase tracking-tighter group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Volver a Explorar</span>
          </div>
        </button>

        <div className="flex items-center gap-4">
          {isEditing && (
            <button onClick={handleSave} className="relative group px-10 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-[1.5rem] font-black uppercase italic tracking-[0.2em] text-[10px] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-3xl">
              <span className="relative z-10">Sincronizar Producto</span>
              <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:bg-red-500 hover:text-white hover:rotate-90 transition-all duration-500 border border-neutral-200 dark:border-white/5"
          >
            <X size={28} strokeWidth={3} />
          </button>
        </div>

      </nav>

      {/* CONTENIDO DE DISEÑO INTERNACIONAL */}
      <div className="max-w-[1700px] mx-auto px-6 md:px-20 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* LADO IZQUIERDO: VISUALIZADOR CON ZOOM PROFESIONAL (Col 7) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-10 lg:sticky lg:top-[140px]">

            {!isEditing && product.imageUrls.length > 1 && (
              <div className="hidden md:flex flex-col gap-6 w-28 flex-shrink-0">
                {product.imageUrls.map((url, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)} className={`aspect-square rounded-3xl overflow-hidden border-2 transition-all duration-700 bg-neutral-50 dark:bg-white/5 ${currentImageIndex === i ? 'border-primary-600 shadow-2xl scale-110 p-2' : 'border-transparent opacity-40 grayscale hover:grayscale-0 hover:opacity-100 grayscale hover:scale-105'}`}>
                    <img src={url} className="w-full h-full object-contain" alt="mini" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-grow space-y-8">
              {!isEditing ? (
                <div
                  className="relative aspect-square lg:aspect-[6/7] flex items-center justify-center bg-[#fafafa] dark:bg-white/[0.02] rounded-[4rem] border border-neutral-100 dark:border-white/5 cursor-crosshair overflow-hidden group"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                >
                  <img
                    ref={imgRef}
                    src={product.imageUrls[currentImageIndex]}
                    className={`w-full h-full object-contain p-6 transition-all duration-[1.5s] ease-out ${isZooming ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
                    alt={product.name}
                  />

                  {/* Luxury Zoom Layer */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-[3rem] z-20"
                    style={{ ...zoomStyle, opacity: isZooming ? 1 : 0 }}
                  />

                  {/* Zoom Hint */}
                  <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-white/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-neutral-900 opacity-20 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              ) : (
                /* EDIT MODE IMAGES */
                <div className="grid grid-cols-2 gap-6 pb-20">
                  {formData?.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-[3rem] bg-neutral-50 dark:bg-white/5 p-6 border-2 border-dashed border-neutral-200 dark:border-white/10 flex items-center justify-center group">
                      {url ? (
                        <>
                          <img src={url} className="w-full h-full object-contain" alt="" />
                          <button onClick={() => removeImageField(index)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><Trash2 className="w-5 h-5" /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-400 font-black uppercase text-[10px] tracking-widest"><Camera className="w-10 h-10 mb-2" /> Subir Imagen</div>
                      )}
                      <input type="file" onChange={(e) => handleImageUpload(e, index)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                  ))}
                  <button onClick={addImageField} className="aspect-square rounded-[3rem] border-2 border-dashed border-primary-600/30 flex items-center justify-center text-primary-600 hover:bg-primary-600/5 transition-all"><Plus className="w-12 h-12" /></button>
                </div>
              )}
            </div>
          </div>

          {/* LADO DERECHO: ARQUITECTURA DE INFORMACIÓN (Col 5) */}
          <div className="lg:col-span-5 space-y-12">
            {!isEditing ? (
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-primary-600 text-white text-[9px] font-black uppercase tracking-[0.3em] italic rounded-lg">Alto Rendimiento</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Modelo Serie-S 2024</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-right-10 duration-1000">
                    {product.name}
                  </h1>
                  <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium italic leading-relaxed max-w-lg">
                    {product.description}
                  </p>
                </div>

                <div className="border-y border-neutral-100 dark:border-white/10 py-10 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-2">
                      <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest italic opacity-50">Inversión Final Sugerida</span>
                      <div className="flex items-baseline gap-5">
                        <span className="text-6xl font-black italic tracking-tighter text-neutral-900 dark:text-white leading-none tracking-[-0.05em]">
                          {formatCurrency(hasDiscount ? product.promotionalPrice! : product.price)}
                        </span>
                        {hasDiscount && <span className="text-2xl font-bold text-neutral-400 line-through italic opacity-40">{formatCurrency(product.price)}</span>}
                      </div>
                    </div>
                    {product.availabilityStatus === 'in-stock' ? (
                      <div className="px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest">Despacho Inmediato</span>
                      </div>
                    ) : (
                      <div className="px-5 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest">Producción Bajo Pedido</span>
                      </div>
                    )}
                  </div>

                  {product.availableColors && product.availableColors.length > 0 && (
                    <div className="space-y-6">
                      <label className="text-[11px] font-black uppercase text-neutral-400 tracking-widest italic flex items-center gap-3"><div className="w-8 h-[1px] bg-neutral-300" /> Personalizar Estructura</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {product.availableColors.map(c => (
                          <button key={c} onClick={() => setSelectedColor(c)} className={`py-5 rounded-3xl text-[10px] font-black uppercase transition-all border-2 ${selectedColor === c ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white scale-105 shadow-2xl italic skew-x-[-12deg]' : 'bg-white dark:bg-zinc-900 text-neutral-500 border-neutral-100 dark:border-white/5 hover:border-primary-500/30'}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    <button
                      onClick={() => onAddToCart(product, selectedColor, selectedWeight)}
                      className={`w-full py-8 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-[0.5em] transition-all duration-700 shadow-4xl active:scale-95 group/btn overflow-hidden relative border border-transparent ${isProductInCart ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-900'}`}
                    >
                      <div className="relative z-10 flex items-center justify-center gap-4">
                        {isProductInCart ? <Check size={28} strokeWidth={4} /> : null}
                        <span>{isProductInCart ? 'EN EL CARRITO' : 'AÑADIR AL CARRITO'}</span>
                      </div>

                      {!isProductInCart && (
                        <>
                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />
                        </>
                      )}
                    </button>
                    <p className="text-center mt-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] opacity-40">Asesoría personalizada incluida mediante consultoría técnica</p>
                  </div>

                </div>

                {/* Características Destacadas */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-primary-600"><Plus className="w-6 h-6" /></div>
                    <h4 className="font-black uppercase italic text-xs tracking-widest text-neutral-900 dark:text-white">Garantía Extendida</h4>
                    <p className="text-[10px] font-medium text-neutral-400 italic">5 años en estructura y componentes mecánicos.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-primary-600"><Save className="w-6 h-6" /></div>
                    <h4 className="font-black uppercase italic text-xs tracking-widest text-neutral-900 dark:text-white">Instalación Certificada</h4>
                    <p className="text-[10px] font-medium text-neutral-400 italic">Técnicos expertos aseguran el correcto ensamblado.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* EDIT MODE FORM */
              <div className="bg-neutral-50 dark:bg-white/5 p-12 rounded-[4rem] border border-neutral-100 dark:border-white/5 shadow-inner">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-primary-600 tracking-widest italic px-4">Referencia / Título</label>
                    <input name="name" value={formData?.name} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-900 p-6 rounded-[2rem] font-black uppercase italic tracking-tighter text-3xl border border-neutral-100 dark:border-white/10 text-neutral-950 dark:text-white focus:ring-4 focus:ring-primary-500/20 transition-all outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-neutral-400 tracking-widest italic px-4">Segmento</label>
                      <select name="category" value={formData?.category} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl font-bold border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white outline-none">
                        <option value="Maquinaria" className="bg-white dark:bg-zinc-900">Maquinaria</option>
                        <option value="Accesorios" className="bg-white dark:bg-zinc-900">Accesorios</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-neutral-400 tracking-widest italic px-4">Grupo Muscular</label>
                      <input name="muscleGroup" value={formData?.muscleGroup} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl font-bold border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white focus:ring-primary-500/20 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-neutral-400 tracking-widest italic px-4">Inversión COP</label>
                      <input type="number" name="price" value={formData?.price} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl font-black border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white focus:ring-primary-500/20 outline-none" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-neutral-400 tracking-widest italic px-4">Promo COP</label>
                      <input type="number" name="promotionalPrice" value={formData?.promotionalPrice || 0} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl font-black border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white focus:ring-primary-500/20 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-neutral-400 tracking-widest italic px-4">Descripción Elite</label>
                    <textarea name="description" value={formData?.description} onChange={handleInputChange} rows={5} className="w-full bg-white dark:bg-zinc-900 p-6 rounded-[2rem] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-100 dark:border-white/10 focus:ring-primary-500/20 outline-none" />
                  </div>

                  <div className="flex items-center gap-6 bg-primary-600/5 p-6 rounded-[2rem] border border-primary-600/10">
                    <input type="checkbox" name="isPromotion" checked={formData?.isPromotion} onChange={handleCheckboxChange} className="w-8 h-8 accent-primary-600" id="promocheck" />
                    <label htmlFor="promocheck" className="text-sm font-black uppercase italic text-primary-600 tracking-widest">Activar Sello de Promoción Internacional</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INGENIERÍA Y ESPECIFICACIONES (PANTALLA COMPLETA) */}
        <div className="mt-20 pt-20 border-t border-neutral-100 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-2 bg-primary-600 rounded-full" />
                <h2 className="text-5xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Ficha de<br />Ingeniería</h2>
              </div>
              <p className="text-xl text-neutral-400 font-medium italic leading-relaxed">Detalles técnicos que avalan la superioridad mecánica de SAGFO.</p>

              {isEditing && (
                <div className="bg-neutral-50 dark:bg-white/5 p-10 rounded-[3rem] space-y-8 mt-12">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Nueva Especificación</span>
                  <div className="space-y-4">
                    <input placeholder="Parámetro (Material, Peso...)" value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl text-sm border border-neutral-100 dark:border-white/5 text-neutral-900 dark:text-white outline-none" />
                    <input placeholder="Valor Técnico" value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)} className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl text-sm border border-neutral-100 dark:border-white/5 text-neutral-900 dark:text-white outline-none" />
                    <button onClick={addSpec} className="w-full py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl">Integrar Dato</button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1">
              {Object.entries((isEditing ? formData?.specifications : product.specifications) || {}).map(([key, value]) => (
                <div key={key} className="group relative py-8 border-b border-neutral-100 dark:border-white/5 hover:px-6 transition-all duration-700 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] italic mb-1 block">{key}</span>
                    <p className="text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter group-hover:text-primary-600 transition-colors leading-none">{value}</p>
                  </div>
                  {isEditing && (
                    <button onClick={() => removeSpec(key)} className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all font-black text-[10px]">ELIMINAR</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RELACIONADOS (MÁS COMPACTO Y ELEGANTE) */}
        {!isEditing && relatedProducts.length > 0 && (
          <div className="mt-20 pt-20 border-t border-neutral-100 dark:border-white/10 pb-20">
            <div className="flex flex-col items-center text-center mb-16 space-y-6">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] italic">Catálogo Elite</span>
              <h2 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Explora Más</h2>
              <div className="w-[1px] h-20 bg-gradient-to-b from-primary-600 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(rp => (
                <div key={rp.id} onClick={() => onProductClick?.(rp)} className="group cursor-pointer space-y-6">
                  <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-[#fafafa] dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 p-10 relative flex items-center justify-center transition-all duration-1000 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-4 group-hover:bg-white dark:group-hover:bg-black">
                    <img src={rp.imageUrls[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" alt={rp.name} />
                  </div>
                  <div className="px-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] italic">{rp.category}</span>
                      <div className="h-[1px] flex-grow bg-neutral-200 dark:bg-white/10" />
                    </div>
                    <h4 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[1] group-hover:text-primary-600 transition-colors duration-500">{rp.name}</h4>
                    <p className="text-xl font-black text-neutral-900 dark:text-white italic opacity-80">{formatCurrency(rp.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-neutral-950 py-16 text-center flex flex-col items-center gap-6">
        <div className="w-12 h-[1px] bg-primary-600" />
        <span className="text-white/20 text-[9px] font-black uppercase tracking-[1em] italic">SAGFO ELITE SERIES ® 2024</span>
        <div className="flex gap-6 opacity-30">
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
      </footer>
    </div>
  );
};

export default ProductModal;
