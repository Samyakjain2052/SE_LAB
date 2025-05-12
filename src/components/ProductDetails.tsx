import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency, calculateSplitAmount } from '../utils/productParser';
import { useGroupBuy } from '../context/GroupBuyContext';
import { Minus, Plus, Users } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const [participants, setParticipants] = useState<number>(2);
  const { createGroupBuy } = useGroupBuy();
  
  const increaseParticipants = () => {
    if (participants < 10) {
      setParticipants(participants + 1);
    }
  };
  
  const decreaseParticipants = () => {
    if (participants > 2) {
      setParticipants(participants - 1);
    }
  };
  
  const handleCreateGroupBuy = () => {
    createGroupBuy(product, participants);
  };
  
  const amountPerPerson = calculateSplitAmount(product.price, participants);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-lg mx-auto animate-fadeIn">
      <div className="mb-4">
        <button 
          onClick={onBack}
          className="text-purple-700 hover:text-purple-900 font-medium transition-colors"
        >
          ← Back to product link
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="sm:w-1/3">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover aspect-square"
          />
        </div>
        
        <div className="sm:w-2/3">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-2 capitalize">
            {product.source}
          </span>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-4">Create Group Buy</h3>
        
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              <span>Number of participants</span>
            </label>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={decreaseParticipants}
                disabled={participants <= 2}
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  participants <= 2 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="text-lg font-semibold text-gray-800 w-6 text-center">
                {participants}
              </span>
              
              <button 
                onClick={increaseParticipants}
                disabled={participants >= 10}
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  participants >= 10 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total amount:</span>
              <span className="font-semibold">{formatCurrency(product.price)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Split among:</span>
              <span className="font-semibold">{participants} people</span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-700">Amount per person:</span>
              <span className="font-bold text-purple-700">{formatCurrency(amountPerPerson)}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCreateGroupBuy}
          className="w-full py-3 px-4 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors"
        >
          Create Group Buy
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;