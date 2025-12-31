import React, { useState } from 'react';
import { EquipmentItem, Order, Event, GalleryImage, Profile, BankAccount, OrderStatus, DeliveryStatus } from '../types';
import { Menu } from 'lucide-react';
import AdminSidebar from './admin/AdminSidebar';
import AdminOverview from './admin/AdminOverview';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import AdminEvents from './admin/AdminEvents';
import AdminGallery from './admin/AdminGallery';
import AdminWhatsApp from './admin/AdminWhatsApp';
import AdminSettings from './admin/AdminSettings';
import AdminDebts from './admin/AdminDebts';
import AdminBulkPrices from './admin/AdminBulkPrices';
import AdminQuotes from './admin/AdminQuotes';

interface AdminDashboardProps {
    products?: EquipmentItem[];
    orders?: Order[];
    events?: Event[];
    galleryImages?: GalleryImage[];
    profiles?: Profile[];
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
    onUpdateItemStatus?: (orderId: string, itemIndex: number, status: DeliveryStatus) => void;
    onDeleteProduct: (productId: string) => void;
    onUploadSeal: (file: File) => void;
    onSaveProduct: (product: EquipmentItem) => void;
    onAdminViewToggle: () => void;
    onLogout: () => void;
    onOptimizeImages?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    products = [],
    orders = [],
    events = [],
    galleryImages = [],
    profiles = [],
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
    bankAccounts = [],
    onAddBankAccount,
    onDeleteBankAccount,
    sealUrl,
    onUpdateSeal,
    onUpdateItemStatus,
    onDeleteProduct,
    onUploadSeal,
    onSaveProduct,
    onAdminViewToggle,
    onLogout,
    onOptimizeImages
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'events' | 'gallery' | 'settings' | 'whatsapp' | 'debts' | 'bulk-prices' | 'quotes'>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);



    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-black dark:to-neutral-950 flex relative">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onAdminViewToggle={onAdminViewToggle}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Mobile Header with Hamburger */}
            <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-neutral-100 dark:border-white/5 px-4 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-3 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/20 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <img src="/logo-light.png" alt="Logo" className="h-8 w-auto object-contain dark:hidden" />
                        <img src="/logo-sf.png" alt="Logo" className="h-8 w-auto object-contain hidden dark:block" />
                    </div>
                    <div className="w-12" /> {/* Spacer for centering */}
                </div>
            </div>

            <main className="flex-1 ml-0 lg:ml-72 p-6 pt-24 lg:pt-12 lg:p-20 overflow-y-auto min-h-screen no-scrollbar relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {activeTab === 'overview' && (
                            <AdminOverview
                                orders={orders}
                                products={products}
                                profiles={profiles}
                                onViewOrders={() => setActiveTab('orders')}
                            />
                        )}
                        {activeTab === 'products' && (
                            <AdminProducts
                                products={products}
                                onEditProduct={onEditProduct}
                                onDeleteProduct={onDeleteProduct}
                                onOpenCreateProductModal={onOpenCreateProductModal}
                            />
                        )}
                        {activeTab === 'orders' && (
                            <AdminOrders
                                orders={orders}
                                profiles={profiles}
                                onUpdateOrderStatus={onUpdateOrderStatus}
                                onUpdateItemStatus={onUpdateItemStatus || (() => { })}
                            />
                        )}
                        {activeTab === 'users' && (
                            <AdminUsers
                                profiles={profiles}
                                onOpenUserModal={onOpenUserModal}
                                onDeleteProfile={onDeleteProfile}
                            />
                        )}
                        {activeTab === 'events' && (
                            <AdminEvents
                                events={events}
                                onOpenEventModal={onOpenEventModal}
                                onDeleteEvent={onDeleteEvent}
                            />
                        )}
                        {activeTab === 'gallery' && (
                            <AdminGallery
                                galleryImages={galleryImages}
                                onViewProducts={() => setActiveTab('products')}
                            />
                        )}
                        {activeTab === 'whatsapp' && (
                            <AdminWhatsApp
                                orders={orders}
                            />
                        )}
                        {activeTab === 'settings' && (
                            <AdminSettings
                                whatsAppNumber={whatsAppNumber}
                                onUpdateWhatsAppNumber={onUpdateWhatsAppNumber}
                                onEditHero={onEditHero}
                                bankAccounts={bankAccounts}
                                onAddBankAccount={onAddBankAccount}
                                onDeleteBankAccount={onDeleteBankAccount}
                                sealUrl={sealUrl}
                                onUpdateSeal={onUpdateSeal}
                                onUploadSeal={onUploadSeal}
                                onOptimizeImages={onOptimizeImages}
                            />
                        )}
                        {activeTab === 'debts' && (
                            <AdminDebts
                                orders={orders}
                            />
                        )}

                        {activeTab === 'bulk-prices' && (
                            <AdminBulkPrices
                                products={products}
                                onSaveProduct={onSaveProduct}
                            />
                        )}
                        {activeTab === 'quotes' && (
                            <AdminQuotes
                                orders={orders}
                                products={products}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
