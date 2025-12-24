import React, { useState } from 'react';
import { EquipmentItem, Order, Event, GalleryImage, Profile, BankAccount, OrderStatus, DeliveryStatus } from '../types';
import ScrollReveal from './ScrollReveal';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Calendar,
    Image as ImageIcon,
    Settings,
    Plus,
    Search,
    Edit,
    Trash2,
    DollarSign,
    Clock,
    Upload,
    Truck,
    MessageSquare,
    Copy,
    Check,
    Shield,
    Camera,
    X,
    Wallet,
    Factory,
    FileText,
    Table,
    Printer,
    ArrowDown,
    Save,
    ArrowUpRight,
    LogOut
} from 'lucide-react';

interface AdminDashboardProps {
    products: EquipmentItem[];
    orders: Order[];
    events: Event[];
    galleryImages: GalleryImage[];
    profiles: Profile[];
    onEditProduct: (product: EquipmentItem) => void;
    onOpenCreateProductModal: () => void;
    onEditHero: () => void;
    onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
    whatsAppNumber: string;
    onUpdateWhatsAppNumber: (number: string) => void;
    onSaveEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    onOpenEventModal: (event?: Event) => void;
    onOpenUserModal: (user: Profile | null) => void;
    onDeleteProfile: (profileId: string) => void;
    displayByCategory: boolean;
    onSetDisplayByCategory: (value: boolean) => void;
    bankAccounts: BankAccount[];
    onAddBankAccount: (account: BankAccount) => void;
    onDeleteBankAccount: (id: string) => void;
    sealUrl: string;
    onUpdateSeal: (url: string) => void;
    onUpdateItemStatus: (orderId: string, itemIndex: number, status: DeliveryStatus) => void;
    onAssignTransporter: (orderId: string, transporterId: string) => void;
    onDeleteProduct: (productId: string) => void;
    onUploadSeal: (file: File) => void;
    onSaveProduct: (product: EquipmentItem) => void;
    onAdminViewToggle: () => void;
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    products,
    orders,
    events,
    galleryImages,
    profiles,
    onEditProduct,
    onOpenCreateProductModal,
    onEditHero,
    onUpdateOrderStatus,
    whatsAppNumber,
    onUpdateWhatsAppNumber,
    onSaveEvent,
    onDeleteEvent,
    onOpenEventModal,
    onOpenUserModal,
    onDeleteProfile,
    displayByCategory,
    onSetDisplayByCategory,
    bankAccounts,
    onAddBankAccount,
    onDeleteBankAccount,
    sealUrl,
    onUpdateSeal,
    onUpdateItemStatus,
    onAssignTransporter,
    onDeleteProduct,
    onUploadSeal,
    onSaveProduct,
    onAdminViewToggle,
    onLogout
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'events' | 'gallery' | 'settings' | 'whatsapp' | 'debts' | 'logistics' | 'bulk-prices' | 'quotes'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
    const [statusNote, setStatusNote] = useState('');
    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

    // Stats
    const totalRevenue = orders.reduce((acc, order) => acc + (order.financials?.amountPaid || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pendiente de Aprobación').length;
    const totalProducts = products.length;
    const totalUsers = profiles.length;

    const transporters = profiles.filter(p => p.role === 'transporter');

    const [bulkPrices, setBulkPrices] = useState<Record<string, number>>(
        products.reduce((acc, p) => ({ ...acc, [p.id]: p.price }), {})
    );
    const [isSavingPrices, setIsSavingPrices] = useState(false);

    // Quote Builder State
    const [isManualQuote, setIsManualQuote] = useState(false);
    const [manualQuoteItems, setManualQuoteItems] = useState<{ product: EquipmentItem, quantity: number, price: number }[]>([]);
    const [manualCustomerName, setManualCustomerName] = useState('');
    const [manualCustomerCity, setManualCustomerCity] = useState('');

    const handleStatusChange = (order: Order, status: OrderStatus) => {
        setSelectedOrder(order);
        setNewStatus(status);
        setStatusNote('');
        setStatusModalOpen(true);
    };

    const confirmStatusChange = () => {
        if (selectedOrder && newStatus) {
            onUpdateOrderStatus(selectedOrder.id, newStatus, statusNote);

            // Auto-trigger WhatsApp notification for specific statuses
            if (newStatus === 'Recibido' && selectedOrder.customerInfo) {
                handleWhatsAppMessage(
                    selectedOrder.customerInfo.phone,
                    `¡Hola ${selectedOrder.customerInfo.name}! 👋 Confirmamos el recibo de tu pago para el pedido #${selectedOrder.id.slice(-6)}. Tu equipo ya está en proceso de gestión.`
                );
            } else if (newStatus === 'En Envío' && selectedOrder.customerInfo) {
                handleWhatsAppMessage(
                    selectedOrder.customerInfo.phone,
                    `¡Hola ${selectedOrder.customerInfo.name}! 👋 Tu pedido #${selectedOrder.id.slice(-6)} ha sido despachado y está en camino. ¡Pronto disfrutarás de tu equipo SAGFO elite!`
                );
            }

            setStatusModalOpen(false);
            setSelectedOrder(null);
            setNewStatus(null);
            setStatusNote('');
        }
    };

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleOrderHeaderKeyDown = (e: React.KeyboardEvent, orderId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOrderExpansion(orderId);
        }
    };

    const getDeliveryStatusBadgeClass = (status: DeliveryStatus | undefined) => {
        if (status === 'delivered') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (status === 'shipped') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    };

    const getDeliveryStatusText = (status: DeliveryStatus | undefined) => {
        if (status === 'delivered') return 'Entregado';
        if (status === 'shipped') return 'Despachado al Transportador';
        return 'Pendiente';
    };

    const getDispatchButtonClass = (canDispatch: boolean, isShipped: boolean) => {
        if (canDispatch) return 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer';
        if (isShipped) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed';
        return 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500 cursor-not-allowed';
    };

    const getDispatchButtonTitle = (isShipped: boolean, canDispatch: boolean, isMadeToOrder: boolean) => {
        if (isShipped) return 'Ya despachado';
        if (!canDispatch && isMadeToOrder) return 'Disponible cuando el pedido esté en "Despachado"';
        return 'Despachar al transportador';
    };

    const handleWhatsAppMessage = (phone: string, message: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    };

    const copyOrderSummary = (order: Order) => {
        const summary = `
📦 PEDIDO #${order.id.slice(-6)}
━━━━━━━━━━━━━━━━━━━━━━━━
👤 Cliente: ${order.customerInfo?.name || 'Cliente SAGFO'}
📞 Tel: ${order.customerInfo?.phone || 'Sin teléfono'}
📍 Ubicación: ${order.customerInfo?.city || 'Sin ciudad'}, ${order.customerInfo?.department || 'Sin depto'}${order.customerInfo?.country ? ` (${order.customerInfo.country})` : ''}
🏠 Dirección: ${order.customerInfo?.address || 'No especificada'}

💰 RESUMEN FINANCIERO
- Total: $${order.financials?.totalOrderValue?.toLocaleString() || '0'}
- Pagado: $${order.financials?.amountPaid?.toLocaleString() || '0'}
- Pendiente: $${order.financials?.amountPending?.toLocaleString() || '0'}
- Método: ${order.paymentMethod === 'production' ? 'Producción (50/50)' : order.paymentMethod === 'standard' ? 'Pago Total' : 'Mixto'}

🛒 PRODUCTOS
${order.items.map(item => {
            let details = `- ${item.quantity}x ${item.equipment.name}`;
            if (item.structureColor) details += `\n  • Estructura: ${item.structureColor}`;
            if (item.upholsteryColor) details += `\n  • Tapicería: ${item.upholsteryColor}`;
            if (item.selectedWeight) details += `\n  • Peso: ${item.selectedWeight}`;
            return details;
        }).join('\n')}

📝 ESTADO: ${order.status.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━
generado por SAGFO Elite v2
        `.trim();

        navigator.clipboard.writeText(summary);
        setCopiedOrderId(order.id);
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    const renderOverview = () => (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-primary-600 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Resumen Global</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Inteligencia de Negocio y Métricas Élites</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ScrollReveal delay={0.1}>
                    <StatCard
                        title="Ventas Totales"
                        value={`$${totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="w-6 h-6" />}
                        color="emerald"
                        trend="+18.4% este mes"
                    />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <StatCard
                        title="Pedidos Críticos"
                        value={pendingOrders.toString()}
                        icon={<Clock className={`w-6 h-6 ${pendingOrders > 0 ? 'animate-pulse' : ''}`} />}
                        color="amber"
                        trend={pendingOrders > 0 ? "Acción inmediata" : "Sincronizado"}
                    />
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <StatCard
                        title="Catálogo Activo"
                        value={totalProducts.toString()}
                        icon={<Package className="w-6 h-6" />}
                        color="blue"
                        trend="Equipos Premium"
                    />
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                    <StatCard
                        title="Comunidad SAGFO"
                        value={totalUsers.toString()}
                        icon={<Users className="w-6 h-6" />}
                        color="violet"
                        trend="Clientes Elite"
                    />
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Flujo de Ingresos</h3>
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest italic">Últimos 7 pedidos procesados</p>
                        </div>
                    </div>

                    <div className="h-48 w-full relative flex items-end gap-2 group/chart">
                        {orders.slice(0, 7).reverse().map((o) => {
                            const val = o.financials?.totalOrderValue || 0;
                            const max = Math.max(...orders.slice(0, 7).map(x => x.financials?.totalOrderValue || 1));
                            const height = (val / max) * 100;
                            return (
                                <div key={o.id} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-primary-600/20 group-hover:bg-primary-600 rounded-t-xl transition-all duration-700 relative overflow-hidden"
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-600 to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
                                    </div>
                                    <span className="text-[8px] font-black text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase italic tracking-tighter truncate w-full text-center">
                                        #{o.id.slice(-4)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-8">Actividad Reciente</h3>
                    <div className="space-y-6">
                        {orders.slice(0, 4).map(order => (
                            <div key={order.id} className="group flex items-start justify-between gap-4 transition-all hover:translate-x-1 outline-none">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary-600/10 transition-colors">
                                        <ShoppingCart className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-black text-neutral-900 dark:text-white uppercase italic text-sm tracking-tighter leading-none mb-1">Pedido #{order.id.slice(-6)}</p>
                                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic tracking-widest ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className="w-full mt-8 py-4 border border-dashed border-neutral-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic text-neutral-400 hover:text-primary-600 hover:border-primary-600/30 transition-all"
                    >
                        Ver todos los pedidos
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-primary-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Inventario Élite</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión de Equipamiento de Alto Rendimiento</p>
                </div>
                <button
                    onClick={onOpenCreateProductModal}
                    className="flex items-center gap-3 px-8 py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Equipo Premium
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                    .filter(p => {
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
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEditProduct(product)}
                                                className="p-3 bg-white/95 dark:bg-zinc-800/95 text-neutral-700 dark:text-white rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                                                        onDeleteProduct(product.id);
                                                    }
                                                }}
                                                className="p-3 bg-white/95 dark:bg-zinc-800/95 text-neutral-700 dark:text-white rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{product.name}</h3>
                                        <p className="text-sm text-neutral-500 mb-3">{product.category}</p>
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

    const renderOrders = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-amber-500 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Flujo de Pedidos</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Monitoreo de Logística y Ventas Activas</p>
                </div>
            </div>
            <div className="space-y-8">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden">
                        <div
                            role="button"
                            tabIndex={0}
                            className="p-6 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors"
                            onClick={() => toggleOrderExpansion(order.id)}
                            onKeyDown={(e) => handleOrderHeaderKeyDown(e, order.id)}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                            Pedido #{order.id.slice(-6)}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-neutral-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.customerInfo?.name || 'Cliente SAGFO'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleWhatsAppMessage(
                                                    order.customerInfo?.phone || '',
                                                    `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Te contacto de SAGFO sobre tu pedido #${order.id.slice(-6)}.`
                                                );
                                            }}
                                            className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyOrderSummary(order);
                                            }}
                                            className={`p-2 rounded-lg transition-all ${copiedOrderId === order.id
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                                : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            {copiedOrderId === order.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-neutral-400 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {expandedOrderId === order.id && (
                            <div className="border-t border-neutral-100 dark:border-zinc-800 p-6 bg-neutral-50 dark:bg-zinc-900/50">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <label className="block text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Cambiar Estado</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                                                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white"
                                            >
                                                <option value="Pendiente de Aprobación">Pendiente de Aprobación</option>
                                                <option value="Recibido">Recibido</option>
                                                <option value="En Desarrollo">En Desarrollo</option>
                                                <option value="Despachado">Despachado</option>
                                                <option value="En Envío">En Envío</option>
                                                <option value="Entregado">Entregado</option>
                                            </select>
                                        </div>

                                        {transporters.length > 0 && (
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                                <label className="block text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Asignar Transportador</label>
                                                <select
                                                    value={order.assignedTransporterId || ''}
                                                    onChange={(e) => onAssignTransporter(order.id, e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white"
                                                >
                                                    <option value="">Sin asignar</option>
                                                    {transporters.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <h4 className="font-bold mb-4 text-neutral-900 dark:text-white">Items del Pedido</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => {
                                                    const product = item?.equipment;
                                                    const isInStock = product?.availabilityStatus === 'in-stock';
                                                    const isMadeToOrder = product?.availabilityStatus === 'made-to-order';
                                                    const orderIsDispatched = order.status === 'Despachado' || order.status === 'En Envío' || order.status === 'Entregado';
                                                    const canDispatch = item.deliveryStatus === 'pending' && (isInStock || (isMadeToOrder && orderIsDispatched));
                                                    const isShipped = item.deliveryStatus === 'shipped';
                                                    const isDelivered = item.deliveryStatus === 'delivered';

                                                    // Badge classes
                                                    const itemTypeBadgeClass = isInStock
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';

                                                    const itemTypeLabel = isInStock ? 'Stock' : 'Producción';

                                                    return (
                                                        <div key={`${order.id}-item-${idx}`} className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-100 dark:border-zinc-700/50">
                                                            <div className="flex gap-4 flex-1">
                                                                {/* Product Photo */}
                                                                <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-white/5">
                                                                    {product?.imageUrls?.[0] ? (
                                                                        <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                                            <Package className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                        <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-black italic">
                                                                            {item.quantity}x
                                                                        </span>
                                                                        <span className="text-neutral-900 dark:text-white font-black uppercase italic tracking-tight text-sm">{product?.name || 'Producto Desconocido'}</span>
                                                                        {product && (
                                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${itemTypeBadgeClass}`}>
                                                                                {itemTypeLabel}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Customization Details */}
                                                                    <div className="flex flex-wrap gap-3 mt-2 mb-2">
                                                                        {item.structureColor && (
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-white/5">
                                                                                <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: item.structureColor.toLowerCase() }} />
                                                                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Est: {item.structureColor}</span>
                                                                            </div>
                                                                        )}
                                                                        {item.upholsteryColor && (
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-white/5">
                                                                                <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: item.upholsteryColor.toLowerCase() }} />
                                                                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Tap: {item.upholsteryColor}</span>
                                                                            </div>
                                                                        )}
                                                                        {item.selectedWeight && (
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-white/5">
                                                                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Peso: {item.selectedWeight}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        {item.deliveryStatus && (
                                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase italic tracking-widest ${getDeliveryStatusBadgeClass(item.deliveryStatus)}`}>
                                                                                {getDeliveryStatusText(item.deliveryStatus)}
                                                                            </span>
                                                                        )}
                                                                        {isMadeToOrder && !orderIsDispatched && item.deliveryStatus === 'pending' && (
                                                                            <p className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase italic tracking-tight">
                                                                                ⚠️ Pendiente de despacho general
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {!isDelivered ? (
                                                                <button
                                                                    onClick={() => canDispatch && onUpdateItemStatus(order.id, idx, 'shipped')}
                                                                    disabled={!canDispatch}
                                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${getDispatchButtonClass(canDispatch, isShipped)}`}
                                                                >
                                                                    {isShipped ? '✓ Despachado' : 'Despachar'}
                                                                </button>
                                                            ) : (
                                                                <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                    Entregado
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <h4 className="font-bold text-neutral-900 dark:text-white mb-4">Cliente</h4>
                                            <div className="space-y-3 text-sm">
                                                <p><span className="text-neutral-500">Nombre:</span> <span className="text-neutral-900 dark:text-white font-medium">{order.customerInfo?.name || 'N/A'}</span></p>
                                                <p><span className="text-neutral-500">Tel:</span> <a href={`tel:${order.customerInfo?.phone || ''}`} className="text-blue-600 underline">{order.customerInfo?.phone || 'N/A'}</a></p>
                                                <p><span className="text-neutral-500">Ubicación:</span> <span className="text-neutral-900 dark:text-white">{order.customerInfo?.city || 'N/A'}, {order.customerInfo?.department || 'N/A'}</span></p>
                                            </div>
                                        </div>

                                        <div className="bg-[#25D366]/5 dark:bg-[#25D366]/10 rounded-xl p-4 border border-[#25D366]/20">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center">
                                                    <MessageSquare className="w-5 h-5 text-white" />
                                                </div>
                                                <h4 className="font-bold text-neutral-900 dark:text-white">Herramientas WhatsApp</h4>
                                            </div>

                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleWhatsAppMessage(
                                                        order.customerInfo?.phone || '',
                                                        `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Te contacto de SAGFO sobre tu pedido #${order.id.slice(-6)}. ¿Cómo podemos ayudarte?`
                                                    )}
                                                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-[#25D366] transition-colors group"
                                                >
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">Contacto General</span>
                                                    <MessageSquare className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                                </button>

                                                <button
                                                    onClick={() => handleWhatsAppMessage(
                                                        order.customerInfo?.phone || '',
                                                        `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Confirmamos el recibo de tu pago para el pedido #${order.id.slice(-6)}. Tu equipo ya está en proceso de gestión.`
                                                    )}
                                                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-[#25D366] transition-colors group"
                                                >
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">Confirmar Pago</span>
                                                    <DollarSign className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                                </button>

                                                <button
                                                    onClick={() => handleWhatsAppMessage(
                                                        order.customerInfo?.phone || '',
                                                        `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Tu pedido #${order.id.slice(-6)} ha sido despachado y está en camino. ¡Pronto disfrutarás de tu equipo SAGFO elite!`
                                                    )}
                                                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-[#25D366] transition-colors group"
                                                >
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">Notificar Despacho</span>
                                                    <Truck className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                                </button>

                                                <button
                                                    onClick={() => handleWhatsAppMessage(
                                                        order.customerInfo?.phone || '',
                                                        `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Tu pedido #${order.id.slice(-6)} está listo para salir. Por favor envíanos tu ubicación actual por WhatsApp para que la ruta de nuestro capitán sea exacta y el equipo llegue perfecto. 📍`
                                                    )}
                                                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-[#25D366] transition-colors group"
                                                >
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">Solicitar Ubicación GPS</span>
                                                    <Search className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                                </button>

                                                <button
                                                    onClick={() => handleWhatsAppMessage(
                                                        order.customerInfo?.phone || '',
                                                        `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 ¿Cómo vas con tu nuevo equipo SAGFO? Nos encantaría saber tu opinión y si todo quedó como esperabas. ¡Tu satisfacción es nuestra prioridad elite! 🏅`
                                                    )}
                                                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-[#25D366] transition-colors group"
                                                >
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">Seguimiento Post-Venta</span>
                                                    <Check className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>

                                            <p className="mt-3 text-[10px] text-neutral-500 font-black uppercase tracking-widest italic text-center opacity-50">
                                                Elite Communication Center
                                            </p>
                                        </div>

                                        {/* Financial Summary */}
                                        {order.financials && (
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                                <h4 className="font-bold mb-4 text-neutral-900 dark:text-white">Resumen Financiero</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-neutral-500">Total del Pedido:</span>
                                                        <span className="font-bold text-neutral-900 dark:text-white">
                                                            ${order.financials.totalOrderValue.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-neutral-500">Pagado:</span>
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            ${order.financials.amountPaid.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 border-t border-neutral-100 dark:border-zinc-800">
                                                        <span className="text-neutral-500">Pendiente:</span>
                                                        <span className="font-bold text-orange-600 dark:text-orange-400">
                                                            ${order.financials.amountPending.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Comprobante de Pago */}
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <h4 className="font-bold mb-4 text-neutral-900 dark:text-white flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" />
                                                Comprobante de Pago
                                            </h4>
                                            {order.paymentProofUrl ? (
                                                <div className="space-y-4">
                                                    <div className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-zinc-800">
                                                        <img
                                                            src={order.paymentProofUrl}
                                                            alt="Comprobante de Pago"
                                                            className="w-full h-auto max-h-64 object-contain transition-transform duration-500 group-hover:scale-110"
                                                            onClick={() => window.open(order.paymentProofUrl, '_blank')}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <p className="text-white text-[10px] font-black uppercase tracking-widest italic">Ampliar Imagen</p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={order.paymentProofUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full text-center py-2 bg-neutral-100 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase italic tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 transition-colors"
                                                    >
                                                        Ver en pantalla completa
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="py-8 text-center border-2 border-dashed border-neutral-100 dark:border-zinc-800 rounded-lg">
                                                    <Camera className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase italic">Sin comprobante adjunto</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {statusModalOpen && selectedOrder && newStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setStatusModalOpen(false)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Actualizar Estado</h3>
                        <textarea
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="Nota para el cliente..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-transparent mb-4"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setStatusModalOpen(false)} className="flex-1 py-3 border rounded-lg">Cancelar</button>
                            <button onClick={confirmStatusChange} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-purple-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Equipo Administrativo</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión de Roles y Accesos de Seguridad</p>
                </div>
                <button
                    onClick={() => onOpenUserModal(null)}
                    className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Añadir Colaborador
                </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">País/Ciudad</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-zinc-800">
                        {profiles.map(profile => {
                            const roleClass = profile.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                profile.role === 'transporter' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';

                            return (
                                <tr key={profile.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-zinc-700 flex items-center justify-center text-neutral-500 font-bold">
                                                {profile.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">{profile.name}</div>
                                                <div className="text-xs text-neutral-500">{profile.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass}`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-zinc-400">
                                        {profile.phone || '---'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-zinc-400">
                                        {profile.country || 'COL'} - {profile.city || 'S.I'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => onOpenUserModal(profile)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                                                    onDeleteProfile(profile.id);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderEvents = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-primary-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Eventos & Seminarios</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión de Presencia en Vivo</p>
                </div>
                <button
                    onClick={() => onOpenEventModal()}
                    className="flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Crear Nuevo Evento
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <div key={event.id} className="group bg-white dark:bg-zinc-900/50 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-700">
                        <div className="relative h-56 overflow-hidden">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest italic">{event.date}</span>
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">{event.title}</h3>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium italic line-clamp-3 leading-relaxed">{event.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/5">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{event.location}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => onOpenEventModal(event)} className="p-3 border border-neutral-100 dark:border-white/10 rounded-xl text-blue-500 hover:bg-blue-500/10 transition-all"><Edit className="w-4 h-4" /></button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Estás seguro de eliminar este evento?')) {
                                                onDeleteEvent(event.id);
                                            }
                                        }}
                                        className="p-3 border border-neutral-100 dark:border-white/10 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-neutral-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
                        <Calendar className="w-12 h-12 text-neutral-300 mb-4" />
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">No hay eventos programados en este momento</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderGallery = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-primary-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Exhibición Digital</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Motor de Galería de Alto Impacto Automatizado</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-4 bg-primary-600/5 rounded-2xl border border-primary-600/20">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-primary-600">Sincronizado al 100% con el Catálogo</span>
                </div>
            </div>
            <p className="text-[11px] text-neutral-500 font-bold uppercase italic opacity-70 leading-relaxed max-w-2xl">Todas las imágenes visualizadas en la galería pública se derivan automáticamente de las fotos cargadas en cada equipo del inventario.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                {galleryImages.map(image => (
                    <div key={image.id} className="relative aspect-square rounded-3xl overflow-hidden group border border-neutral-100 dark:border-white/5 shadow-xl transition-transform hover:scale-[1.02]">
                        <img src={image.imageUrl} alt={image.caption} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                            <p className="text-[8px] font-black text-white uppercase italic tracking-widest truncate">{image.caption}</p>
                            <p className="text-[6px] text-primary-400 font-bold uppercase tracking-widest mt-1">Fuente: Catálogo Elite</p>
                        </div>
                    </div>
                ))}
                {galleryImages.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-neutral-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
                        <ImageIcon className="w-12 h-12 text-neutral-300 mb-4" />
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Sube equipos con fotos para activar la galería</p>
                    </div>
                )}
            </div>

            <div className="bg-primary-600/5 border border-primary-600/10 p-10 rounded-[3rem] text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600">
                    <Package className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-2">¿Necesitas añadir o remover imágenes?</h3>
                    <p className="text-sm text-neutral-500 max-w-lg mb-8">La galería se alimenta de las fotos de tus productos. Simplemente edita un equipo o crea uno nuevo para actualizar el escaparate visual.</p>
                    <button
                        onClick={() => setActiveTab('products')}
                        className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary-600/20 hover:scale-105 transition-all"
                    >
                        Ir a Inventario Élite
                    </button>
                </div>
            </div>
        </div>
    );

    const renderWhatsApp = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-[#25D366] rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Comunicaciones Élite</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Panel de Respuesta Inmediata y Fidelización</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.slice(0, 12).map((order) => (
                    <div key={`wa-${order.id}`} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-neutral-200 dark:border-zinc-800 shadow-sm hover:border-[#25D366] transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">
                                    {order.customerInfo?.name || 'Cliente SAGFO'}
                                </h3>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest italic leading-none">
                                    Pedido #{order.id.slice(-6)}
                                </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase italic tracking-widest ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500">Teléfono:</span>
                                <span className="font-bold text-neutral-900 dark:text-white">{order.customerInfo?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500">Ubicación:</span>
                                <span className="text-neutral-900 dark:text-white">{order.customerInfo?.city || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleWhatsAppMessage(
                                    order.customerInfo?.phone || '',
                                    `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Te contacto de SAGFO sobre tu pedido #${order.id.slice(-6)}.`
                                )}
                                className="flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase italic tracking-tighter hover:scale-105 transition-transform"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Charlar
                            </button>
                            <button
                                onClick={() => copyOrderSummary(order)}
                                className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase italic tracking-tighter hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                {copiedOrderId === order.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copiedOrderId === order.id ? 'Copiado' : 'Resumen'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-100 dark:bg-zinc-800/50 p-8 rounded-3xl border border-dashed border-neutral-300 dark:border-zinc-700 mt-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-[#25D366]" />
                </div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-2">Elite Communication Center</h3>
                <p className="text-sm text-neutral-500 max-w-md">Todos los mensajes utilizan plantillas personalizadas para mantener el estándar de excelencia SAGFO.</p>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-12 max-w-4xl">
            <div className="space-y-4">
                <div className="w-16 h-2 bg-primary-600 rounded-full" />
                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Configuración Élite</h2>
                <p className="text-sm text-neutral-500 font-bold uppercase tracking-[0.3em] italic">Infraestructura digital y narrativa visual de SAGFO</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* WHATSAPP CARD */}
                <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366] opacity-0 group-hover:opacity-5 blur-3xl transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-8 text-[#25D366] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4 italic">Enlace de Ventas Global</label>
                    <input
                        type="text"
                        value={whatsAppNumber}
                        onChange={(e) => onUpdateWhatsAppNumber(e.target.value)}
                        placeholder="Ejem: 57310..."
                        className="w-full px-6 py-5 rounded-2xl border border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-black/40 text-neutral-900 dark:text-white font-black text-2xl tracking-tighter outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner"
                    />
                    <div className="text-[10px] text-neutral-400 mt-6 italic font-bold uppercase opacity-60 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                        Formato internacional sin el símbolo "+"
                    </div>
                </div>

                {/* HERO/BANNER CARD */}
                <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 opacity-0 group-hover:opacity-5 blur-3xl transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-8 text-primary-600 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-3">Escaparate Visual</h3>
                    <p className="text-[11px] text-neutral-500 mb-10 font-bold uppercase italic leading-relaxed opacity-70">Control total del Hero Banner y las promociones dinámicas del catálogo.</p>

                    <button
                        onClick={onEditHero}
                        className="w-full py-5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[12px] shadow-2xl hover:translate-y-[-4px] active:translate-y-0 transition-all duration-500 border border-transparent dark:border-white relative overflow-hidden group/btn"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Edit className="w-4 h-4" />
                            Redefinir Banners
                        </span>
                        <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    </button>
                </div>

                {/* BANK ACCOUNTS CARD */}
                <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden md:col-span-2">
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                        <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">Cuentas Bancarias</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-white/[0.02] p-8 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 space-y-6">
                        <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] italic mb-2">Nueva Cuenta Élite</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Entidad Bancaria</label>
                                <input id="new-bank-name" type="text" placeholder="Ejem: BANC O LOMB IA" className="w-full px-6 py-4 bg-white dark:bg-black/40 rounded-2xl text-xs font-black uppercase italic outline-none border-2 border-transparent focus:border-amber-500/30 transition-all text-neutral-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Tipo de Cuenta</label>
                                <select id="new-bank-type" className="w-full px-6 py-4 bg-white dark:bg-black/40 rounded-2xl text-xs font-black uppercase italic outline-none border-2 border-transparent focus:border-amber-500/30 transition-all appearance-none text-neutral-900 dark:text-white">
                                    <option value="Ahorros">AHORROS</option>
                                    <option value="Corriente">CORRIENTE</option>
                                    <option value="Nequi/Daviplata">NEQUI/DAVIPLATA</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Número de Cuenta</label>
                                <input id="new-bank-number" type="text" placeholder="000-000000-00" className="w-full px-6 py-4 bg-white dark:bg-black/40 rounded-2xl text-xs font-black uppercase italic outline-none border-2 border-transparent focus:border-amber-500/30 transition-all text-neutral-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Nombre del Titular</label>
                                <input id="new-bank-holder" type="text" placeholder="SAGFO FITNESS CO" className="w-full px-6 py-4 bg-white dark:bg-black/40 rounded-2xl text-xs font-black uppercase italic outline-none border-2 border-transparent focus:border-amber-500/30 transition-all text-neutral-900 dark:text-white" />
                            </div>
                            <div className="md:col-span-2 flex items-end">
                                <button
                                    onClick={() => {
                                        const name = (document.getElementById('new-bank-name') as HTMLInputElement).value;
                                        const type = (document.getElementById('new-bank-type') as HTMLSelectElement).value;
                                        const number = (document.getElementById('new-bank-number') as HTMLInputElement).value;
                                        const holder = (document.getElementById('new-bank-holder') as HTMLInputElement).value;

                                        if (name && number && holder) {
                                            onAddBankAccount({
                                                id: `bank-${Date.now()}`,
                                                bankName: name,
                                                accountType: type,
                                                accountNumber: number,
                                                holderName: holder
                                            });

                                            // Reset inputs
                                            (document.getElementById('new-bank-name') as HTMLInputElement).value = '';
                                            (document.getElementById('new-bank-number') as HTMLInputElement).value = '';
                                            (document.getElementById('new-bank-holder') as HTMLInputElement).value = '';
                                        } else {
                                            alert('Por favor completa todos los campos principales.');
                                        }
                                    }}
                                    className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <Plus className="w-4 h-4" />
                                    Registrar Nueva Cuenta
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bank Account List */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] italic mb-4">Cuentas Registradas</p>
                        {bankAccounts.length === 0 ? (
                            <div className="py-12 text-center border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-2xl">
                                <p className="text-sm font-bold text-neutral-400 italic">No hay cuentas bancarias configuradas</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bankAccounts.map(account => (
                                    <div key={account.id} className="p-5 bg-white dark:bg-black/30 rounded-2xl border border-neutral-200 dark:border-white/10 flex justify-between items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-neutral-900 dark:text-white uppercase italic text-sm leading-tight truncate">{account.bankName}</p>
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">{account.accountNumber} • {account.accountType}</p>
                                            <p className="text-[9px] text-neutral-400 mt-0.5 uppercase font-medium truncate">{account.holderName}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                console.log('🗑️ Eliminando cuenta:', account.id);
                                                onDeleteBankAccount(account.id);
                                            }}
                                            className="shrink-0 p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                            title="Eliminar cuenta"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* CORPORATE SEAL CARD */}
                <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden md:col-span-2">
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-40 h-40 rounded-[2rem] bg-neutral-50 dark:bg-black/40 border-2 border-dashed border-neutral-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {sealUrl ? (
                                <img src={sealUrl} alt="Sello SAGFO" className="w-full h-full object-contain p-4" />
                            ) : (
                                <Upload className="w-10 h-10 text-neutral-200" />
                            )}
                        </div>
                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">Sello Élite de Garantía</h3>
                                <p className="text-xs text-neutral-500 font-bold uppercase italic leading-relaxed opacity-70">Este sello aparece en todas las cotizaciones PDF para certificar la autenticidad de SAGFO Fitness Co.</p>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex-1 px-8 py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px] text-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onUploadSeal(file);
                                        }}
                                    />
                                    Cargar Nuevo Sello
                                </label>
                                {sealUrl && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Remover el sello actual?')) {
                                                onUpdateSeal('');
                                            }
                                        }}
                                        className="px-8 py-4 border-2 border-red-500/20 text-red-500 rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:bg-red-500/5 transition-all"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


    const renderDebts = () => (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-red-600 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Cuentas por Cobrar</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Seguimiento de Saldos y Cobranza Activa</p>
            </div>

            <div className="grid gap-6">
                {orders.filter(o => o.financials && o.financials.amountPending > 0).map(order => (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-neutral-200 dark:border-white/5 shadow-sm group hover:border-red-500/30 transition-all duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                                    <Wallet className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Pedido #{order.id.slice(-6)}</h3>
                                    <p className="font-bold text-neutral-500 uppercase tracking-widest italic">{order.customerInfo?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest italic">Saldo Pendiente</p>
                                    <p className="text-2xl font-black text-red-600 tracking-tighter italic">${order.financials?.amountPending.toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => handleWhatsAppMessage(
                                        order.customerInfo?.phone || '',
                                        `¡Hola ${order.customerInfo?.name}! 👋 Te contacto de SAGFO Elite. Tu pedido #${order.id.slice(-6)} está progresando, pero registramos un saldo pendiente de $${order.financials?.amountPending.toLocaleString()}. ¿Nos podrías confirmar el pago para programar el despacho? 🏅`
                                    )}
                                    className="flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Cobrar por WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLogistics = () => (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Logística y Despachos</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Hoja de Ruta y Gestión de Transportadores</p>
            </div>

            <div className="grid gap-8">
                {transporters.map(transporter => {
                    const assignedOrders = orders.filter(o => o.assignedTransporterId === transporter.id);
                    if (assignedOrders.length === 0) return null;

                    return (
                        <div key={transporter.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Truck className="w-32 h-32" />
                            </div>

                            <div className="flex justify-between items-end mb-10 pb-8 border-b border-neutral-100 dark:border-white/5">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                                        <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Transportador: {transporter.name}</h3>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.2em] italic">Hoja de Ruta Activa • {assignedOrders.length} Entregas</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {assignedOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-6 bg-neutral-50 dark:bg-white/[0.02] rounded-3xl border border-neutral-100 dark:border-white/5">
                                        <div className="flex gap-8 items-center">
                                            <div className="text-center">
                                                <p className="text-[10px] text-neutral-400 font-black uppercase italic">Pedido</p>
                                                <p className="font-black text-neutral-900 dark:text-white tracking-tighter">#{order.id.slice(-6)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 font-black uppercase italic">Destino</p>
                                                <p className="font-black text-neutral-900 dark:text-white tracking-tighter uppercase sm:text-base text-sm">{order.customerInfo?.city}, {order.customerInfo?.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 font-black uppercase italic">Cliente</p>
                                                <p className="font-black text-neutral-900 dark:text-white tracking-tighter">{order.customerInfo?.name}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderBulkPrices = () => (
        <div className="space-y-12 no-print">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-emerald-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Editor de Precios</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Actualización Masiva de Inventario</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setBulkPrices(products.reduce((acc, p) => ({ ...acc, [p.id]: p.price }), {}));
                        }}
                        className="px-8 py-4 border-2 border-neutral-200 dark:border-white/10 rounded-2xl font-black uppercase italic tracking-widest text-[10px] text-neutral-500 hover:border-red-500/30 hover:text-red-500 transition-all"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={async () => {
                            setIsSavingPrices(true);
                            try {
                                for (const product of products) {
                                    if (bulkPrices[product.id] !== product.price) {
                                        await onSaveProduct({ ...product, price: bulkPrices[product.id] });
                                    }
                                }
                                alert('Precios actualizados con éxito');
                            } catch (error) {
                                console.error('Error saving bulk prices:', error);
                                alert('Error al actualizar precios');
                            } finally {
                                setIsSavingPrices(false);
                            }
                        }}
                        disabled={isSavingPrices}
                        className="flex items-center gap-4 px-10 py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-[10px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 group"
                    >
                        {isSavingPrices ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                        Guardar Cambios Masivos
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-neutral-200 dark:border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-white/[0.03]">
                            <th className="px-10 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic">Equipo</th>
                            <th className="px-10 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic">Actual</th>
                            <th className="px-10 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic">Nuevo Precio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.01] transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                                            <img src={product.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-6 text-neutral-500 font-bold">
                                    ${product.price.toLocaleString()}
                                </td>
                                <td className="px-10 py-6">
                                    <div className="relative max-w-[200px]">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 font-black italic">$</span>
                                        <input
                                            type="number"
                                            value={bulkPrices[product.id] || 0}
                                            onChange={(e) => setBulkPrices({ ...bulkPrices, [product.id]: parseInt(e.target.value) || 0 })}
                                            className="w-full pl-10 pr-6 py-4 bg-neutral-100 dark:bg-white/[0.03] border-2 border-transparent focus:border-emerald-500/30 rounded-2xl font-black italic text-neutral-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderQuotes = () => (
        <div className="space-y-12">
            <div className="space-y-2 no-print">
                <div className="w-12 h-1 bg-neutral-950 dark:bg-white rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Simulador de Cotizaciones</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Generador de Propuestas Élite en PDF</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 no-print">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setIsManualQuote(false)}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] transition-all border-2 ${!isManualQuote ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-white/5 text-neutral-500 border-transparent hover:border-neutral-200 dark:hover:border-white/10'}`}
                        >
                            Desde Pedidos Existentes
                        </button>
                        <button
                            onClick={() => {
                                setIsManualQuote(true);
                            }}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] transition-all border-2 ${isManualQuote ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-white/5 text-neutral-500 border-transparent hover:border-neutral-200 dark:hover:border-white/10'}`}
                        >
                            Cotización Manual (Nueva)
                        </button>
                    </div>

                    {!isManualQuote ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl">
                            <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-8">Seleccionar Pedido para Cotizar</h3>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                                {orders.slice(0, 15).map(order => (
                                    <button
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${selectedOrder?.id === order.id ? 'border-primary-600 bg-primary-600/5' : 'border-transparent bg-neutral-50 dark:bg-white/5 hover:border-neutral-200 dark:hover:border-white/10'}`}
                                    >
                                        <div className="flex gap-6 items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-neutral-400">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">Pedido #{order.id.slice(-6)}</p>
                                                <p className="text-[10px] text-neutral-500 font-bold uppercase italic tracking-widest">{order.customerInfo?.name}</p>
                                            </div>
                                        </div>
                                        <ArrowDown className="-rotate-90 w-5 h-5 text-neutral-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-neutral-500">Nombre del Prospecto</label>
                                    <input
                                        type="text"
                                        value={manualCustomerName}
                                        onChange={(e) => setManualCustomerName(e.target.value)}
                                        placeholder="CLIENTE SAGFO ELITE"
                                        className="w-full px-6 py-4 bg-neutral-50 dark:bg-white/5 rounded-2xl font-bold border-2 border-transparent focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-neutral-500">Ciudad / Destino</label>
                                    <input
                                        type="text"
                                        value={manualCustomerCity}
                                        onChange={(e) => setManualCustomerCity(e.target.value)}
                                        placeholder="CIUDAD, PAIS"
                                        className="w-full px-6 py-4 bg-neutral-50 dark:bg-white/5 rounded-2xl font-bold border-2 border-transparent focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase italic tracking-widest text-neutral-500">Agregar Equipos</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                    {products.map(product => (
                                        <div key={product.id} className="p-4 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-neutral-100 dark:border-white/5 flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-zinc-800 overflow-hidden">
                                                    <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs font-black uppercase italic tracking-tight">{product.name}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const exists = manualQuoteItems.find(i => i.product.id === product.id);
                                                    if (exists) {
                                                        setManualQuoteItems(manualQuoteItems.filter(i => i.product.id !== product.id));
                                                    } else {
                                                        setManualQuoteItems([...manualQuoteItems, { product, quantity: 1, price: product.price }]);
                                                    }
                                                }}
                                                className={`p-2 rounded-xl transition-all ${manualQuoteItems.find(i => i.product.id === product.id) ? 'bg-red-500 text-white' : 'bg-primary-600 text-white hover:scale-110'}`}
                                            >
                                                {manualQuoteItems.find(i => i.product.id === product.id) ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {manualQuoteItems.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-white/5">
                                    <h4 className="text-[10px] font-black uppercase italic tracking-widest text-neutral-500">Items Seleccionados</h4>
                                    <div className="space-y-3">
                                        {manualQuoteItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-black/20 p-4 rounded-2xl border border-neutral-100 dark:border-white/5">
                                                <span className="text-xs font-black italic flex-1">{item.product.name}</span>
                                                <div className="flex items-center gap-3 bg-neutral-100 dark:bg-zinc-800 rounded-xl p-1 border border-neutral-200 dark:border-white/5">
                                                    <button
                                                        onClick={() => {
                                                            const newItems = [...manualQuoteItems];
                                                            newItems[idx].quantity = Math.max(1, item.quantity - 1);
                                                            setManualQuoteItems(newItems);
                                                        }}
                                                        className="w-7 h-7 flex items-center justify-center text-xs font-black text-neutral-500 hover:text-primary-500 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-6 text-center text-[10px] font-black">{item.quantity}</span>
                                                    <button
                                                        onClick={() => {
                                                            const newItems = [...manualQuoteItems];
                                                            newItems[idx].quantity = item.quantity + 1;
                                                            setManualQuoteItems(newItems);
                                                        }}
                                                        className="w-7 h-7 flex items-center justify-center text-xs font-black text-neutral-500 hover:text-primary-500 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="text-[10px] opacity-30 font-black">X</span>
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => {
                                                        const newItems = [...manualQuoteItems];
                                                        newItems[idx].price = parseInt(e.target.value) || 0;
                                                        setManualQuoteItems(newItems);
                                                    }}
                                                    className="w-32 px-3 py-1 bg-neutral-100 dark:bg-zinc-800 rounded-lg text-xs font-black italic text-right"
                                                />
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-950 text-white rounded-[2.5rem] p-10 shadow-3xl sticky top-32 border border-white/10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 relative z-10">Vista Previa</h3>

                        {(isManualQuote ? manualQuoteItems.length > 0 : selectedOrder) ? (
                            <div className="space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">Prospecto Élite</p>
                                    <p className="text-xl font-black uppercase italic tracking-tighter">
                                        {isManualQuote ? (manualCustomerName || 'CLIENTE POTENCIAL') : selectedOrder?.customerInfo?.name}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">Resumen de Inversión</p>
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <span className="text-sm font-bold opacity-60">Total Items:</span>
                                        <span className="text-xl font-black italic">
                                            {isManualQuote ? manualQuoteItems.reduce((acc, i) => acc + i.quantity, 0) : selectedOrder?.items.length} equipos
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold opacity-60">Valor Total:</span>
                                        <span className="text-3xl font-black text-primary-500 italic tracking-tighter">
                                            ${(isManualQuote ? manualQuoteItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) : selectedOrder?.financials?.totalOrderValue || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full mt-8 flex items-center justify-center gap-4 py-6 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest text-[12px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                >
                                    <Printer className="w-6 h-6" />
                                    Imprimir / PDF
                                </button>

                                {isManualQuote && (
                                    <button
                                        onClick={() => {
                                            setManualQuoteItems([]);
                                            setManualCustomerName('');
                                            setManualCustomerCity('');
                                        }}
                                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-white/40 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Limpiar Todo
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-30">
                                <FileText className="w-16 h-16 mx-auto mb-6" />
                                <p className="font-black uppercase italic tracking-widest text-xs">
                                    {isManualQuote ? 'Agrega equipos para empezar la cotización manual' : 'Selecciona un pedido para visualizar la cotización elite'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {
                (isManualQuote ? manualQuoteItems.length > 0 : selectedOrder) && (
                    <div className="hidden print:block fixed inset-0 bg-white z-[100] p-10 text-black">
                        <div className="flex justify-between items-start mb-10">
                            <img src="/logo-sf.png" className="h-16" alt="SAGFO" />
                            <div className="text-right">
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Cotización Élite</h1>
                                <p className="text-neutral-500 font-bold">Fecha: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10 mb-10">
                            <div>
                                <h4 className="font-black uppercase italic tracking-widest text-xs text-neutral-400 mb-2">Cliente</h4>
                                <p className="font-black uppercase italic text-xl">
                                    {isManualQuote ? (manualCustomerName || 'CLIENTE POTENCIAL') : selectedOrder?.customerInfo?.name}
                                </p>
                                <p className="text-neutral-500">
                                    {isManualQuote ? (manualCustomerCity || 'POR DEFINIR') : `${selectedOrder?.customerInfo?.city}, ${selectedOrder?.customerInfo?.department}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-black uppercase italic tracking-widest text-xs text-neutral-400 mb-2">Proveedor</h4>
                                <p className="font-black uppercase italic text-xl">SAGFO FITNESS CO.</p>
                                <p className="text-neutral-500">Equipamiento de Alto Rendimiento</p>
                            </div>
                        </div>

                        <table className="w-full mb-10 border-t-2 border-black">
                            <thead>
                                <tr className="border-b border-neutral-200">
                                    <th className="py-4 text-left font-black uppercase italic text-xs">Foto</th>
                                    <th className="py-4 text-left font-black uppercase italic text-xs">Equipo</th>
                                    <th className="py-4 text-center font-black uppercase italic text-xs">Cant.</th>
                                    <th className="py-4 text-right font-black uppercase italic text-xs">Precio Unit.</th>
                                    <th className="py-4 text-right font-black uppercase italic text-xs">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {isManualQuote ? (
                                    manualQuoteItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-100">
                                                    <img src={item.product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="font-black uppercase italic text-sm">{item.product.name}</p>
                                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Equipamiento Elite Sagfo</p>
                                            </td>
                                            <td className="py-4 text-center font-bold">{item.quantity}</td>
                                            <td className="py-4 text-right">${item.price.toLocaleString()}</td>
                                            <td className="py-4 text-right font-black italic">${(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    selectedOrder?.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-100">
                                                    <img src={item.equipment.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="font-black uppercase italic text-sm">{item.equipment.name}</p>
                                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                                                    {item.structureColor && `Estructura: ${item.structureColor}`} {item.upholsteryColor && `| Tapicería: ${item.upholsteryColor}`}
                                                </p>
                                            </td>
                                            <td className="py-4 text-center font-bold">{item.quantity}</td>
                                            <td className="py-4 text-right">${(item.price_at_purchase || item.equipment.price).toLocaleString()}</td>
                                            <td className="py-4 text-right font-black italic">${((item.price_at_purchase || item.equipment.price) * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-black">
                                    <td colSpan={4} className="pt-6 text-right font-black uppercase italic text-xs">Total Inversión</td>
                                    <td className="pt-6 text-right font-black uppercase italic text-2xl text-primary-600">
                                        ${(isManualQuote ? manualQuoteItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) : selectedOrder?.financials?.totalOrderValue || 0).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="mt-20 pt-10 border-t border-neutral-100 grid grid-cols-2 gap-10">
                            <div>
                                <h4 className="font-black uppercase italic tracking-widest text-[10px] mb-4">Términos y Condiciones</h4>
                                <ul className="text-[10px] text-neutral-500 space-y-1">
                                    <li>• Tiempo de entrega estimado: 25-35 días hábiles.</li>
                                    <li>• Garantía: 5 años en estructura, 1 año en tapicería y partes móviles.</li>
                                    <li>• Forma de pago: 50% anticipo, 50% contra entrega.</li>
                                </ul>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <div className="w-32 h-1 bg-black mb-2" />
                                <p className="font-black uppercase italic text-[10px]">Autorizado por SAGFO Management</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-black flex">
            {/* SIDEBAR ELITE */}
            <aside className="w-72 border-r border-neutral-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] fixed top-0 bottom-0 left-0 z-40 transition-all duration-500 flex flex-col">
                <div className="p-10 mb-2">
                    <div className="cursor-pointer group flex items-center gap-4" onClick={() => setActiveTab('overview')}>
                        <img src="/logo-light.png" alt="Logo" className="h-10 w-auto object-contain dark:hidden transition-transform duration-500 group-hover:scale-110" />
                        <img src="/logo-sf.png" alt="Logo" className="h-10 w-auto object-contain hidden dark:block transition-transform duration-500 group-hover:scale-110" />
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar pb-20">
                    <div className="text-[10px] font-black text-neutral-400 dark:text-zinc-600 uppercase tracking-[0.3em] italic mb-4 px-4">Centro de Control</div>
                    <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<ShoppingCart />} label="Ventas y Pedidos" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                    <NavItem icon={<MessageSquare />} label="Comunicaciones" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />

                    <div className="pt-8 text-[10px] font-black text-neutral-400 dark:text-zinc-600 uppercase tracking-[0.3em] italic mb-4 px-4">Inventario & Medios</div>
                    <NavItem icon={<Package />} label="Catálogo Elite" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                    <NavItem icon={<Calendar />} label="Eventos" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                    <NavItem icon={<ImageIcon />} label="Galería" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />

                    <div className="pt-8 text-[10px] font-black text-neutral-400 dark:text-zinc-600 uppercase tracking-[0.3em] italic mb-4 px-4">Operación Élite</div>
                    <NavItem icon={<Wallet />} label="Cuentas por Cobrar" active={activeTab === 'debts'} onClick={() => setActiveTab('debts')} />
                    <NavItem icon={<Truck />} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
                    <NavItem icon={<FileText />} label="Cotizaciones" active={activeTab === 'quotes'} onClick={() => setActiveTab('quotes')} />
                    <NavItem icon={<Table />} label="Editar Precios" active={activeTab === 'bulk-prices'} onClick={() => setActiveTab('bulk-prices')} />

                    <div className="pt-8 text-[10px] font-black text-neutral-400 dark:text-zinc-600 uppercase tracking-[0.3em] italic mb-4 px-4">Configuración</div>
                    <NavItem icon={<Users />} label="Gestionar Personal" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <NavItem icon={<Settings />} label="Ajustes de Núcleo" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

                    <div className="my-8 mx-6 h-px bg-neutral-100 dark:bg-white/5" />

                    <div className="px-4 space-y-2">
                        <button
                            onClick={onAdminViewToggle}
                            className="group w-full flex items-center gap-4 px-6 py-4 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-2xl transition-all duration-500 border border-transparent hover:border-primary-500/20"
                        >
                            <div className="transition-transform duration-300 group-hover:-translate-x-1">
                                <ArrowUpRight className="rotate-[225deg] w-4 h-4" />
                            </div>
                            <span className="font-black uppercase italic tracking-widest text-[10px]">Ir a la Tienda</span>
                        </button>

                        <button
                            onClick={onLogout}
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

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-72 p-12 lg:p-20 overflow-y-auto min-h-screen no-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {/* Active View Container */}
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'products' && renderProducts()}
                        {activeTab === 'orders' && renderOrders()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'events' && renderEvents()}
                        {activeTab === 'gallery' && renderGallery()}
                        {activeTab === 'whatsapp' && renderWhatsApp()}
                        {activeTab === 'settings' && renderSettings()}
                        {activeTab === 'debts' && renderDebts()}
                        {activeTab === 'logistics' && renderLogistics()}
                        {activeTab === 'bulk-prices' && renderBulkPrices()}
                        {activeTab === 'quotes' && renderQuotes()}
                    </div>
                </div>
            </main>
        </div>
    );
};

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

const StatCard = ({ title, value, icon, color, trend }: { title: string, value: string, icon: React.ReactNode, color: string, trend?: string }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'from-emerald-500/10 to-transparent text-emerald-600',
        amber: 'from-amber-500/10 to-transparent text-amber-600',
        blue: 'from-blue-500/10 to-transparent text-blue-600',
        violet: 'from-violet-500/10 to-transparent text-violet-600',
    };

    return (
        <div className="group bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-neutral-200 dark:border-white/5 hover:border-primary-500/30 transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : color === 'blue' ? 'bg-blue-500' : 'bg-violet-500'}`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-4 rounded-2xl bg-gradient-to-br shadow-inner ${colorClasses[color] || 'bg-neutral-100 dark:bg-white/5'}`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
                </div>
                {trend && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md italic ${trend.includes('+') ? 'text-emerald-500 bg-emerald-500/5' : 'text-neutral-400 bg-neutral-400/5'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-neutral-500 dark:text-neutral-400 text-xs font-black uppercase tracking-widest mb-1 italic opacity-70 group-hover:opacity-100 transition-opacity">{title}</h3>
                <p className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter italic group-hover:scale-105 transition-transform origin-left duration-500">{value}</p>
            </div>
        </div>
    );
};

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'Recibido': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'En Desarrollo': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        case 'Despachado': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        case 'En Envío': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
        case 'Entregado': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'Pendiente de Aprobación': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
};

export default AdminDashboard;
