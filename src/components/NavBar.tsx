import React from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-purple-700" />
            <span className="text-xl font-bold text-purple-700">GroupBuy</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/my-groups" className="text-gray-600 hover:text-purple-700 transition-colors">
                  My Groups
                </Link>
                <Link to="/profile" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;