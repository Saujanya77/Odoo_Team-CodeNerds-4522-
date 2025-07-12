
import { useState } from 'react';
import { Eye, Check, X, Clock, User, Star, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardProps {
  requests: any[];
  users: any[];
  onUpdateRequest: (requestId: number, status: 'accepted' | 'rejected') => void;
  onViewProfile: (user: any) => void;
}

const AdminDashboard = ({ requests, users, onUpdateRequest, onViewProfile }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [filter, setFilter] = useState('all');

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage requests and view user profiles</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeTab === 'requests' ? "default" : "ghost"}
            onClick={() => setActiveTab('requests')}
            className={`flex-1 ${
              activeTab === 'requests' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Skill Requests
          </Button>
          <Button
            variant={activeTab === 'users' ? "default" : "ghost"}
            onClick={() => setActiveTab('users')}
            className={`flex-1 ${
              activeTab === 'users' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User Profiles
          </Button>
        </div>
      </div>

      {activeTab === 'requests' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Check className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'accepted').length}
                  </p>
                  <p className="text-sm text-gray-600">Accepted</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <X className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "ghost"}
                  onClick={() => setFilter(status)}
                  className={`flex-1 capitalize ${
                    filter === status 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'No skill swap requests yet.' : `No ${filter} requests.`}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Request Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={request.fromUser.profilePhoto || '/api/placeholder/48/48'}
                            alt={request.fromUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.fromUser.name}</h3>
                            <p className="text-sm text-gray-600">
                              wants to swap with {request.toUser.name}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(request.status)} border-0`}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </span>
                        </Badge>
                      </div>

                      {/* Skills Offered */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.skillsOffered?.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Target User Skills */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Requesting Skills From</h4>
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                            src={request.toUser.profilePhoto || '/api/placeholder/32/32'}
                            alt={request.toUser.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900">{request.toUser.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {request.toUser.skillsOffered.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            {request.message}
                          </p>
                        </div>
                      )}

                      {/* Request Date */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      onClick={() => onViewProfile(request.fromUser)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Requester Profile
                    </Button>

                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => onUpdateRequest(request.id, 'rejected')}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => onUpdateRequest(request.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length > 0 ? (users.reduce((sum, user) => sum + user.rating, 0) / users.length).toFixed(1) : '0.0'}
                  </p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Check className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.reduce((sum, user) => sum + user.completedSwaps, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Swaps</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profilePhoto || '/api/placeholder/60/60'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        {user.location && (
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{user.rating}</span>
                    </div>
                  </div>

                  {/* Skills Offered */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsOffered.slice(0, 3).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skillsOffered.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{user.skillsOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Wanted</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsWanted.slice(0, 3).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skillsWanted.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{user.skillsWanted.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 mb-4">
                    <Button
                      onClick={() => onViewProfile(user)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{user.completedSwaps} completed swaps</span>
                      <span className={`font-medium ${user.isPublic ? 'text-green-600' : 'text-orange-600'}`}>
                        {user.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
