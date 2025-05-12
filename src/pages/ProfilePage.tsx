import React from 'react';
import { User as UserIcon, Mail, Phone, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No user data found. Please sign in.</p>
      </div>
    );
  }

  // Supabase user metadata
  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : '';
  const phone = user.phone || user.user_metadata?.phone || '';
  const name = user.user_metadata?.name || user.email;

  const handleSignOut = async () => {
    await signOut();
    // Optionally, redirect to home or login page
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-8">
                <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center mr-6">
                  <UserIcon className="h-10 w-10 text-purple-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                  {joinedDate && (
                    <p className="text-gray-500">Member since {joinedDate}</p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>
                {phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-gray-800">{phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-6 border-t border-gray-200">
                <button
                  className="w-full sm:w-auto py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          {/* You can keep or remove the Payment Methods and E-commerce Accounts sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;