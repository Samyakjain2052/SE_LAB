import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroupBuy } from '../context/GroupBuyContext';
import { Users, ShoppingBag } from 'lucide-react';

// Normally we would fetch the group by invite link
// For demo, we'll just use the first active group
const JoinGroupPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { groupBuys, joinGroupBuy } = useGroupBuy();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  // Find a group to join - in a real app, this would be fetched by the invite token
  const groupToJoin = token ? 
    // For demo, just use the first active group, or create a simulated one
    groupBuys.find(g => g.status === 'active') || 
    (groupBuys.length > 0 ? groupBuys[0] : null) 
    : null;
  
  useEffect(() => {
    // If no token or no groups, redirect to home
    if (!token || !groupToJoin) {
      navigate('/');
    }
  }, [token, groupToJoin, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupToJoin) return;
    
    setIsJoining(true);
    
    // Create a user and join the group
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || undefined
    };
    
    // Simulate API delay
    setTimeout(() => {
      joinGroupBuy(groupToJoin.id, newUser);
      navigate(`/group/${groupToJoin.id}`);
    }, 1000);
  };
  
  if (!groupToJoin) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="py-3 px-4 bg-purple-700 text-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="font-semibold">GroupBuy Invitation</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start mb-6">
              <img 
                src={groupToJoin.product.image} 
                alt={groupToJoin.product.name}
                className="w-20 h-20 object-cover rounded-lg mr-4 flex-shrink-0"
              />
              
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  {groupToJoin.product.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {groupToJoin.participants.length} of {groupToJoin.maxParticipants} participants
                  </span>
                </div>
                <p className="text-purple-700 font-medium">
                  Your share: ₹{Math.ceil(groupToJoin.product.price / groupToJoin.maxParticipants)}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              <span className="font-medium">{groupToJoin.creator.name}</span> has invited you to join this group buy. Fill in your details below to participate.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isJoining}
                className={`w-full mt-6 py-3 rounded-lg font-medium ${
                  isJoining 
                    ? 'bg-purple-400 text-white cursor-not-allowed' 
                    : 'bg-purple-700 text-white hover:bg-purple-800 transition-colors'
                }`}
              >
                {isJoining ? 'Joining...' : 'Join Group Buy'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage;