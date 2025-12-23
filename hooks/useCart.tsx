import { useState, useEffect } from 'react';
import { EquipmentItem, CartItem } from '../types';

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load from localStorage on initialization
    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error parsing cart items:', error);
            }
        }
    }, []);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

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
            const existingItemIndex = newCartItems.findIndex(item =>
                item.equipment.id === itemToAdd.equipment.id &&
                item.selectedColor === itemToAdd.selectedColor &&
                item.selectedWeight === itemToAdd.selectedWeight
            );
            if (existingItemIndex > -1) {
                newCartItems[existingItemIndex].quantity += itemToAdd.quantity;
            } else {
                newCartItems.push(itemToAdd);
            }
        });
        setCartItems(newCartItems);
        setIsCartOpen(true);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        handleAddToCart,
        handleUpdateCartItemCustomization,
        handleRemoveFromCart,
        handleUpdateQuantity,
        handleAddPackageToCart,
        clearCart
    };
};
