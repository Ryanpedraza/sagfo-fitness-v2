import React, { useState, useEffect, useCallback } from 'react';
import { EquipmentItem, Order, OrderStatus, Event, GalleryImage, Profile, CartItem, PaymentMethod, HeroSlide, BankAccount, OrderStatusHistory, Theme, SortOrder, CategoryFilter, MuscleFilter, DeliveryStatus } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import QuoteCartModal from './components/QuoteCartModal';
import ComparisonBar from './components/ComparisonBar';
import ComparisonModal from './components/ComparisonModal';
import { useAuth } from './hooks/useAuth';
import IntroAnimation from './components/IntroAnimation';
import LoginModal from './components/LoginModal';
import EditHeroModal from './components/EditHeroModal';
import ProductListHeader from './components/ProductListHeader';
import GymBuilderModal from './components/GymBuilderModal';
import MyOrders from './components/MyOrders';
import WhatsAppButton from './components/WhatsAppButton';
import EventsSection from './components/EventsSection';
import GallerySection from './components/GallerySection';
import EventModal from './components/EventModal';
import NotificationToast, { NotificationState } from './components/NotificationToast';
import EditUserModal from './components/EditUserModal';
import EventDetailModal from './components/EventDetailModal';
import TransporterDashboard from './components/TransporterDashboard';
import AdminDashboard from './components/AdminDashboard';

import { supabase } from './lib/supabase';
import { uploadToBlob, deleteFromBlob } from './lib/vercel-blob';


const App: React.FC = () => {
  // Estados
  const [loading, setLoading] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [theme, setTheme] = useState<Theme>('auto');
  const [products, setProducts] = useState<EquipmentItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<EquipmentItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<EquipmentItem[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const [view, setView] = useState<'catalog' | 'orders' | 'dashboard' | 'transporter_dashboard' | 'promos'>('catalog');
  const [isAdminViewInitialized, setIsAdminViewInitialized] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditHeroModalOpen, setIsEditHeroModalOpen] = useState(false);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: 'slide-1',
      titleLine1: 'TU GIMNASIO,',
      titleLine2: 'A TU MEDIDA',
      subtitle: 'Equipamiento de alta calidad para llevar tu entrenamiento al siguiente nivel.',
      imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2400&auto=format&fit=crop'
    }
  ]);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 'ba-1', bankName: 'Bancolombia', accountType: 'Ahorros', accountNumber: '031-123456-78', holderName: 'SAGFO Fitness' },
    { id: 'ba-2', bankName: 'Nequi / Daviplata', accountType: 'Celular', accountNumber: '310 393 6762', holderName: 'John Garcia' }
  ]);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Maquinaria');
  const [muscleFilter, setMuscleFilter] = useState<MuscleFilter>('Todos');
  const [isGymBuilderOpen, setIsGymBuilderOpen] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('573103936762');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [displayByCategory, setDisplayByCategory] = useState(true);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [pendingCartOpen, setPendingCartOpen] = useState(false);
  const [sealUrl, setSealUrl] = useState('');

  const isAdmin = user?.role === 'admin';
  const isTransporter = user?.role === 'transporter';
  const isCustomer = user?.role === 'customer';

  const handleCategoryChange = (category: CategoryFilter) => {
    setCategoryFilter(category);
    setMuscleFilter('Todos');
  };

  const handleOpenEventModal = (event?: Event) => {
    if (!isAdmin) return;
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(undefined);
  };

  const refetchAll = useCallback(async () => {
    const { data: productsData } = await supabase
      .from('equipment')
      .select('*')
      .or('is_deleted.is.null,is_deleted.eq.false');
    if (productsData) {
      const mappedProducts: EquipmentItem[] = productsData.map((p: any) => ({
        ...p,
        muscleGroup: p.muscle_group,
        availabilityStatus: p.availability_status,
        isPromotion: p.is_promotion,
        promotionalPrice: p.promotional_price,
        imageUrls: p.image_urls,
        availableColors: p.available_colors,
        availableWeights: p.available_weights,
      }));
      setProducts(mappedProducts);
    }

    const { data: eventsData } = await supabase.from('events').select('*');
    if (eventsData) {
      const mappedEvents: Event[] = eventsData.map((e: any) => ({
        ...e,
        imageUrl: e.image_url,
      }));
      setEvents(mappedEvents);
    }

    const { data: galleryData } = await supabase.from('gallery').select('*');
    if (galleryData) {
      const mappedGallery: GalleryImage[] = galleryData.map((g: any) => ({
        ...g,
        imageUrl: g.image_url,
      }));
      setGalleryImages(mappedGallery);
    }

    const { data: profilesData } = await supabase.from('users').select('*');
    if (profilesData) setProfiles(profilesData as Profile[]);

    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          equipment:equipment_id (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersData) {
      const mappedOrders: Order[] = ordersData.map((o: any) => ({
        ...o,
        createdAt: o.created_at,
        userId: o.user_id,
        assignedTransporterId: o.assigned_transporter_id,
        paymentMethod: o.payment_method,
        customerInfo: o.customer_info,
        productionDetails: o.production_details,
        paymentProofUrl: o.payment_proof_url,
        statusHistory: o.status_history,
        items: o.items.map((i: any) => ({
          ...i,
          price_at_purchase: i.price_at_purchase,
          selectedColor: i.selected_color,
          selectedWeight: i.selected_weight,
          structureColor: i.structure_color,
          upholsteryColor: i.upholstery_color,
          deliveryStatus: i.delivery_status,
          equipment: i.equipment
        }))
      }));
      setOrders(mappedOrders);
      setOrders(mappedOrders);
    }

    const { data: configData } = await supabase.from('site_config').select('*').single();
    if (configData) {
      if (configData.seal_url) setSealUrl(configData.seal_url);
      if (configData.whatsapp_number) setWhatsAppNumber(configData.whatsapp_number);
      if (configData.hero_slides) {
        // Ensure hero_slides is an array
        const slides = Array.isArray(configData.hero_slides) ? configData.hero_slides : [];
        if (slides.length > 0) setHeroSlides(slides);
      }
    }
  }, []);

  useEffect(() => {
    refetchAll();
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    const savedBankAccounts = localStorage.getItem('bankAccounts');
    if (savedBankAccounts) setBankAccounts(JSON.parse(savedBankAccounts));
    const savedSeal = localStorage.getItem('sealUrl');
    if (savedSeal) setSealUrl(savedSeal);
    const savedHero = localStorage.getItem('heroData');
    if (savedHero) {
      const parsed = JSON.parse(savedHero);
      if (Array.isArray(parsed)) {
        setHeroSlides(parsed);
      } else if (typeof parsed === 'object' && parsed !== null) {
        setHeroSlides([{
          id: 'default-slide',
          titleLine1: parsed.titleLine1 || 'TU GIMNASIO,',
          titleLine2: parsed.titleLine2 || 'A TU MEDIDA',
          subtitle: parsed.subtitle || '',
          imageUrl: parsed.imageUrl || ''
        }]);
      }
    }
    const savedWhatsApp = localStorage.getItem('whatsAppNumber');
    if (savedWhatsApp) setWhatsAppNumber(savedWhatsApp);
    const savedDisplay = localStorage.getItem('displayByCategory');
    setDisplayByCategory(savedDisplay ? JSON.parse(savedDisplay) : true);
  }, [refetchAll]);

  useEffect(() => {
    if (user) {
      if (pendingCartOpen) {
        setIsCartOpen(true);
        setPendingCartOpen(false);
      }
      if (isAdmin && !isAdminViewInitialized) {
        setView('dashboard');
        setIsAdminViewInitialized(true);
        window.scrollTo(0, 0);
      } else if (isTransporter) {
        setView('transporter_dashboard');
        window.scrollTo(0, 0);
      } else if (isCustomer) {
        setView('orders');
        window.scrollTo(0, 0);
      }
    } else {
      setView('catalog');
      setIsAdminViewInitialized(false);
    }
  }, [user, isAdmin, isCustomer, isTransporter, isAdminViewInitialized, pendingCartOpen]);

  useEffect(() => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem('displayByCategory', JSON.stringify(displayByCategory));
  }, [displayByCategory]);

  const handleSaveHero = async (slides: HeroSlide[]) => {
    if (!isAdmin) return;
    setHeroSlides(slides);

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: 'config',
          hero_slides: slides
        });

      if (error) throw error;
      setNotification({ id: Date.now(), type: 'success', message: 'Banners actualizados correctamente.' });
    } catch (error) {
      console.error('Error saving hero slides:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al guardar banners en la base de datos.' });
    }
  };

  const handleUpdateWhatsAppNumber = async (newNumber: string) => {
    if (!isAdmin) return;
    setWhatsAppNumber(newNumber);

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: 'config',
          whatsapp_number: newNumber
        });

      if (error) throw error;
      setNotification({ id: Date.now(), type: 'success', message: 'Número de WhatsApp actualizado.' });
    } catch (error) {
      console.error('Error saving whatsapp number:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al guardar número de WhatsApp.' });
    }
  }

  const handleProductClick = (product: EquipmentItem) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: EquipmentItem) => {
    if (!isAdmin) return;
    setSelectedProduct(product);
    setIsEditingProduct(true);
    setIsProductModalOpen(true);
  };

  const handleOpenCreateProductModal = () => {
    if (!isAdmin) return;
    const newProductTemplate: EquipmentItem = {
      id: '',
      name: '',
      category: 'Maquinaria',
      availabilityStatus: 'made-to-order',
      description: '',
      price: 0,
      imageUrls: [],
      features: [''],
      specifications: {},
      availableColors: [],
      availableWeights: [],
      isPromotion: false,
      promotionalPrice: 0
    };
    setSelectedProduct(newProductTemplate);
    setIsEditingProduct(false);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (product: EquipmentItem, newImagesMap?: Record<string, File>) => {
    if (!isAdmin) return;

    try {
      // 1. Handle Image Uploads - USANDO VERCEL BLOB
      let finalImageUrls = [...product.imageUrls];

      if (newImagesMap && Object.keys(newImagesMap).length > 0) {
        console.log('📤 Procesando nuevas imágenes con Vercel Blob...');
        const uploadPromises = finalImageUrls.map(async (url) => {
          if (newImagesMap[url]) {
            const file = newImagesMap[url];
            console.log(`📤 Subiendo imagen a Vercel Blob: ${file.name}`);

            // Subir a Vercel Blob en lugar de Supabase Storage
            const blobUrl = await uploadToBlob(file, 'products');

            console.log(`✅ Imagen subida a Vercel Blob: ${blobUrl}`);
            return blobUrl;
          }
          return url;
        });

        finalImageUrls = await Promise.all(uploadPromises);
      }

      const cleanedProduct = {
        ...product,
        imageUrls: finalImageUrls,
        price: Number(product.price),
        promotionalPrice: product.promotionalPrice ? Number(product.promotionalPrice) : undefined
      };

      if (isEditingProduct && selectedProduct?.id) {
        const { error } = await supabase
          .from('equipment')
          .update({
            name: cleanedProduct.name,
            category: cleanedProduct.category,
            muscle_group: cleanedProduct.muscleGroup,
            availability_status: cleanedProduct.availabilityStatus,
            description: cleanedProduct.description,
            price: cleanedProduct.price,
            image_urls: cleanedProduct.imageUrls,
            features: cleanedProduct.features,
            specifications: cleanedProduct.specifications,
            available_colors: cleanedProduct.availableColors,
            available_weights: cleanedProduct.availableWeights,
            is_promotion: cleanedProduct.isPromotion,
            promotional_price: cleanedProduct.promotionalPrice
          })
          .eq('id', selectedProduct.id);

        if (error) throw error;

        setProducts(products.map(p => p.id === selectedProduct.id ? cleanedProduct : p));
        setNotification({ id: Date.now(), type: 'success', message: 'Producto actualizado exitosamente.' });
      } else {
        const newId = `prod-${Date.now()}`;
        const newProduct = { ...cleanedProduct, id: newId };

        const { error } = await supabase
          .from('equipment')
          .insert({
            id: newId,
            name: cleanedProduct.name,
            category: cleanedProduct.category,
            muscle_group: cleanedProduct.muscleGroup,
            availability_status: cleanedProduct.availabilityStatus,
            description: cleanedProduct.description,
            price: cleanedProduct.price,
            image_urls: cleanedProduct.imageUrls,
            features: cleanedProduct.features,
            specifications: cleanedProduct.specifications,
            available_colors: cleanedProduct.availableColors,
            available_weights: cleanedProduct.availableWeights,
            is_promotion: cleanedProduct.isPromotion,
            promotional_price: cleanedProduct.promotionalPrice
          });

        if (error) throw error;
        setProducts([newProduct, ...products]);
        setNotification({ id: Date.now(), type: 'success', message: 'Producto creado exitosamente.' });
      }
      setIsProductModalOpen(false);
      setIsEditingProduct(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al guardar el producto.' });
    }
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setIsEditingProduct(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('equipment')
        .update({ is_deleted: true })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      setNotification({ id: Date.now(), type: 'success', message: 'Producto eliminado correctamente.' });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al eliminar el producto.' });
    }
  };

  const handleAddToCart = (product: EquipmentItem, color?: string, weight?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item =>
        item.equipment.id === product.id &&
        item.selectedColor === color &&
        item.selectedWeight === weight
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item.equipment.id === product.id && item.selectedColor === color && item.selectedWeight === weight)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { equipment: product, quantity: 1, selectedColor: color, selectedWeight: weight }];
    });
    setNotification({ id: Date.now(), type: 'success', message: 'Producto añadido al carrito.' });
  };

  const handleUpdateCartItemCustomization = (productId: string, field: 'structureColor' | 'upholsteryColor', value: string) => {
    setCartItems(prev => prev.map(item =>
      (item.equipment.id === productId && !item.selectedColor)
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.equipment.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => item.equipment.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const handleAddPackageToCart = (items: CartItem[]) => {
    let newCartItems = [...cartItems];
    items.forEach(itemToAdd => {
      const existingItemIndex = newCartItems.findIndex(item => item.equipment.id === itemToAdd.equipment.id && item.selectedColor === itemToAdd.selectedColor && item.selectedWeight === itemToAdd.selectedWeight);
      if (existingItemIndex > -1) {
        newCartItems[existingItemIndex].quantity += itemToAdd.quantity;
      } else {
        newCartItems.push(itemToAdd);
      }
    });
    setCartItems(newCartItems);
    setIsGymBuilderOpen(false);
    setIsCartOpen(true);
  };

  const handleSubmitOrder = async (
    customerInfo: { name: string; email: string; phone: string; message: string; city: string; department: string; mapsLink?: string; address?: string },
    paymentMethod: PaymentMethod,
    financials: { totalOrderValue: number; amountPaid: number; amountPending: number },
    productionDetails?: { structureColor: string; upholsteryColor: string },
    paymentProofFile?: File
  ) => {
    if (cartItems.length === 0) return;

    let paymentProofUrl = undefined;
    if (paymentProofFile) {
      try {
        console.log('📤 Subiendo comprobante de pago a Vercel Blob...');
        paymentProofUrl = await uploadToBlob(paymentProofFile, 'orders');
        console.log('✅ Comprobante subido:', paymentProofUrl);
      } catch (error) {
        console.error('Error uploading payment proof:', error);
        setNotification({ id: Date.now(), type: 'error', message: 'Error al subir comprobante. Intenta de nuevo.' });
        return;
      }
    }

    const orderId = `ord-${Date.now()}`;

    if (!user) {
      setNotification({ id: Date.now(), type: 'error', message: 'Debes iniciar sesión para realizar un pedido.' });
      setIsLoginModalOpen(true);
      return;
    }

    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      status: 'Pendiente de Aprobación',
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      customerInfo,
      productionDetails,
      paymentProofUrl,
      financials,
      statusHistory: [],
      items: cartItems.map(item => ({
        equipment: item.equipment,
        quantity: item.quantity,
        price_at_purchase: item.equipment.isPromotion ? (item.equipment.promotionalPrice || item.equipment.price) : item.equipment.price,
        selectedColor: item.selectedColor,
        selectedWeight: item.selectedWeight,
        structureColor: item.structureColor,
        upholsteryColor: item.upholsteryColor,
        deliveryStatus: 'pending'
      }))
    };

    try {
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrder.id,
          user_id: newOrder.userId,
          status: newOrder.status,
          payment_method: newOrder.paymentMethod,
          customer_info: newOrder.customerInfo,
          production_details: newOrder.productionDetails,
          payment_proof_url: newOrder.paymentProofUrl,
          financials: newOrder.financials,
          status_history: newOrder.statusHistory
        });

      if (orderError) throw orderError;

      const orderItemsData = newOrder.items.map(item => ({
        order_id: newOrder.id,
        equipment_id: item.equipment.id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        selected_color: item.selectedColor,
        selected_weight: item.selectedWeight,
        structure_color: item.structureColor,
        upholstery_color: item.upholsteryColor,
        delivery_status: item.deliveryStatus
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      setOrders([newOrder, ...orders]);
      setIsCartOpen(false);
      setCartItems([]);

      if (!isAdmin && !isTransporter) {
        setView('orders');
      }

      setNotification({
        id: Date.now(),
        type: 'success',
        message: "¡Pedido realizado! Ve a 'Mis Pedidos' para ver el estado.",
        onAction: () => navigateToView(isAdmin ? 'dashboard' : 'orders'),
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al crear el pedido.' });
    }
  };

  const handleAdminViewToggle = () => {
    if (!isAdmin) return;
    if (view === 'dashboard') navigateToView('catalog');
    else navigateToView('dashboard');
  };

  const navigateToView = (targetView: 'catalog' | 'orders' | 'dashboard' | 'transporter_dashboard' | 'promos') => {
    if (targetView === 'orders' && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (targetView === 'dashboard' && !isAdmin) {
      return;
    }
    if (targetView === 'transporter_dashboard' && !isTransporter) {
      return;
    }
    setView(targetView);
    window.scrollTo(0, 0);
  };

  const handleAddGalleryImage = async (file: File, caption: string) => {
    if (!isAdmin) return;

    const newId = `gal-${Date.now()}`;

    try {
      console.log('📤 Subiendo imagen de galería a Vercel Blob...');

      // Subir a Vercel Blob en lugar de Supabase Storage
      const blobUrl = await uploadToBlob(file, 'gallery');

      console.log('✅ Imagen subida a Vercel Blob:', blobUrl);

      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          id: newId,
          image_url: blobUrl,
          caption: caption
        });

      if (dbError) {
        console.error('Error saving to database:', dbError);
        // Intentar borrar la imagen de Vercel Blob si falla la DB
        await deleteFromBlob(blobUrl);
        throw dbError;
      }

      // Refetch gallery to ensure consistency
      console.log('Recargando galería desde la base de datos...');
      const { data: galleryData } = await supabase.from('gallery').select('*');
      if (galleryData) {
        const mappedGallery: GalleryImage[] = galleryData.map((g: any) => ({
          ...g,
          imageUrl: g.image_url,
        }));
        setGalleryImages(mappedGallery);
      }

      setNotification({ id: Date.now(), type: 'success', message: 'Imagen añadida a la galería.' });
    } catch (error: any) {
      console.error('Error adding gallery image:', error);
      setNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Error al guardar imagen.'
      });
    }
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    console.log('Intentando borrar imagen con ID:', imageId);
    if (!isAdmin) {
      console.log('No es admin, cancelando borrado.');
      return;
    }

    try {
      const imageToDelete = galleryImages.find(img => img.id === imageId);

      if (!imageToDelete) {
        console.error('Imagen no encontrada en el estado local. IDs disponibles:', galleryImages.map(img => img.id));
        throw new Error('No se pudo encontrar la información de la imagen para borrarla.');
      }

      console.log('Imagen encontrada:', imageToDelete);

      // 1. Borrar de la base de datos primero
      console.log('Borrando registro de la base de datos...');
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        console.error('Error de Supabase al borrar registro:', dbError);
        throw dbError;
      }
      console.log('Registro borrado de la base de datos.');

      // 2. Borrar de Vercel Blob (si es una URL de Blob)
      if (imageToDelete.imageUrl) {
        console.log('🗑️ Intentando borrar archivo de Vercel Blob...');
        await deleteFromBlob(imageToDelete.imageUrl);
      }

      // 3. Actualizar estado local
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      setNotification({ id: Date.now(), type: 'success', message: 'Imagen eliminada correctamente.' });

    } catch (error: any) {
      console.error('Error crítico en handleDeleteGalleryImage:', error);
      setNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Error al eliminar la imagen.'
      });
    }
  };

  const handleAddBankAccount = (account: BankAccount) => {
    if (!isAdmin) return;
    setBankAccounts([...bankAccounts, account]);
    setNotification({ id: Date.now(), type: 'success', message: 'Cuenta bancaria añadida.' });
  };

  const handleDeleteBankAccount = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('¿Estás seguro de eliminar esta cuenta bancaria?')) {
      setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
      setNotification({ id: Date.now(), type: 'success', message: 'Cuenta bancaria eliminada.' });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    if (!isAdmin && !isTransporter) return;
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newHistoryItem: OrderStatusHistory = {
          status,
          note,
          date: new Date().toISOString(),
          updatedBy: user?.name
        };
        return {
          ...o,
          status,
          statusHistory: [newHistoryItem, ...(o.statusHistory || [])]
        };
      }
      return o;
    }));

    if (note) {
      setNotification({ id: Date.now(), type: 'success', message: 'Estado actualizado y mensaje enviado.' });
    } else {
      setNotification({ id: Date.now(), type: 'success', message: 'Estado del pedido actualizado.' });
    }
  };

  const handleUpdateItemStatus = (orderId: string, itemIndex: number, status: DeliveryStatus) => {
    if (!isAdmin && !isTransporter) return;
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const newItems = [...order.items];
        const currentItem = newItems[itemIndex];
        newItems[itemIndex] = {
          ...currentItem,
          deliveryStatus: status
        };
        return { ...order, items: newItems };
      }
      return order;
    }));

    let message = 'Estado del item actualizado.';
    if (status === 'shipped') message = 'Item despachado al transportador.';
    if (status === 'delivered') message = 'Item entregado exitosamente.';

    setNotification({ id: Date.now(), type: 'success', message });
  };

  const handleAssignTransporter = (orderId: string, transporterId: string) => {
    if (!isAdmin) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedTransporterId: transporterId } : o));
    setNotification({ id: Date.now(), type: 'success', message: 'Transportador asignado correctamente.' });
  };

  const handleToggleCompare = (product: EquipmentItem) => {
    setComparisonList(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length < 2) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const handleLoginClickFromCart = () => {
    setPendingCartOpen(true);
    setIsCartOpen(false);
    setIsLoginModalOpen(true);
  };

  const sortedAndSearchedProducts = [...products]
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

  const machinery = sortedAndSearchedProducts.filter(p => {
    if (p.category !== 'Maquinaria') return false;
    if (muscleFilter !== 'Todos' && p.muscleGroup !== muscleFilter) return false;
    return true;
  });

  const accessories = sortedAndSearchedProducts.filter(p => {
    if (p.category !== 'Accesorios') return false;
    if (muscleFilter !== 'Todos' && p.muscleGroup !== muscleFilter) return false;
    return true;
  });

  const promoProducts = sortedAndSearchedProducts.filter(p =>
    p.isPromotion &&
    p.promotionalPrice &&
    p.promotionalPrice > 0 &&
    p.promotionalPrice < p.price
  );
  const cartTotalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const userOrders = user ? orders.filter(order => order.userId === user.id) : [];

  const handleOpenUserModal = (userToEdit: Profile | null) => {
    if (!isAdmin) return;
    setEditingUser(userToEdit);
    setIsEditUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsEditUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (updatedUser: Profile) => {
    if (!isAdmin) return;

    const exists = profiles.some(p => p.id === updatedUser.id);
    let newProfiles;

    try {
      if (exists) {
        const { error } = await supabase
          .from('users')
          .update({
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            department: updatedUser.department,
            password: updatedUser.password
          })
          .eq('id', updatedUser.id);

        if (error) throw error;

        newProfiles = profiles.map(p => p.id === updatedUser.id ? updatedUser : p);
        if (user?.id === updatedUser.id) {
          updateUser(updatedUser);
        }
        setNotification({ id: Date.now(), type: 'success', message: 'Usuario actualizado con éxito.' });
      } else {
        const newId = `user-${Date.now()}`;
        const newUser = { ...updatedUser, id: newId };

        const { error } = await supabase
          .from('users')
          .insert({
            id: newId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address,
            city: newUser.city,
            department: newUser.department,
            password: newUser.password
          });

        if (error) throw error;

        newProfiles = [...profiles, newUser];
        setNotification({ id: Date.now(), type: 'success', message: 'Usuario creado con éxito.' });
      }

      setProfiles(newProfiles);
      localStorage.setItem('sagfo_profiles', JSON.stringify(newProfiles));

      handleCloseUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al guardar usuario.' });
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!isAdmin) return;

    try {
      console.log('Intentando borrar usuario:', profileId);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('Error Supabase borrar usuario:', error);
        throw error;
      }

      const newProfiles = profiles.filter(p => p.id !== profileId);
      setProfiles(newProfiles);
      localStorage.setItem('sagfo_profiles', JSON.stringify(newProfiles));
      setNotification({ id: Date.now(), type: 'success', message: 'Usuario eliminado.' });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setNotification({ id: Date.now(), type: 'error', message: error.message || 'Error al eliminar usuario.' });
    }
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
  };

  const handleSaveEvent = async (event: Event, imageFile?: File) => {
    if (!isAdmin) return;

    try {
      let finalImageUrl = event.imageUrl;

      if (imageFile) {
        console.log(`📤 Subiendo imagen de evento a Vercel Blob: ${imageFile.name}`);

        // Subir a Vercel Blob en lugar de Supabase Storage
        finalImageUrl = await uploadToBlob(imageFile, 'events');

        console.log(`✅ Imagen de evento subida a Vercel Blob: ${finalImageUrl}`);
      }

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            title: event.title,
            date: event.date,
            location: event.location,
            description: event.description,
            image_url: finalImageUrl
          })
          .eq('id', editingEvent.id);

        if (error) throw error;

        setEvents(events.map(e => e.id === editingEvent.id ? { ...event, imageUrl: finalImageUrl, id: editingEvent.id } : e));
        setNotification({ id: Date.now(), type: 'success', message: 'Evento actualizado con éxito.' });
      } else {
        const newId = `evt-${Date.now()}`;
        const newEvent = { ...event, imageUrl: finalImageUrl, id: newId };

        const { error } = await supabase
          .from('events')
          .insert({
            id: newId,
            title: newEvent.title,
            date: newEvent.date,
            location: newEvent.location,
            description: newEvent.description,
            image_url: newEvent.imageUrl
          });

        if (error) throw error;

        setEvents([...events, newEvent]);
        setNotification({ id: Date.now(), type: 'success', message: 'Evento creado con éxito.' });
      }
      handleCloseEventModal();
    } catch (error) {
      console.error('Error saving event:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al guardar el evento.' });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!isAdmin) return;

    try {
      console.log('Intentando borrar evento:', eventId);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error Supabase borrar evento:', error);
        throw error;
      }

      setEvents(events.filter(e => e.id !== eventId));
      setNotification({ id: Date.now(), type: 'success', message: 'Evento eliminado.' });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      setNotification({ id: Date.now(), type: 'error', message: error.message || 'Error al eliminar evento.' });
    }
  };

  const handleSetDisplayByCategory = (value: boolean) => {
    if (!isAdmin) return;
    setDisplayByCategory(value);
    setNotification({ id: Date.now(), type: 'success', message: 'Vista del catálogo actualizada.' });
  };

  const handleUpdateSeal = async (url: string) => {
    if (!isAdmin) return;
    setSealUrl(url);

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: 'config',
          seal_url: url
        });

      if (error) throw error;
      setNotification({ id: Date.now(), type: 'success', message: 'Sello del footer actualizado.' });
    } catch (error) {
      console.error('Error saving seal:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al actualizar el sello en la base de datos.' });
    }
  };

  const handleUploadSeal = async (file: File) => {
    if (!isAdmin) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `seal-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      handleUpdateSeal(publicUrl);
    } catch (error: any) {
      console.error('Error uploading seal:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al subir el sello.' });
    }
  };

  return (
    <>
      {loading && <IntroAnimation onComplete={() => setLoading(false)} onStartExit={() => setAppVisible(true)} />}
      <div style={{ opacity: (appVisible || !loading) ? 1 : 0 }}>
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
        <Header
          cartCount={cartTotalQuantity}
          onCartClick={() => setIsCartOpen(true)}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onGymBuilderClick={() => setIsGymBuilderOpen(true)}
          onNavigate={navigateToView}
          onAdminViewToggle={handleAdminViewToggle}
          adminView={view === 'dashboard' ? 'dashboard' : 'site'}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />
        <main>
          {view === 'catalog' && (
            <>
              <Hero
                onCartClick={() => setIsCartOpen(true)}
                slides={heroSlides}
                isAdmin={isAdmin}
                onEdit={() => { if (isAdmin) setIsEditHeroModalOpen(true); }}
                onPromosClick={() => navigateToView('promos')}
              />
              <div id="catalog" className="w-full px-1 md:px-4 py-8">
                <div className="w-full bg-white dark:bg-[#111] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-neutral-200/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.35)] overflow-hidden p-4 sm:p-8 md:p-12 border border-neutral-200 dark:border-white/5 relative">
                  <ProductListHeader
                    sortOrder={sortOrder}
                    onSortChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={handleCategoryChange}
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    muscleFilter={muscleFilter}
                    onMuscleFilterChange={(muscle) => setMuscleFilter(muscle)}
                  />

                  {categoryFilter === 'Maquinaria' && (
                    <>
                      {machinery.length > 0 ? (
                        <ProductGrid
                          products={machinery}
                          onProductClick={handleProductClick}
                          onToggleCompare={handleToggleCompare}
                          comparisonList={comparisonList}
                          isAdmin={isAdmin}
                          onEditProduct={handleEditProduct}
                        />
                      ) : (
                        <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800 rounded-3xl mt-6">
                          <h2 className="text-2xl font-bold text-neutral-400">No hay maquinaria disponible.</h2>
                          <p className="mt-2 text-neutral-500">Vuelve pronto para ver nuestros productos.</p>
                        </div>
                      )}
                    </>
                  )}

                  {categoryFilter === 'Accesorios' && (
                    <>
                      {accessories.length > 0 ? (
                        <ProductGrid
                          products={accessories}
                          onProductClick={handleProductClick}
                          onToggleCompare={handleToggleCompare}
                          comparisonList={comparisonList}
                          isAdmin={isAdmin}
                          onEditProduct={handleEditProduct}
                        />
                      ) : (
                        <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800 rounded-3xl mt-6">
                          <h2 className="text-2xl font-bold text-neutral-400">No hay accesorios disponibles.</h2>
                          <p className="mt-2 text-neutral-500">Vuelve pronto para ver nuestros productos.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <EventsSection
                events={events}
                onEventClick={handleViewEvent}
                isAdmin={isAdmin}
                onEditEvent={handleOpenEventModal}
                onDeleteEvent={handleDeleteEvent}
              />
              <GallerySection images={galleryImages} isAdmin={isAdmin} onAddImage={handleAddGalleryImage} onDeleteImage={handleDeleteGalleryImage} />
            </>
          )}

          {view === 'promos' && (
            <>
              <div className="w-full px-1 md:px-4 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-8">
                    <button
                      onClick={() => navigateToView('catalog')}
                      className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Volver al Catálogo
                    </button>
                  </div>
                  <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Promociones Especiales</h1>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8">Aprovecha nuestras ofertas exclusivas</p>

                  {promoProducts.length > 0 ? (
                    <ProductGrid
                      products={promoProducts}
                      onProductClick={handleProductClick}
                      onToggleCompare={handleToggleCompare}
                      comparisonList={comparisonList}
                      isAdmin={isAdmin}
                      onEditProduct={handleEditProduct}
                    />
                  ) : (
                    <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800 rounded-3xl">
                      <h2 className="text-2xl font-bold text-neutral-400">No hay promociones activas por el momento.</h2>
                      <p className="mt-2 text-neutral-500">¡Vuelve pronto para ver nuestras ofertas!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {view === 'dashboard' && isAdmin && (
            <AdminDashboard
              products={products}
              orders={orders}
              events={events}
              galleryImages={galleryImages}
              profiles={profiles}
              onEditProduct={handleEditProduct}
              onOpenCreateProductModal={handleOpenCreateProductModal}
              onEditHero={() => setIsEditHeroModalOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              whatsAppNumber={whatsAppNumber}
              onUpdateWhatsAppNumber={handleUpdateWhatsAppNumber}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              onOpenEventModal={handleOpenEventModal}
              onAddGalleryImage={handleAddGalleryImage}
              onDeleteGalleryImage={handleDeleteGalleryImage}
              onOpenUserModal={handleOpenUserModal}
              onDeleteProfile={handleDeleteProfile}
              displayByCategory={displayByCategory}
              onSetDisplayByCategory={handleSetDisplayByCategory}
              bankAccounts={bankAccounts}
              onAddBankAccount={handleAddBankAccount}
              onDeleteBankAccount={handleDeleteBankAccount}
              sealUrl={sealUrl}
              onUpdateSeal={handleUpdateSeal}
              onUploadSeal={handleUploadSeal}
              onUpdateItemStatus={handleUpdateItemStatus}
              onAssignTransporter={handleAssignTransporter}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {view === 'transporter_dashboard' && isTransporter && (
            <TransporterDashboard
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateItemStatus={handleUpdateItemStatus}
              currentUserId={user?.id}
            />
          )}

          {view === 'orders' && user && <MyOrders orders={userOrders} onBackToCatalog={() => navigateToView('catalog')} />}
        </main>
        <Footer sealUrl={sealUrl} />
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <WhatsAppButton phoneNumber={whatsAppNumber} />

        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={handleCloseProductModal}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          isEditing={isEditingProduct || (selectedProduct !== null && !selectedProduct.id)}
          onSave={handleSaveProduct}
        />
        <QuoteCartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onSubmit={handleSubmitOrder}
          onLoginClick={handleLoginClickFromCart}
          onUpdateItemCustomization={handleUpdateCartItemCustomization}
          bankAccounts={bankAccounts}
        />
        <ComparisonBar
          items={comparisonList}
          onCompare={() => setIsComparisonModalOpen(true)}
          onClear={() => setComparisonList([])}
        />
        <ComparisonModal
          items={comparisonList}
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
        />
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        <EditHeroModal
          isOpen={isEditHeroModalOpen}
          onClose={() => setIsEditHeroModalOpen(false)}
          slides={heroSlides}
          onSave={handleSaveHero}
        />
        <GymBuilderModal
          isOpen={isGymBuilderOpen}
          onClose={() => setIsGymBuilderOpen(false)}
          allProducts={products}
          onAddPackageToCart={handleAddPackageToCart}
        />
        <EventModal
          isOpen={isEventModalOpen}
          onClose={handleCloseEventModal}
          onSave={handleSaveEvent}
          event={editingEvent}
        />
        <EditUserModal
          isOpen={isEditUserModalOpen}
          onClose={handleCloseUserModal}
          onSave={handleSaveUser}
          user={editingUser}
        />
        <EventDetailModal
          isOpen={!!viewingEvent}
          onClose={() => setViewingEvent(null)}
          event={viewingEvent}
        />
      </div>
    </>
  );
};

export default App;
