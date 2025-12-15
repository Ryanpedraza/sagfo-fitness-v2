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
    Filter,
    Edit,
    Trash2,
    DollarSign,
    Clock,
    Upload,
    Truck
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
    onAddGalleryImage: (file: File, caption: string) => void;
    onDeleteGalleryImage: (imageId: string) => void;
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
    onAddGalleryImage,
    onDeleteGalleryImage,
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
    onUploadSeal
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'events' | 'gallery' | 'settings'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
    const [statusNote, setStatusNote] = useState('');

    // Stats
    const totalRevenue = orders.reduce((acc, order) => acc + (order.financials?.amountPaid || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pendiente de AprobaciÃ³n').length;
    const totalProducts = products.length;
    const totalUsers = profiles.length;

    const transporters = profiles.filter(p => p.role === 'transporter');

    const handleStatusChange = (order: Order, status: OrderStatus) => {
        setSelectedOrder(order);
        setNewStatus(status);
        setStatusNote('');
        setStatusModalOpen(true);
    };

    const confirmStatusChange = () => {
        if (selectedOrder && newStatus) {
            onUpdateOrderStatus(selectedOrder.id, newStatus, statusNote);
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
        if (!canDispatch && isMadeToOrder) return 'Disponible cuando el pedido estÃ© en "Despachado"';
        return 'Despachar al transportador';
    };

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ScrollReveal delay={0.1}>
                    <StatCard title="Ingresos Totales" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6 text-green-500" />} />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <StatCard title="Pedidos Pendientes" value={pendingOrders.toString()} icon={<Clock className="w-6 h-6 text-orange-500" />} />
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <StatCard title="Productos Activos" value={totalProducts.toString()} icon={<Package className="w-6 h-6 text-blue-500" />} />
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                    <StatCard title="Usuarios Registrados" value={totalUsers.toString()} icon={<Users className="w-6 h-6 text-purple-500" />} />
                </ScrollReveal>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-neutral-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Actividad Reciente</h3>
                <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-zinc-800 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-white">Pedido #{order.id.slice(-6)}</p>
                                    <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    const renderProducts = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Productos</h2>
                <button
                    onClick={onOpenCreateProductModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="p-2 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-800"
                    aria-label="Filtrar productos"
                >
                    <Filter className="w-5 h-5 text-neutral-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                            src={product.imageUrls[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEditProduct(product)}
                                                className="p-3 bg-white/95 dark:bg-zinc-800/95 text-neutral-700 dark:text-white rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                                                aria-label={`Editar ${product.name}`}
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteProduct(product.id)}
                                                className="p-3 bg-white/95 dark:bg-zinc-800/95 text-neutral-700 dark:text-white rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                                                aria-label={`Eliminar ${product.name}`}
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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Pedidos</h2>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden">
                        {/* Header - Always Visible */}
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
                                        {new Date(order.createdAt).toLocaleDateString()} â€¢ {order.customerInfo.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-neutral-500">
                                        {expandedOrderId === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                                    </span>
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

                        {/* Expanded Details */}
                        {expandedOrderId === order.id && (
                            <div className="border-t border-neutral-100 dark:border-zinc-800 p-6 bg-neutral-50 dark:bg-zinc-900/50">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Items & Status */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Status Selector */}
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <label htmlFor={`order-status-${order.id}`} className="block text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                                                Cambiar Estado
                                            </label>
                                            <select
                                                id={`order-status-${order.id}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                                                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="Pendiente de AprobaciÃ³n">Pendiente de AprobaciÃ³n</option>
                                                <option value="Recibido">Recibido</option>
                                                <option value="En Desarrollo">En Desarrollo</option>
                                                <option value="Despachado">Despachado</option>
                                                <option value="En EnvÃ­o">En EnvÃ­o</option>
                                                <option value="Entregado">Entregado</option>
                                            </select>
                                        </div>

                                        {/* Transporter Assignment */}
                                        {transporters.length > 0 && (
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                                <label htmlFor={`transporter-${order.id}`} className="block text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                                                    Asignar Transportador
                                                </label>
                                                <select
                                                    id={`transporter-${order.id}`}
                                                    value={order.assignedTransporterId || ''}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        onAssignTransporter(order.id, e.target.value);
                                                    }}
                                                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="">Sin asignar</option>
                                                    {transporters.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                                {order.assignedTransporterId && (
                                                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                                        <Truck className="w-4 h-4" />
                                                        Transportador asignado
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Items List */}
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <h4 className="font-bold mb-4 text-neutral-900 dark:text-white">Items del Pedido</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => {
                                                    const isInStock = item.equipment.availabilityStatus === 'in-stock';
                                                    const isMadeToOrder = item.equipment.availabilityStatus === 'made-to-order';
                                                    const orderIsDispatched = order.status === 'Despachado' || order.status === 'En EnvÃ­o' || order.status === 'Entregado';
                                                    const canDispatch = item.deliveryStatus === 'pending' && (isInStock || (isMadeToOrder && orderIsDispatched));
                                                    const isShipped = item.deliveryStatus === 'shipped';
                                                    const isDelivered = item.deliveryStatus === 'delivered';

                                                    // Badge classes
                                                    const itemTypeBadgeClass = isInStock
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';

                                                    const itemTypeLabel = isInStock ? 'Stock' : 'ProducciÃ³n';
                                                    const dispatchButtonText = isShipped ? 'âœ“ Despachado' : 'Despachar';

                                                    return (
                                                        <div key={`${order.id}-item-${idx}`} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-lg">
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                                    {item.quantity}
                                                                </span>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="text-neutral-900 dark:text-white font-medium">{item.equipment.name}</span>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${itemTypeBadgeClass}`}>
                                                                            {itemTypeLabel}
                                                                        </span>
                                                                    </div>
                                                                    {item.deliveryStatus && (
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getDeliveryStatusBadgeClass(item.deliveryStatus)}`}>
                                                                            {getDeliveryStatusText(item.deliveryStatus)}
                                                                        </span>
                                                                    )}
                                                                    {isMadeToOrder && !orderIsDispatched && item.deliveryStatus === 'pending' && (
                                                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                                            âš ï¸ Disponible para despacho cuando el pedido estÃ© en "Despachado"
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                <span className="text-neutral-900 dark:text-white font-bold">
                                                                    ${(item.price_at_purchase * item.quantity).toLocaleString()}
                                                                </span>

                                                                {!isDelivered && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (canDispatch) {
                                                                                onUpdateItemStatus(order.id, idx, 'shipped');
                                                                            }
                                                                        }}
                                                                        disabled={!canDispatch}
                                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${getDispatchButtonClass(canDispatch, isShipped)}`}
                                                                        title={getDispatchButtonTitle(isShipped, canDispatch, isMadeToOrder)}
                                                                    >
                                                                        {dispatchButtonText}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Status History */}
                                        {order.statusHistory && order.statusHistory.length > 0 && (
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                                <h4 className="font-bold mb-4 text-neutral-900 dark:text-white">Historial de Estados</h4>
                                                <div className="space-y-3">
                                                    {order.statusHistory.map((history, idx) => (
                                                        <div key={`${order.id}-history-${idx}`} className="flex gap-3 pb-3 border-b border-neutral-100 dark:border-zinc-800 last:border-0">
                                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                            <div className="flex-grow">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="font-medium text-neutral-900 dark:text-white text-sm">{history.status}</span>
                                                                    <span className="text-xs text-neutral-500">
                                                                        {new Date(history.date).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                {history.note && (
                                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-800/50 p-2 rounded">
                                                                        {history.note}
                                                                    </p>
                                                                )}
                                                                {history.updatedBy && (
                                                                    <p className="text-xs text-neutral-500 mt-1">Por: {history.updatedBy}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column - Customer Info */}
                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <h4 className="font-bold mb-4 text-neutral-900 dark:text-white">InformaciÃ³n del Cliente</h4>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <p className="text-neutral-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">Nombre</p>
                                                    <p className="text-neutral-900 dark:text-white font-medium">{order.customerInfo.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">TelÃ©fono</p>
                                                    <a href={`tel:${order.customerInfo.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                                        {order.customerInfo.phone}
                                                    </a>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">Email</p>
                                                    <a href={`mailto:${order.customerInfo.email}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all">
                                                        {order.customerInfo.email}
                                                    </a>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">UbicaciÃ³n</p>
                                                    <p className="text-neutral-900 dark:text-white">{order.customerInfo.city}, {order.customerInfo.department}</p>
                                                </div>
                                                {order.customerInfo.address && (
                                                    <div>
                                                        <p className="text-neutral-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">DirecciÃ³n</p>
                                                        <p className="text-neutral-900 dark:text-white">{order.customerInfo.address}</p>
                                                    </div>
                                                )}
                                                {order.customerInfo.message && (
                                                    <div>
                                                        <p className="text-neutral-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">Mensaje</p>
                                                        <p className="text-neutral-600 dark:text-neutral-400 text-sm bg-neutral-50 dark:bg-zinc-800/50 p-2 rounded">
                                                            {order.customerInfo.message}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Status Change Modal */}
            {statusModalOpen && selectedOrder && newStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setStatusModalOpen(false)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-neutral-200 dark:border-zinc-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                            Cambiar Estado a "{newStatus}"
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            Pedido #{selectedOrder.id.slice(-6)} - {selectedOrder.customerInfo.name}
                        </p>

                        <div className="mb-6">
                            <label htmlFor="status-note" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Mensaje para el cliente (opcional)
                            </label>
                            <textarea
                                id="status-note"
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                placeholder="Ej: Tu pedido estÃ¡ en camino. LlegarÃ¡ maÃ±ana entre 9am y 12pm."
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                            <p className="mt-2 text-xs text-neutral-500 dark:text-zinc-400">
                                Este mensaje se guardarÃ¡ en el historial y el cliente podrÃ¡ verlo en "Mis Pedidos"
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStatusModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 dark:border-zinc-800 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmStatusChange}
                                className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Confirmar Cambio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Usuarios</h2>
                <button
                    onClick={() => onOpenUserModal(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
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
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass}`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {profile.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => onOpenUserModal(profile)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                                        <button onClick={() => onDeleteProfile(profile.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Eventos</h2>
                <button
                    onClick={() => onOpenEventModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Evento
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                    <ScrollReveal key={event.id} delay={index * 0.1}>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 overflow-hidden">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">{event.title}</h3>
                                <p className="text-sm text-neutral-500 mb-4">{new Date(event.date).toLocaleDateString()}</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onOpenEventModal(event)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                        aria-label={`Editar evento ${event.title}`}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteEvent(event.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        aria-label={`Eliminar evento ${event.title}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );

    const renderGallery = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">GalerÃ­a</h2>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Subir Imagen
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onAddGalleryImage(file, 'Nueva imagen');
                        }}
                    />
                </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, i) => (
                    <ScrollReveal key={image.id} delay={i * 0.05} className="h-full">
                        <div className="relative group aspect-square rounded-xl overflow-hidden h-full">
                            <img src={image.imageUrl} alt={image.caption} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => onDeleteGalleryImage(image.id)}
                                    className="p-2 bg-white/10 text-white rounded-full hover:bg-red-600 transition-colors"
                                    aria-label={`Eliminar imagen ${image.caption}`}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">ConfiguraciÃ³n</h2>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 p-6 space-y-6">
                <div>
                    <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Contacto</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="whatsapp-number" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                NÃºmero de WhatsApp
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="whatsapp-number"
                                    type="text"
                                    value={whatsAppNumber}
                                    onChange={(e) => onUpdateWhatsAppNumber(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-transparent text-neutral-900 dark:text-white"
                                />
                                <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-100 dark:border-zinc-800 pt-6">
                    <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Apariencia</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-neutral-900 dark:text-white">Editar Banners Principales</p>
                            <p className="text-sm text-neutral-500">Gestiona las imÃ¡genes del carrusel inicial</p>
                        </div>
                        <button
                            onClick={onEditHero}
                            className="px-4 py-2 border border-neutral-200 dark:border-zinc-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Editar Banners
                        </button>
                    </div>
                </div>

                <div className="border-t border-neutral-100 dark:border-zinc-800 pt-6">
                    <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Sello de Calidad (Footer)</h3>
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-neutral-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-zinc-700">
                            {sealUrl ? (
                                <img src={sealUrl} alt="Sello de calidad" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-xs text-neutral-400 text-center px-2">Sin sello</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                Sube una imagen para mostrar como sello de calidad o certificaciÃ³n en el pie de pÃ¡gina del sitio.
                                Se recomienda una imagen PNG con fondo transparente.
                            </p>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <span>Subir Sello</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onUploadSeal(file);
                                    }}
                                />
                            </label>
                            {sealUrl && (
                                <button
                                    onClick={() => onUpdateSeal('')}
                                    className="ml-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 fixed h-full overflow-y-auto">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-blue-600" />
                        Admin Panel
                    </h1>
                </div>
                <nav className="px-3 space-y-1">
                    <NavItem icon={<LayoutDashboard />} label="Resumen" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<Package />} label="Productos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                    <NavItem icon={<ShoppingCart />} label="Pedidos" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                    <NavItem icon={<Users />} label="Usuarios" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <NavItem icon={<Calendar />} label="Eventos" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                    <NavItem icon={<ImageIcon />} label="GalerÃ­a" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
                    <NavItem icon={<Settings />} label="ConfiguraciÃ³n" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'events' && renderEvents()}
                {activeTab === 'gallery' && renderGallery()}
                {activeTab === 'settings' && renderSettings()}
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-zinc-800'
            }`}
    >
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        <span className="font-medium">{label}</span>
    </button>
);

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
            {icon}
        </div>
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
    </div>
);

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
