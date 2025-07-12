
import { useState } from 'react';
import { MapPin, Star, Clock, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SkillCardProps {
  user: any;
  currentUser: any;
  onRequest: (userId: number) => void;
  onClick: (user: any) => void;
}

const SkillCard = ({ user, currentUser, onRequest, onClick }: SkillCardProps) => {
  const handleRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please login to request skills');
      return;
    }
    onRequest(user.id);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200"
      onClick={() => onClick(user)}
    >
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

        {/* Availability */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Clock className="w-4 h-4 mr-2" />
          Available: {user.availability}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleRequest}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!currentUser}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Request
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClick(user);
            }}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{user.completedSwaps} completed swaps</span>
            <span className={`font-medium ${user.isPublic ? 'text-green-600' : 'text-orange-600'}`}>
              {user.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
