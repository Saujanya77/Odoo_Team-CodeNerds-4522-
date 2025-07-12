import { useState, useEffect } from 'react';
import { Users, Zap, Shield, Heart } from 'lucide-react';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import SkillCard from '@/components/SkillCard';
import ProfileModal from '@/components/ProfileModal';
import RequestModal from '@/components/RequestModal';
import AdminDashboard from '@/components/AdminDashboard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import {registerUser,sendLoginOTP,verifyLoginOTP} from '@/utils/api';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://skillswap-backend-mt2t.onrender.com/api/user/');
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = (userData: any) => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      setCurrentUser(existingUser);
    } else {
      const newUser = {
        ...userData,
        id: users.length + 1,
        skillsOffered: userData.skillsOffered || [],
        skillsWanted: userData.skillsWanted || [],
        rating: 5.0,
        completedSwaps: 0,
        isPublic: true
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    }
    setShowLoginModal(false);
  };

  // Other existing functions...

  const filteredUsers = users.filter(user => 
    !user.isAdmin && (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // If admin is logged in, show admin dashboard
  if (currentUser?.isAdmin) {
    function handleUpdateUserSkills(userId: number, skillsOffered: string[], skillsWanted: string[]): void {
      throw new Error('Function not implemented.');
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={currentUser} onLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
        <AdminDashboard 
          requests={requests} 
          users={users.filter(u => !u.isAdmin)}
          onUpdateRequest={handleRequest}
          onViewProfile={handleViewProfile}
        />
        
        <ProfileModal
          user={selectedUser}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onRequest={handleRequest}
          currentUser={currentUser}
          onUpdateSkills={handleUpdateUserSkills}
        />
      </div>
    );
  }

  function handleViewProfile(user: any): void {
    throw new Error('Function not implemented.');
  }

  function handleRequest(userId: number): void {
    throw new Error('Function not implemented.');
  }

  function handleSearch(query: string): void {
    throw new Error('Function not implemented.');
  }

  function handleLogout(): void {
    throw new Error('Function not implemented.');
  }

  function handleUpdateUserSkills(userId: number, skillsOffered: string[], skillsWanted: string[]): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} onLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Swap Skills, Build
            <span className="text-blue-200"> Community</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Connect with talented individuals, exchange skills, and grow together in our professional skill-sharing platform
          </p>
          {!currentUser && (
            <Button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
            >
              Get Started Today
            </Button>
          )}
        </div>

      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} onFilter={() => {}} />
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Skills ({filteredUsers.length})
          </h2>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <SkillCard
                key={user.id}
                user={user}
                currentUser={currentUser}
                onRequest={handleRequest}
                onClick={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <ProfileModal
        user={selectedUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onRequest={handleRequest}
        currentUser={currentUser}
        onUpdateSkills={handleUpdateUserSkills}
      />

      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        targetUser={selectedUser}
        currentUser={currentUser}
        onSubmit={handleRequest}
      />

    {/* Footer */}
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkillSwap?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who are already growing their skills through meaningful exchanges
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">Find like-minded professionals in your area or globally</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Exchange</h3>
            <p className="text-gray-600">Trade skills and knowledge in mutually beneficial swaps</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">Safe and verified platform with admin oversight</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow</h3>
            <p className="text-gray-600">Expand your skillset and build lasting professional relationships</p>
          </div>
        </div>
      </div>
    </div>
  );
  </div>
  );
}

export default Index;
