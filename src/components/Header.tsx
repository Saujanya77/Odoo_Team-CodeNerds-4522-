
import { useState } from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">SkillSwap</h1>
          </div>

          

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.profilePhotoUrl || '/api/placeholder/32/32'} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  {user.isAdmin && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Admin</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={onLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Browse Skills</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">My Requests</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Messages</a>
              {user ? (
                <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.profilePhoto || '/api/placeholder/32/32'} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={onLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
