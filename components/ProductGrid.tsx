import React from 'react';
import { EquipmentItem } from '../types';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

interface ProductGridProps {
  products: EquipmentItem[];
  onProductClick: (product: EquipmentItem) => void;
  onToggleCompare: (product: EquipmentItem) => void;
  comparisonList: EquipmentItem[];
  isAdmin: boolean;
  onEditProduct: (product: EquipmentItem) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, onToggleCompare, comparisonList, isAdmin, onEditProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ScrollReveal key={product.id} delay={index % 4 * 0.1}>
          <ProductCard
            product={product}
            onClick={() => onProductClick(product)}
            onToggleCompare={() => onToggleCompare(product)}
            isComparing={!!comparisonList.find(item => item.id === product.id)}
            isAdmin={isAdmin}
            onEdit={() => onEditProduct(product)}
          />
        </ScrollReveal>
      ))}
    </div>
  );
};

export default ProductGrid;