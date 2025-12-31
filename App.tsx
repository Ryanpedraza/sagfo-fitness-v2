import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useCart } from './hooks/useCart';
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
import QuickCategoryNav from './components/QuickCategoryNav';
import TestimonialsSection from './components/TestimonialsSection';
import NotificationToast, { NotificationState } from './components/NotificationToast';
import EditUserModal from './components/EditUserModal';
import EventDetailModal from './components/EventDetailModal';
import AdminDashboard from './components/AdminDashboard';


import { supabase } from './lib/supabase';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import { uploadToBlob, deleteFromBlob } from './lib/vercel-blob';


const App: React.FC = () => {
  // Aplicar transición de modo oscuro globalmente
  useEffect(() => {
    document.documentElement.classList.add('dark-mode-transition');
  }, []);

  // Estados
  const [loading, setLoading] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [theme, setTheme] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Lógica de Resolución de Tema
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(isDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme as 'light' | 'dark');
      }
    };

    applyTheme();

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const [products, setProducts] = useState<EquipmentItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Galería derivada de los productos para evitar duplicidad de datos
  // Galería derivada de los productos con Memoización para Estabilidad
  const galleryImages: GalleryImage[] = useMemo(() => {
    return products
      .filter(p => p.category === 'Maquinaria')
      .flatMap((p) =>
        p.imageUrls.filter(url => url && url.startsWith('http')).map((url, iIdx) => ({
          id: `gallery-${p.id}-${iIdx}`,
          imageUrl: url,
          caption: p.name
        }))
      );
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState<EquipmentItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleUpdateCartItemCustomization,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleAddPackageToCart,
    clearCart
  } = useCart();
  const [comparisonList, setComparisonList] = useState<EquipmentItem[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const { user, updateUser, logout } = useAuth();
  const [view, setView] = useState<'catalog' | 'orders' | 'dashboard' | 'promos'>('catalog');
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
  const [loginModalInitialView, setLoginModalInitialView] = useState<'login' | 'register'>('login');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;


  const [configId, setConfigId] = useState<string | number>('config');

  const isAdmin = user?.role === 'admin';
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
        price: Number(p.price) || 0,
        imageUrls: p.image_urls || [],
        availableColors: p.available_colors || [],
        availableWeights: p.available_weights || [],
        isPromotion: !!p.is_promotion,
        promotionalPrice: p.promotional_price ? Number(p.promotional_price) : undefined,
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
          equipment: i.equipment ? {
            ...i.equipment,
            availabilityStatus: i.equipment.availability_status,
            imageUrls: i.equipment.image_urls || [],
            muscleGroup: i.equipment.muscle_group
          } : null
        }))
      }));
      setOrders(mappedOrders);
    }

    const { data: configData } = await supabase.from('site_config').select('*').single();
    if (configData) {
      if (configData.id) setConfigId(configData.id);
      if (configData.seal_url) setSealUrl(configData.seal_url);
      if (configData.whatsapp_number) setWhatsAppNumber(configData.whatsapp_number);
      if (configData.hero_slides) {
        // Ensure hero_slides is an array
        const slides = Array.isArray(configData.hero_slides) ? configData.hero_slides : [];
        if (slides.length > 0) setHeroSlides(slides);
      }
      if (configData.bank_accounts) {
        const accounts = Array.isArray(configData.bank_accounts) ? configData.bank_accounts : [];
        if (accounts.length > 0) setBankAccounts(accounts);
      }
    }
  }, []);

  useEffect(() => {
    refetchAll();
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    // El carrito se carga ahora desde useCart
    // El carrito se carga ahora desde useCart
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
      } else if (isCustomer) {
        setView('orders');
        window.scrollTo(0, 0);
      }
    } else {
      setView('catalog');
      setIsAdminViewInitialized(false);
    }
  }, [user, isAdmin, isCustomer, isAdminViewInitialized, pendingCartOpen]);

  useEffect(() => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // La persistencia del carrito ahora se maneja en useCart


  useEffect(() => {
    localStorage.setItem('displayByCategory', JSON.stringify(displayByCategory));
  }, [displayByCategory]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    // Scroll to top of catalog when filter changes
    // const catalogEl = document.getElementById('catalog');
    // if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  }, [categoryFilter, muscleFilter, searchTerm, sortOrder]);

  const handleSaveHero = async (slides: HeroSlide[], newFilesMap?: Record<string, File>) => {
    if (!isAdmin) return;

    try {
      let finalSlides = [...slides];

      if (newFilesMap && Object.keys(newFilesMap).length > 0) {
        console.log('📤 Subiendo nuevas imágenes de banner a Vercel Blob...');
        const uploadPromises = finalSlides.map(async (slide) => {
          if (newFilesMap[slide.imageUrl]) {
            const file = newFilesMap[slide.imageUrl];
            const blobUrl = await uploadToBlob(file, 'banners');
            return { ...slide, imageUrl: blobUrl };
          }
          return slide;
        });
        finalSlides = await Promise.all(uploadPromises);
      }

      setHeroSlides(finalSlides);

      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: configId,
          hero_slides: finalSlides
        });

      if (error) {
        console.error('❌ Error de Supabase al guardar banners:', error);
        throw error;
      }

      setNotification({ id: Date.now(), type: 'success', message: 'Banners sincronizados al 100%.' });
    } catch (error) {
      console.error('❌ Error fatal en el proceso de guardado de banners:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error crítico al procesar imágenes. Revisa la consola.' });
    }
  };

  const handleUpdateWhatsAppNumber = async (newNumber: string) => {
    if (!isAdmin) return;
    setWhatsAppNumber(newNumber);

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: configId,
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

      // 2. Sanitize and Prepare Payload
      const price = Number(product.price);
      const isPromotion = Boolean(product.isPromotion);
      // If promotion is active, ensure we have a price. If not active, or price is missing/0, set to null.
      const promotionalPrice = (isPromotion && product.promotionalPrice)
        ? Number(product.promotionalPrice)
        : null;

      const cleanedProduct = {
        ...product,
        imageUrls: finalImageUrls.filter(url => url && url.trim() !== ''), // Filter empty URLs
        price: price,
        promotionalPrice: promotionalPrice
      };

      // Payload object for Supabase (explicit mapping)
      const payload = {
        name: cleanedProduct.name,
        category: cleanedProduct.category,
        muscle_group: cleanedProduct.muscleGroup,
        availability_status: cleanedProduct.availabilityStatus,
        description: cleanedProduct.description,
        price: cleanedProduct.price,
        image_urls: cleanedProduct.imageUrls,
        features: (cleanedProduct.features || []).filter(f => f && f.trim() !== ''), // Filter empty features
        specifications: cleanedProduct.specifications || {},
        available_colors: cleanedProduct.availableColors || [],
        available_weights: cleanedProduct.availableWeights || [],
        is_promotion: cleanedProduct.isPromotion,
        promotional_price: cleanedProduct.promotionalPrice
      };

      console.log('📦 Payload enviado a Supabase:', payload);

      if (isEditingProduct && selectedProduct?.id) {
        const { error } = await supabase
          .from('equipment')
          .update(payload)
          .eq('id', selectedProduct.id);

        if (error) {
          console.error('❌ Supabase Update Error Details:', error);
          throw error;
        }

        setProducts(products.map(p => p.id === selectedProduct.id ? cleanedProduct : p));

        // Sincronización Real con DB
        await refetchAll();

        setNotification({ id: Date.now(), type: 'success', message: 'Producto actualizado exitosamente.' });
      } else {
        const newId = `prod-${Date.now()}`;
        const newProduct = { ...cleanedProduct, id: newId };

        const { error } = await supabase
          .from('equipment')
          .insert({
            id: newId,
            ...payload
          });

        if (error) {
          console.error('❌ Supabase Insert Error Details:', error);
          throw error;
        }
        setProducts([newProduct, ...products]);

        // Sincronización Real con DB
        await refetchAll();

        setNotification({ id: Date.now(), type: 'success', message: 'Producto creado exitosamente.' });
      }
      setIsProductModalOpen(false);
      setIsEditingProduct(false);
    } catch (error: any) {
      console.error('🔥 Error saving product (FULL):', error, error.message, error.details, error.hint);
      setNotification({ id: Date.now(), type: 'error', message: `Error al guardar: ${error.message || 'Error desconocido'}` });
    }
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setIsEditingProduct(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!isAdmin) return;

    try {
      console.log('🗑️ Intentando eliminar producto ID:', productId);
      const { error } = await supabase
        .from('equipment')
        .update({ is_deleted: true })
        .eq('id', productId);

      if (error) throw error;

      // Actualización optimista
      setProducts(products.filter(p => p.id !== productId));

      // Forzar Sincronización Real
      await refetchAll();

      setNotification({ id: Date.now(), type: 'success', message: 'Producto eliminado correctamente.' });
    } catch (error: any) {
      console.error('❌ Error deleting product:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al eliminar el producto.' });
    }
  };

  // Las funciones del carrito ahora vienen del hook useCart

  const handleSubmitOrder = async (
    customerInfo: { name: string; email: string; phone: string; message: string; city: string; department: string; country: string; mapsLink?: string; address?: string },
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
      clearCart();

      if (!isAdmin) {
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

  const navigateToView = (targetView: 'catalog' | 'orders' | 'dashboard' | 'promos') => {
    if (targetView === 'orders' && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (targetView === 'dashboard' && !isAdmin) {
      return;
    }

    setView(targetView);
    window.scrollTo(0, 0);
  };

  const handleAddBankAccount = async (account: BankAccount) => {
    console.log('🏦 Intentando agregar cuenta bancaria:', account);
    if (!isAdmin) {
      console.warn('⛔ Acceso denegado: No es administrador');
      return;
    }

    const previousAccounts = [...bankAccounts];
    const newAccounts = [...bankAccounts, account];
    setBankAccounts(newAccounts); // Optimistic update

    try {
      // Fetch latest ID to ensure sync
      console.log('🔍 Buscando configuración de sitio existente...');
      const { data: currentConfig, error: fetchError } = await supabase.from('site_config').select('id').single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn('⚠️ Alerta al buscar config:', fetchError);
      }

      const targetId = currentConfig?.id || configId;
      console.log('🎯 ID Objetivo para guardar:', targetId);

      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: targetId,
          bank_accounts: newAccounts
        });

      if (error) throw error;
      console.log('✅ Cuenta bancaria guardada exitosamente en DB');
      setNotification({ id: Date.now(), type: 'success', message: 'Cuenta bancaria guardada.' });
    } catch (error) {
      console.error('❌ Error saving bank account:', error);
      setBankAccounts(previousAccounts); // Rollback
      setNotification({ id: Date.now(), type: 'error', message: 'Error al conectar base de datos.' });
    }
  };

  const handleDeleteBankAccount = async (id: string) => {
    console.log('🗑️ Intentando eliminar cuenta bancaria ID:', id);
    if (!isAdmin) {
      console.warn('⛔ Acceso denegado: No es administrador');
      return;
    }

    const previousAccounts = [...bankAccounts];
    const newAccounts = bankAccounts.filter(acc => acc.id !== id);
    setBankAccounts(newAccounts); // Optimistic update

    try {
      // Fetch latest ID to ensure sync
      const { data: currentConfig, error: fetchError } = await supabase.from('site_config').select('id').single();
      const targetId = currentConfig?.id || configId;
      console.log('🎯 ID Objetivo para eliminación:', targetId);

      const { error } = await supabase
        .from('site_config')
        .upsert({
          id: targetId,
          bank_accounts: newAccounts
        });

      if (error) throw error;

      console.log('✅ Cuenta eliminada exitosamente en DB');
      setNotification({ id: Date.now(), type: 'success', message: 'Cuenta eliminada correctamente.' });
    } catch (error) {
      console.error('❌ Error deleting bank account:', error);
      setBankAccounts(previousAccounts); // Rollback
      setNotification({ id: Date.now(), type: 'error', message: 'Error al actualizar base de datos.' });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    if (!isAdmin) return;

    try {
      const targetOrder = orders.find(o => o.id === orderId);
      if (!targetOrder) return;

      const newHistoryItem: OrderStatusHistory = {
        status,
        note,
        date: new Date().toISOString(),
        updatedBy: user?.name
      };

      const newHistory = [newHistoryItem, ...(targetOrder.statusHistory || [])];

      const { error } = await supabase
        .from('orders')
        .update({
          status: status,
          status_history: newHistory
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            statusHistory: newHistory
          };
        }
        return o;
      }));

      if (note) {
        setNotification({ id: Date.now(), type: 'success', message: 'Estado actualizado y mensaje enviado.' });
      } else {
        setNotification({ id: Date.now(), type: 'success', message: 'Estado del pedido actualizado.' });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al actualizar estado en la base de datos.' });
    }
  };

  const handleUpdateItemStatus = async (orderId: string, itemIndex: number, status: DeliveryStatus) => {
    if (!isAdmin) return;

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const item = order.items[itemIndex];

      const { error } = await supabase
        .from('order_items')
        .update({
          delivery_status: status
        })
        .eq('order_id', orderId)
        .eq('equipment_id', item.equipment.id);

      if (error) throw error;

      setOrders(prevOrders => prevOrders.map(o => {
        if (o.id === orderId) {
          const newItems = [...o.items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            deliveryStatus: status
          };
          return { ...o, items: newItems };
        }
        return o;
      }));

      let message = 'Estado del item actualizado.';
      if (status === 'shipped') message = 'Item despachado al transportador.';
      if (status === 'delivered') message = 'Item entregado exitosamente.';

      setNotification({ id: Date.now(), type: 'success', message });
    } catch (error) {
      console.error('Error updating item status:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al actualizar estado del item.' });
    }
  };


  const handleSelectQuickCategory = (category: MuscleFilter) => {
    // Determine parent category based on selection
    if (['Mancuernas', 'Discos', 'Barras', 'Agarres', 'Soportes', 'Peso Libre', 'Bancos'].includes(category)) {
      setCategoryFilter('Accesorios');
    } else {
      setCategoryFilter('Maquinaria'); // Cardio, etc.
    }
    setMuscleFilter(category);

    // Scroll to catalog
    setTimeout(() => {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    p.isPromotion || (p.promotionalPrice && p.promotionalPrice > 0 && p.promotionalPrice < p.price)
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
      console.log('🗑️ Intentando borrar usuario:', profileId);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('❌ Error Supabase borrar usuario:', error);
        throw error;
      }

      const newProfiles = profiles.filter(p => p.id !== profileId);
      setProfiles(newProfiles);

      // Sincronización Real con DB
      await refetchAll();

      setNotification({ id: Date.now(), type: 'success', message: 'Usuario eliminado.' });
    } catch (error: any) {
      console.error('❌ Error deleting profile:', error);
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

        // Sincronización Real con DB
        await refetchAll();

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

        // Sincronización Real con DB
        await refetchAll();

        setNotification({ id: Date.now(), type: 'success', message: 'Evento creado con éxito.' });
      }
      handleCloseEventModal();
    } catch (error) {
      console.error('Error saving event:', error);
      setNotification({ id: Date.now(), type: 'error', message: 'Error al guardar el evento.' });
    }
  };

  const handleOptimizeImages = async () => {
    if (!isAdmin) return;

    const unoptimizedProducts = products.filter(p =>
      p.imageUrls.some(url => url && !url.includes('.webp') && !url.includes('blob.vercel-storage.com'))
    );

    if (unoptimizedProducts.length === 0) {
      setNotification({ id: Date.now(), type: 'success', message: '¡Todas tus imágenes ya están optimizadas!' });
      return;
    }

    setNotification({
      id: Date.now(),
      type: 'success',
      message: `Iniciando optimización de ${unoptimizedProducts.length} productos. Esto puede tardar...`
    });

    let optimizedCount = 0;

    for (const product of unoptimizedProducts) {
      try {
        const newUrls = await Promise.all(product.imageUrls.map(async (url) => {
          if (url && !url.includes('.webp') && !url.includes('blob.vercel-storage.com')) {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              const file = new File([blob], "image.jpg", { type: blob.type });
              return await uploadToBlob(file, 'products_optimized');
            } catch (e) {
              console.error(`Error optimizando imagen individual: ${url}`, e);
              return url;
            }
          }
          return url;
        }));

        const { error } = await supabase
          .from('equipment')
          .update({ image_urls: newUrls })
          .eq('id', product.id);

        if (!error) optimizedCount++;
      } catch (err) {
        console.error(`Error optimizando producto ${product.name}:`, err);
      }
    }

    await refetchAll();
    setNotification({
      id: Date.now(),
      type: 'success',
      message: `Optimización completada: ${optimizedCount} productos procesados.`
    });
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!isAdmin) return;

    try {
      console.log('🗑️ Intentando borrar evento:', eventId);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('❌ Error Supabase borrar evento:', error);
        throw error;
      }

      setEvents(events.filter(e => e.id !== eventId));

      // Sincronización Real con DB
      await refetchAll();

      setNotification({ id: Date.now(), type: 'success', message: 'Evento eliminado.' });
    } catch (error: any) {
      console.error('❌ Error deleting event:', error);
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
          id: configId,
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

      <div style={{ opacity: (appVisible || !loading) ? 1 : 0 }} className={`min-h-screen ${resolvedTheme === 'dark' ? 'dark bg-[#0a0a0a]' : 'bg-[#f8f9fa]'} transition-colors duration-500 relative overflow-x-hidden selection:bg-primary-500/30 selection:text-primary-600`}>

        {/* Global Geometric Background - Modern & Clean */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle Dot Grid */}
          <div className="absolute inset-0 opacity-[0.6] dark:opacity-[0.1]"
            style={{ backgroundImage: `radial-gradient(${resolvedTheme === 'dark' ? '#333' : '#e5e5e5'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

          {/* Abstract Geometric Figures */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full border border-neutral-100 dark:border-white/5 opacity-60" />
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full border border-primary-500/10 dark:border-primary-500/5" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full border border-neutral-100 dark:border-white/5 opacity-60" />
          <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full border border-primary-500/10 dark:border-primary-500/5" />
        </div>

        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
        {(view === 'catalog' || view === 'promos' || view === 'orders') && (
          <Header
            onCartClick={() => setIsCartOpen(true)}
            cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            onNavigate={navigateToView}
            onLoginClick={() => {
              setLoginModalInitialView('login');
              setIsLoginModalOpen(true);
            }}
            onAdminViewToggle={handleAdminViewToggle}
            adminView={view === 'dashboard' ? 'dashboard' : 'site'}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onGymBuilderClick={() => setIsGymBuilderOpen(true)}
          />
        )}

        <main className={`relative z-10 ${(view === 'catalog' || view === 'orders') ? 'pt-[80px] md:pt-[100px]' : ''} ${view === 'promos' ? 'pt-[100px]' : ''}`}>
          <AnimatePresence mode="wait">
            {view === 'catalog' && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Hero
                  onCartClick={() => {
                    if (!user) {
                      setLoginModalInitialView('register');
                      setPendingCartOpen(true);
                      setIsLoginModalOpen(true);
                    } else {
                      setIsCartOpen(true);
                    }
                  }}
                  slides={heroSlides}
                  isAdmin={isAdmin}
                  onEdit={() => setIsEditHeroModalOpen(true)}
                  onPromosClick={() => setView('promos')}
                  isLoggedIn={!!user}
                />

                {/* Purchase Models Info Window - REFINED BANNER STYLE */}
                <div className="w-full px-4 md:px-6 my-32 max-w-[1400px] mx-auto">
                  <div className="relative overflow-hidden rounded-[3rem] bg-white dark:bg-neutral-900 p-8 md:p-16 border border-neutral-200 dark:border-white/5 shadow-2xl">
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-16 md:gap-24 relative z-10">
                      <div className="text-center xl:text-left space-y-4 max-w-xl">
                        <div className="flex items-center justify-center xl:justify-start gap-4 mb-2">
                          <div className="w-12 h-[1px] bg-primary-500" />
                          <span className="text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.4em] text-[10px]">Flexibilidad de Pago</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none italic">
                          Modelos de <span className="text-primary-600">Inversión</span>
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium leading-relaxed italic">
                          Soluciones financieras diseñadas para el crecimiento de tu centro deportivo.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-8 w-full xl:w-auto">
                        {/* Option 1: Entrega Inmediata */}
                        <div className="flex-1 min-w-[300px] bg-neutral-50 dark:bg-black/40 rounded-[2.5rem] p-10 border border-neutral-100 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white mb-6 shadow-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Disponible</span>
                          </div>
                          <p className="text-neutral-900 dark:text-white text-3xl font-black uppercase tracking-tight mb-2">Entrega Inmediata</p>
                          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Pago 100% Contra Entrega</p>
                        </div>

                        {/* Option 2: Sobre Pedido */}
                        <div className="flex-1 min-w-[300px] bg-neutral-50 dark:bg-black/40 rounded-[2.5rem] p-10 border border-neutral-100 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 text-white mb-6 shadow-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Bajo Pedido</span>
                          </div>
                          <p className="text-neutral-900 dark:text-white text-3xl font-black uppercase tracking-tight mb-2">Reserva con 50%</p>
                          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Saldo al Finalizar Fabricación</p>
                        </div>
                      </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-600/5 blur-[100px] rounded-full pointer-events-none" />
                  </div>
                </div>

                <QuickCategoryNav
                  onSelectCategory={handleSelectQuickCategory}
                  galleryImages={galleryImages}
                />

                <div id="catalog" className="w-full px-1 md:px-4 py-20 md:py-32">
                  <div className="w-full bg-white dark:bg-[#111] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden p-4 sm:p-8 md:p-12 border border-neutral-200 dark:border-white/5">
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
                      machinery.length > 0 ? (
                        <>
                          <ProductGrid
                            products={machinery.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
                            onProductClick={handleProductClick}
                            onToggleCompare={handleToggleCompare}
                            comparisonList={comparisonList}
                            isAdmin={isAdmin}
                            onEditProduct={handleEditProduct}
                          />

                          {/* Pagination Controls */}
                          {machinery.length > ITEMS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-2 mt-12 bg-neutral-50 dark:bg-white/5 p-2 rounded-2xl w-fit mx-auto shadow-inner">
                              <button
                                onClick={() => {
                                  setCurrentPage(prev => Math.max(1, prev - 1));
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="p-3 rounded-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-colors flex-shrink-0"
                              >
                                <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-zinc-300" />
                              </button>

                              <div className="flex gap-2 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar px-2 mask-linear">
                                {Array.from({ length: Math.ceil(machinery.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                                  <button
                                    key={page}
                                    onClick={() => {
                                      setCurrentPage(page);
                                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-xl font-black text-xs flex-shrink-0 transition-all ${currentPage === page ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-white dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400'}`}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={() => {
                                  setCurrentPage(prev => Math.min(Math.ceil(machinery.length / ITEMS_PER_PAGE), prev + 1));
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === Math.ceil(machinery.length / ITEMS_PER_PAGE)}
                                className="p-3 rounded-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-colors flex-shrink-0"
                              >
                                <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-zinc-300" />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800/50 rounded-3xl mt-6">
                          <h2 className="text-2xl font-bold text-neutral-400">No hay maquinaria disponible.</h2>
                          <p className="mt-2 text-neutral-500">Vuelve pronto para ver nuestros productos.</p>
                        </div>
                      )
                    )}

                    {categoryFilter === 'Accesorios' && (
                      accessories.length > 0 ? (
                        <>
                          <ProductGrid
                            products={accessories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
                            onProductClick={handleProductClick}
                            onToggleCompare={handleToggleCompare}
                            comparisonList={comparisonList}
                            isAdmin={isAdmin}
                            onEditProduct={handleEditProduct}
                          />

                          {/* Pagination Controls for Accessories */}
                          {accessories.length > ITEMS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-2 mt-12 bg-neutral-50 dark:bg-white/5 p-2 rounded-2xl w-fit mx-auto shadow-inner">
                              <button
                                onClick={() => {
                                  setCurrentPage(prev => Math.max(1, prev - 1));
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="p-3 rounded-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-colors flex-shrink-0"
                              >
                                <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-zinc-300" />
                              </button>
                              <div className="flex gap-2 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar px-2 mask-linear">
                                {Array.from({ length: Math.ceil(accessories.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                                  <button
                                    key={page}
                                    onClick={() => {
                                      setCurrentPage(page);
                                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-xl font-black text-xs flex-shrink-0 transition-all ${currentPage === page ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-white dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400'}`}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => {
                                  setCurrentPage(prev => Math.min(Math.ceil(accessories.length / ITEMS_PER_PAGE), prev + 1));
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === Math.ceil(accessories.length / ITEMS_PER_PAGE)}
                                className="p-3 rounded-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-colors flex-shrink-0"
                              >
                                <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-zinc-300" />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800/50 rounded-3xl mt-6">
                          <h2 className="text-2xl font-bold text-neutral-400">No hay accesorios disponibles.</h2>
                          <p className="mt-2 text-neutral-500">Vuelve pronto para ver nuestros productos.</p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <TestimonialsSection />
                <EventsSection
                  events={events}
                  onEventClick={handleViewEvent}
                  isAdmin={isAdmin}
                  onEditEvent={handleOpenEventModal}
                  onDeleteEvent={handleDeleteEvent}
                />
                <GallerySection images={galleryImages} isAdmin={isAdmin} />
              </motion.div>
            )}

            {view === 'promos' && (
              <motion.div
                key="promos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full px-6 pb-12 max-w-7xl mx-auto"
              >
                <div className="mb-6">
                  <button
                    onClick={() => navigateToView('catalog')}
                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors uppercase font-bold tracking-widest text-xs"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                    Regresar al Catálogo
                  </button>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Oportunidades <span className="text-primary-500">Elite</span></h1>
                <p className="text-neutral-500 font-medium mb-12">Adquiere excelencia con condiciones preferenciales.</p>

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
                  <div className="py-32 text-center bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                    <div className="w-20 h-20 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                      <ShoppingBag size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">No hay promociones activas</h2>
                    <p className="text-neutral-500 font-medium">Vuelve pronto para descubrir nuestras ofertas elite.</p>
                  </div>
                )}
              </motion.div>
            )}

            {view === 'dashboard' && isAdmin && (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                  onDeleteProduct={handleDeleteProduct}
                  onSaveProduct={handleSaveProduct}
                  onAdminViewToggle={handleAdminViewToggle}
                  onLogout={logout}
                  onOptimizeImages={handleOptimizeImages}
                />
              </motion.div>
            )}



            {view === 'orders' && user && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <MyOrders orders={userOrders} onBackToCatalog={() => navigateToView('catalog')} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        {(view === 'catalog' || view === 'promos' || view === 'orders') && <Footer sealUrl={sealUrl} />}
        {(view === 'catalog' || view === 'promos' || view === 'orders') && <ThemeSwitcher theme={theme} setTheme={setTheme} />}
        {(view === 'catalog' || view === 'promos' || view === 'orders') && <WhatsAppButton phoneNumber={whatsAppNumber} />}

        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={handleCloseProductModal}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          isEditing={isEditingProduct || (selectedProduct !== null && !selectedProduct.id)}
          onSave={handleSaveProduct}
          allProducts={products}
          onProductClick={handleProductClick}
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
        {view !== 'dashboard' && comparisonList.length > 0 && (
          <ComparisonBar
            items={comparisonList}
            onCompare={() => setIsComparisonModalOpen(true)}
            onClear={() => setComparisonList([])}
          />
        )}
        <ComparisonModal
          items={comparisonList}
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          initialView={loginModalInitialView}
        />
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
