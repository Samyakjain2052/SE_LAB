import React, { useState } from 'react';
import { parseProductLink } from '../utils/productParser';
import { Product } from '../types';
import { Link } from 'lucide-react';

interface ProductLinkFormProps {
  onProductParsed: (product: Product) => void;
}

const ProductLinkForm: React.FC<ProductLinkFormProps> = ({ onProductParsed }) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a product URL');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Validate URL format
      new URL(url); // Will throw if invalid
      
      const product = await parseProductLink(url);
      
      if (product) {
        onProductParsed(product);
      } else {
        setError('Could not extract product details from this link');
      }
    } catch (error) {
      setError('Please enter a valid URL');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Start a Group Buy</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Paste product link from any e-commerce site
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="productUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.amazon.in/product/..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-purple-400 text-white cursor-not-allowed'
              : 'bg-purple-700 text-white hover:bg-purple-800'
          }`}
        >
          {isLoading ? 'Fetching Product...' : 'Fetch Product Details'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Works with Amazon, Flipkart, and other major e-commerce sites</p>
      </div>
    </div>
  );
};

export default ProductLinkForm;