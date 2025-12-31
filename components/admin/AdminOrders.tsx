import React, { useState } from 'react';
import { Order, OrderStatus, DeliveryStatus, Profile } from '../../types';
import { getStatusColor } from '../../lib/utils';
import {
    MessageSquare,
    Copy,
    Check,
    Package,
    ImageIcon,
    Camera,
    Truck,
    DollarSign,
    Search,
    XCircle,
    AlertTriangle
} from 'lucide-react';

interface AdminOrdersProps {
    orders: Order[];
    profiles: Profile[];
    onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
    onUpdateItemStatus: (orderId: string, itemIndex: number, status: DeliveryStatus) => void;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({
    orders,
    profiles,
    onUpdateOrderStatus,
    onUpdateItemStatus
}) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
    const [statusNote, setStatusNote] = useState('');
    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);



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
            } else if (newStatus === 'Rechazado' && selectedOrder.customerInfo) {
                handleWhatsAppMessage(
                    selectedOrder.customerInfo.phone,
                    `¡Hola ${selectedOrder.customerInfo.name}! 👋 Te informamos que tu pedido #${selectedOrder.id.slice(-6)} ha sido RECHAZADO debido a inconvenientes con la verificación del pago o información suministrada. Por favor contáctanos para más detalles.`
                );
            } else if (newStatus === 'Cancelado' && selectedOrder.customerInfo) {
                handleWhatsAppMessage(
                    selectedOrder.customerInfo.phone,
                    `¡Hola ${selectedOrder.customerInfo.name}! 👋 Confirmamos que tu pedido #${selectedOrder.id.slice(-6)} ha sido CANCELADO según lo solicitado o por inactividad. Si fue un error, puedes realizar uno nuevo en nuestro catálogo.`
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

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-amber-500 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Flujo de Pedidos</h2>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Monitoreo de Logística y Ventas Activas</p>
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
                                    <div>
                                        <p className="font-black text-neutral-900 dark:text-white uppercase italic text-sm tracking-tighter leading-none mb-1">Pedido #{order.id.slice(-6)}</p>
                                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
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
                                                <option value="Rechazado">Rechazado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>

                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <button
                                                    onClick={() => handleStatusChange(order, 'Rechazado')}
                                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all opacity-70 hover:opacity-100"
                                                >
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Rechazar Pago
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(order, 'Cancelado')}
                                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg border border-neutral-200 dark:border-zinc-700 font-bold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all opacity-70 hover:opacity-100"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Cancelar Pedido
                                                </button>
                                            </div>
                                        </div>



                                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-800">
                                            <h4 className="font-bold mb-4 text-neutral-900 dark:text-white">Items del Pedido</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => {
                                                    const product = item?.equipment;
                                                    const isInStock = product?.availabilityStatus === 'in-stock';
                                                    const isMadeToOrder = product?.availabilityStatus === 'made-to-order';

                                                    // Logic: Stock items can be dispatched as soon as payment is confirmed (Recibido)
                                                    // Production items follow the full cycle and only dispatch when order is in dispatch phase
                                                    const orderCanShipStock = order.status !== 'Pendiente de Aprobación' && order.status !== 'Rechazado' && order.status !== 'Cancelado';
                                                    const orderIsDispatched = order.status === 'Despachado' || order.status === 'En Envío' || order.status === 'Entregado';

                                                    const canDispatch = item.deliveryStatus === 'pending' && (
                                                        (isInStock && orderCanShipStock) ||
                                                        (isMadeToOrder && orderIsDispatched)
                                                    );

                                                    const isShipped = item.deliveryStatus === 'shipped';
                                                    const isDelivered = item.deliveryStatus === 'delivered';

                                                    // Badge classes
                                                    const itemTypeBadgeClass = isInStock
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';

                                                    const itemTypeLabel = isInStock ? 'STOCK ELITE' : 'A PRODUCCIÓN';

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
                                                                                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest">Est: {item.structureColor}</span>
                                                                            </div>
                                                                        )}
                                                                        {item.upholsteryColor && (
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-white/5">
                                                                                <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: item.upholsteryColor.toLowerCase() }} />
                                                                                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest">Tap: {item.upholsteryColor}</span>
                                                                            </div>
                                                                        )}
                                                                        {item.selectedWeight && (
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-white/5">
                                                                                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest">Peso: {item.selectedWeight}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        {item.deliveryStatus && (
                                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase italic tracking-widest ${getDeliveryStatusBadgeClass(item.deliveryStatus)}`}>
                                                                                {getDeliveryStatusText(item.deliveryStatus)}
                                                                            </span>
                                                                        )}
                                                                        {isInStock && !orderCanShipStock && item.deliveryStatus === 'pending' && (
                                                                            <p className="text-[9px] text-red-600 dark:text-red-500 font-bold uppercase italic tracking-tight">
                                                                                ⚠️ Pago no aprobado
                                                                            </p>
                                                                        )}
                                                                        {isMadeToOrder && !orderIsDispatched && item.deliveryStatus === 'pending' && (
                                                                            <p className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase italic tracking-tight">
                                                                                ⚠️ Pendiente de despacho general
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {!isDelivered ? (
                                                                    <>
                                                                        {!isShipped ? (
                                                                            <button
                                                                                onClick={() => canDispatch && onUpdateItemStatus(order.id, idx, 'shipped')}
                                                                                disabled={!canDispatch}
                                                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${getDispatchButtonClass(canDispatch, isShipped)}`}
                                                                            >
                                                                                Despachar
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => onUpdateItemStatus(order.id, idx, 'delivered')}
                                                                                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                                                                            >
                                                                                Marcar Entregado
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                        Entregado
                                                                    </div>
                                                                )}
                                                            </div>
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
                                                <p><span className="text-neutral-500 dark:text-neutral-400">Nombre:</span> <span className="text-neutral-900 dark:text-white font-medium">{order.customerInfo?.name || 'N/A'}</span></p>
                                                <p><span className="text-neutral-500 dark:text-neutral-400">Tel:</span> <a href={`tel:${order.customerInfo?.phone || ''}`} className="text-blue-600 dark:text-blue-400 underline">{order.customerInfo?.phone || 'N/A'}</a></p>
                                                <p><span className="text-neutral-500 dark:text-neutral-400">Ubicación:</span> <span className="text-neutral-900 dark:text-white">{order.customerInfo?.city || 'N/A'}, {order.customerInfo?.department || 'N/A'}</span></p>
                                                {order.customerInfo?.address && (
                                                    <p><span className="text-neutral-500 dark:text-neutral-400">Dirección:</span> <span className="text-neutral-900 dark:text-white">{order.customerInfo.address}</span></p>
                                                )}
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
                                                {/* WhatsApp Buttons */}
                                                {[
                                                    { label: 'Contacto General', icon: MessageSquare, msg: `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Te contacto de SAGFO sobre tu pedido #${order.id.slice(-6)}. ¿Cómo podemos ayudarte?` },
                                                    { label: 'Confirmar Pago', icon: DollarSign, msg: `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Confirmamos el recibo de tu pago para el pedido #${order.id.slice(-6)}. Tu equipo ya está en proceso de gestión.` },
                                                    { label: 'Notificar Despacho', icon: Truck, msg: `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Tu pedido #${order.id.slice(-6)} ha sido despachado y está en camino. ¡Pronto disfrutarás de tu equipo SAGFO elite!` },
                                                    { label: 'Notificar Rechazo', icon: AlertTriangle, msg: `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 Te informamos que tu pedido #${order.id.slice(-6)} ha sido RECHAZADO debido a inconvenientes con la verificación del pago. ❌` },
                                                    { label: 'Seguimiento Post-Venta', icon: Check, msg: `¡Hola ${order.customerInfo?.name || 'Cliente'}! 👋 ¿Cómo vas con tu nuevo equipo SAGFO? Nos encantaría saber tu opinión y si todo quedó como esperabas. ¡Tu satisfacción es nuestra prioridad elite! 🏅` }
                                                ].map((btn, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleWhatsAppMessage(
                                                            order.customerInfo?.phone || '',
                                                            btn.msg
                                                        )}
                                                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-[#25D366] transition-colors group"
                                                    >
                                                        <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">{btn.label}</span>
                                                        <btn.icon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                                    </button>
                                                ))}
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
                                                        <span className="text-neutral-500 dark:text-neutral-400">Total del Pedido:</span>
                                                        <span className="font-bold text-neutral-900 dark:text-white">
                                                            ${order.financials.totalOrderValue.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-neutral-500 dark:text-neutral-400">Pagado:</span>
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            ${order.financials.amountPaid.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 border-t border-neutral-100 dark:border-zinc-800">
                                                        <span className="text-neutral-500 dark:text-neutral-400">Pendiente:</span>
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
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full border border-neutral-200 dark:border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-4">Actualizar Estado</h3>
                        <textarea
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="Nota para el cliente..."
                            rows={4}
                            className="w-full px-6 py-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all mb-6"
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setStatusModalOpen(false)} className="flex-1 py-4 bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 rounded-xl font-black uppercase italic tracking-widest text-[10px] hover:bg-neutral-200 dark:hover:bg-white/10 transition-all">Cancelar</button>
                            <button onClick={confirmStatusChange} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
