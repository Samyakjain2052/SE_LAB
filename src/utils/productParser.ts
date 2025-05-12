import { Product } from '../types';

// This function would normally use a backend service with web scraping
// For demo purposes, we're simulating the response
export const parseProductLink = async (url: string): Promise<Product | null> => {
  try {
    // Mock implementation - in a real app, this would call a backend API
    // that handles web scraping and product data extraction
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Determine source based on URL
    let source: 'amazon' | 'flipkart' | 'other' = 'other';
    if (hostname.includes('amazon')) {
      source = 'amazon';
    } else if (hostname.includes('flipkart')) {
      source = 'flipkart';
    }
    
    // In a real app, we would extract the product ID from the URL
    // and use it to fetch product details from a backend API
    
    // For demo purposes, return mock data
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: source === 'amazon' 
        ? 'Amazon Echo Dot (4th Gen) Smart Speaker' 
        : 'Samsung Galaxy S22 Ultra 5G (Phantom Black, 12GB, 256GB Storage)',
      price: source === 'amazon' ? 3499 : 109999,
      image: source === 'amazon' 
        ? 'https://images.pexels.com/photos/4790251/pexels-photo-4790251.jpeg?auto=compress&cs=tinysrgb&w=800' 
        : 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: source === 'amazon'
        ? 'Smart speaker with Alexa | Improved bass and clearer sound' 
        : '12GB RAM, 256GB Storage, 108MP Camera, S Pen included',
      url: url,
      source: source
    };
  } catch (error) {
    console.error('Error parsing product link:', error);
    return null;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateSplitAmount = (price: number, participants: number): number => {
  return Math.ceil(price / participants);
};