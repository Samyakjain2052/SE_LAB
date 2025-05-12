import React, { useState } from 'react';
import { GroupBuy } from '../types';
import { formatCurrency } from '../utils/productParser';
import { useGroupBuy } from '../context/GroupBuyContext';
import { Share2, Check, ShoppingCart, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GroupBuyDetailsProps {
  groupBuy: GroupBuy;
}

const GroupBuyDetails: React.FC<GroupBuyDetailsProps> = ({ groupBuy }) => {
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { confirmPayment, confirmPurchase } = useGroupBuy();
  const { user: currentUser } = useAuth();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(groupBuy.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paidCount = groupBuy.participants.filter(p => 
    p.status === 'paid' || p.status === 'confirmed'
  ).length;
  
  const percentageFunded = Math.min(
    100, 
    Math.round((paidCount / groupBuy.maxParticipants) * 100)
  );
  
  const allPaid = percentageFunded === 100;
  
  const currentParticipant = groupBuy.participants.find(
    p => p.user.id === currentUser?.id
  );

  const handlePayment = () => {
    if (currentUser) {
      confirmPayment(groupBuy.id, currentUser.id);
    }
  };
  
  const handleConfirmPurchase = () => {
    confirmPurchase(groupBuy.id);
    setShowConfirmation(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-lg mx-auto">
      {/* Status banner */}
      <div className={`px-4 py-2 text-white text-center text-sm font-medium ${
        groupBuy.status === 'complete' 
          ? 'bg-green-500' 
          : groupBuy.status === 'collecting' 
            ? 'bg-teal-500' 
            : 'bg-purple-700'
      }`}>
        {groupBuy.status === 'complete' && 'Purchase Completed!'}
        {groupBuy.status === 'collecting' && 'All participants have paid! Ready to purchase.'}
        {groupBuy.status === 'active' && 'Group Buy Active - Collecting Participants'}
      </div>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="sm:w-1/3">
            <img 
              src={groupBuy.product.image} 
              alt={groupBuy.product.name}
              className="w-full h-auto rounded-lg object-cover aspect-square"
            />
          </div>
          
          <div className="sm:w-2/3">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-2 capitalize">
              {groupBuy.product.source}
            </span>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {groupBuy.product.name}
            </h2>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {formatCurrency(groupBuy.product.price)}
            </p>
            <p className="text-sm text-purple-700 font-medium">
              {formatCurrency(groupBuy.amountPerPerson)} per person
            </p>
          </div>
        </div>

        {/* Progress section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Funding Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              {paidCount}/{groupBuy.maxParticipants} paid
            </span>
          </div>
          
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${percentageFunded}%` }}
            ></div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {percentageFunded}% funded
            </span>
            <span className="text-sm text-gray-600">
              Expires {new Date(groupBuy.expiresAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Share section */}
        {groupBuy.status === 'active' && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Share with participants</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={groupBuy.inviteLink}
                className="flex-1 py-2 px-3 bg-white border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors flex items-center"
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Share2 className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-2 flex space-x-2">
              <a
                href={`https://wa.me/?text=Join my group buy: ${encodeURIComponent(groupBuy.inviteLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 flex justify-center items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Share via WhatsApp
              </a>
              <a
                href={`sms:?body=Join my group buy: ${encodeURIComponent(groupBuy.inviteLink)}`}
                className="flex-1 py-2 flex justify-center items-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Share via SMS
              </a>
            </div>
          </div>
        )}
        
        {/* Participants */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Participants</h3>
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
            {groupBuy.participants.map((participant, index) => (
              <div key={index} className="py-3 px-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {participant.user.name}
                    {participant.user.id === groupBuy.creator.id && (
                      <span className="ml-2 text-xs py-0.5 px-1.5 bg-purple-100 text-purple-700 rounded">Creator</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{participant.user.email}</p>
                </div>
                <span className={`text-sm font-medium ${
                  participant.status === 'confirmed' 
                    ? 'text-green-500' 
                    : participant.status === 'paid' 
                      ? 'text-teal-500' 
                      : 'text-gray-500'
                }`}>
                  {participant.status === 'confirmed' && 'Confirmed'}
                  {participant.status === 'paid' && 'Paid'}
                  {participant.status === 'joined' && 'Joined'}
                  {participant.status === 'invited' && 'Invited'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons and status messages */}
        <div className="space-y-3">
          {groupBuy.status === 'active' && (
            <>
              {currentParticipant && currentParticipant.status === 'joined' && (
                <button
                  onClick={handlePayment}
                  className="w-full py-3 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Pay My Share ({formatCurrency(groupBuy.amountPerPerson)})
                </button>
              )}
              {currentParticipant && currentParticipant.status === 'paid' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-center">
                  You have paid your share. Waiting for others to pay.
                </div>
              )}
              {currentParticipant && currentParticipant.status === 'confirmed' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-center">
                  You have paid and the order is confirmed!
                </div>
              )}
              {!currentParticipant && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-600 text-center">
                  You are not a participant in this group buy.
                </div>
              )}
              {currentParticipant && currentParticipant.user.id === groupBuy.creator.id && paidCount < groupBuy.maxParticipants && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-center">
                  Waiting for all participants to pay before confirming the order.
                </div>
              )}
            </>
          )}
          
          {groupBuy.status === 'collecting' && (
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-3 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Confirm Purchase
            </button>
          )}
          
          {groupBuy.status === 'complete' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Purchase completed!</p>
                <p className="text-sm text-green-700">
                  The order has been placed successfully. Check your email for confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Confirm Purchase</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              You're about to confirm the purchase of {groupBuy.product.name} for a total of {formatCurrency(groupBuy.product.price)}. This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 py-2 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupBuyDetails;