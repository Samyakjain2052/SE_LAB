import React, { useState } from 'react';
import ProductLinkForm from '../components/ProductLinkForm';
import ProductDetails from '../components/ProductDetails';
import GroupBuyDetails from '../components/GroupBuyDetails';
import { Product } from '../types';
import { useGroupBuy } from '../context/GroupBuyContext';
import { ShoppingBag, TrendingUp, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const [parsedProduct, setParsedProduct] = useState<Product | null>(null);
  const { currentGroupBuy } = useGroupBuy();
  
  const handleProductParsed = (product: Product) => {
    setParsedProduct(product);
  };
  
  const resetFlow = () => {
    setParsedProduct(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="container mx-auto px-4">
        {/* Show the current flow step */}
        {!parsedProduct && !currentGroupBuy && (
          <>
            <div className="max-w-3xl mx-auto text-center mb-10 pt-10">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-purple-700" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Shop Together, Save Together
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Create group buys for any product from any e-commerce site. Split the cost and shop with friends.
              </p>
            </div>

            <div className="mb-16">
              <ProductLinkForm onProductParsed={handleProductParsed} />
            </div>
            
            {/* How it works section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">How it works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-700 mb-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Share any product</h3>
                  <p className="text-gray-600">
                    Paste a link from any e-commerce site. We'll automatically extract the product details.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Split the cost</h3>
                  <p className="text-gray-600">
                    Invite friends to join your group buy. We'll divide the price evenly among all participants.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Purchase together</h3>
                  <p className="text-gray-600">
                    Once everyone has paid their share, confirm the purchase and we'll place the order.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {parsedProduct && !currentGroupBuy && (
          <ProductDetails product={parsedProduct} onBack={resetFlow} />
        )}
        
        {currentGroupBuy && (
          <GroupBuyDetails groupBuy={currentGroupBuy} />
        )}
      </div>
    </div>
  );
};

export default HomePage;