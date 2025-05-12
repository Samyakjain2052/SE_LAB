import React from 'react';
import { GroupBuy } from '../types';
import { formatCurrency } from '../utils/productParser';
import { Clock, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GroupBuyCardProps {
  groupBuy: GroupBuy;
}

const GroupBuyCard: React.FC<GroupBuyCardProps> = ({ groupBuy }) => {
  const paidCount = groupBuy.participants.filter(p => 
    p.status === 'paid' || p.status === 'confirmed'
  ).length;
  
  const percentageFunded = Math.min(
    100, 
    Math.round((paidCount / groupBuy.maxParticipants) * 100)
  );
  
  return (
    <Link 
      to={`/group/${groupBuy.id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img 
          src={groupBuy.product.image} 
          alt={groupBuy.product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          groupBuy.status === 'complete' 
            ? 'bg-green-500 text-white' 
            : groupBuy.status === 'collecting' 
              ? 'bg-teal-500 text-white' 
              : 'bg-white text-purple-700'
        }`}>
          {groupBuy.status === 'complete' && 'Completed'}
          {groupBuy.status === 'collecting' && 'Ready to Purchase'}
          {groupBuy.status === 'active' && 'Active'}
        </div>
      </div>
      
      <div className="p-4">
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-2 capitalize">
          {groupBuy.product.source}
        </span>
        
        <h3 className="text-gray-800 font-medium line-clamp-2 mb-2">
          {groupBuy.product.name}
        </h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-purple-700 font-medium">
            {formatCurrency(groupBuy.amountPerPerson)}
            <span className="text-gray-500 text-sm font-normal"> / person</span>
          </span>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{paidCount}/{groupBuy.maxParticipants}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full ${
              percentageFunded === 100 
                ? 'bg-green-500' 
                : 'bg-teal-500'
            } transition-all duration-500 ease-out`}
            style={{ width: `${percentageFunded}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          {groupBuy.status !== 'complete' ? (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Expires {new Date(groupBuy.expiresAt).toLocaleDateString()}</span>
            </div>
          ) : (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Purchased on {new Date(groupBuy.expiresAt).toLocaleDateString()}</span>
            </div>
          )}
          
          <span>{percentageFunded}% funded</span>
        </div>
      </div>
    </Link>
  );
};

export default GroupBuyCard;