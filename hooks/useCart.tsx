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

    const handleAddToCart = (product: EquipmentItem, color?: string, weight?: string, structureColor?: string, upholsteryColor?: string) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item =>
                item.equipment.id === product.id &&
                item.selectedColor === color &&
                item.selectedWeight === weight &&
                item.structureColor === structureColor &&
                item.upholsteryColor === upholsteryColor
            );

            if (existingItem) {
                return prevItems.map(item =>
                    (item.equipment.id === product.id &&
                        item.selectedColor === color &&
                        item.selectedWeight === weight &&
                        item.structureColor === structureColor &&
                        item.upholsteryColor === upholsteryColor)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, {
                cartItemId: Math.random().toString(36).substr(2, 9),
                equipment: product,
                quantity: 1,
                selectedColor: color,
                selectedWeight: weight,
                structureColor: structureColor || color,
                upholsteryColor: upholsteryColor
            }];
        });
    };

    const handleUpdateCartItemCustomization = (cartItemId: string, field: 'structureColor' | 'upholsteryColor' | 'selectedColor', value: string) => {
        setCartItems(prev => prev.map(item =>
            (item.cartItemId === cartItemId)
                ? { ...item, [field]: value }
                : item
        ));
    };

    const handleRemoveFromCart = (cartItemId: string) => {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(cartItemId);
            return;
        }
        setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item));
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
