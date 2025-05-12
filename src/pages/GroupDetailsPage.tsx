import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroupBuy } from '../context/GroupBuyContext';
import GroupBuyDetails from '../components/GroupBuyDetails';

const GroupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { findGroupBuyById, setCurrentGroupBuy } = useGroupBuy();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const groupBuy = findGroupBuyById(id);
      if (groupBuy) {
        setCurrentGroupBuy(groupBuy);
      } else {
        // Group buy not found, redirect to home
        navigate('/');
      }
    }
    
    // Clean up
    return () => {
      setCurrentGroupBuy(null);
    };
  }, [id, findGroupBuyById, navigate, setCurrentGroupBuy]);
  
  const groupBuy = id ? findGroupBuyById(id) : null;
  
  if (!groupBuy) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Group Buy Not Found</h2>
          <p className="text-gray-600 mb-4">The group buy you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/my-groups')}
            className="text-purple-700 hover:text-purple-900 font-medium transition-colors"
          >
            ← Back to My Groups
          </button>
        </div>
        
        <GroupBuyDetails groupBuy={groupBuy} />
      </div>
    </div>
  );
};

export default GroupDetailsPage;