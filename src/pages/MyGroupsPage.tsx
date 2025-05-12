import React from 'react';
import { useGroupBuy } from '../context/GroupBuyContext';
import GroupBuyCard from '../components/GroupBuyCard';
import { ShoppingBag, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyGroupsPage: React.FC = () => {
  const { groupBuys } = useGroupBuy();
  
  const activeGroups = groupBuys.filter(group => 
    group.status === 'active' || group.status === 'collecting'
  );
  
  const completedGroups = groupBuys.filter(group => 
    group.status === 'complete'
  );
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Group Buys</h1>
            
            <Link
              to="/"
              className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Group Buy
            </Link>
          </div>
          
          {groupBuys.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-700 mx-auto mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Group Buys Yet</h2>
              <p className="text-gray-600 mb-6">You haven't created or joined any group buys yet.</p>
              <Link
                to="/"
                className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Your First Group Buy
              </Link>
            </div>
          ) : (
            <>
              {/* Active Groups */}
              {activeGroups.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Group Buys</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeGroups.map(groupBuy => (
                      <GroupBuyCard key={groupBuy.id} groupBuy={groupBuy} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Completed Groups */}
              {completedGroups.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Group Buys</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedGroups.map(groupBuy => (
                      <GroupBuyCard key={groupBuy.id} groupBuy={groupBuy} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGroupsPage;