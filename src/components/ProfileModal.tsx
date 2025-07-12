import { useState } from 'react';
import { X, MapPin, Star, Clock, Calendar, Award, Eye, EyeOff, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  profilePhoto?: string;
  location?: string;
  rating?: number;
  completedSwaps?: number;
  isPublic?: boolean;
  skillsOffered?: string[];
  skillsWanted?: string[];
  availability?: string;
  isAdmin?: boolean;
  email?: string;
}

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onRequest: (userId: number) => void;
  currentUser: User | null;
  onUpdateSkills?: (userId: number, skillsOffered: string[], skillsWanted: string[]) => void;
}

const ProfileModal = ({ user, isOpen, onClose, onRequest, currentUser, onUpdateSkills }: ProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  if (!isOpen || !user) return null;

  const isOwnProfile = currentUser && currentUser.id === user.id;
  const isAdminView = currentUser?.isAdmin;

  const handleEditStart = () => {
    setSkillsOffered([...(user.skillsOffered || [])]);
    setSkillsWanted([...(user.skillsWanted || [])]);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setNewSkillOffered('');
    setNewSkillWanted('');
  };

  const handleEditSave = () => {
    if (onUpdateSkills) {
      onUpdateSkills(user.id, skillsOffered, skillsWanted);
    }
    setIsEditing(false);
    setNewSkillOffered('');
    setNewSkillWanted('');
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setSkillsOffered(skillsOffered.filter((_, i) => i !== index));
  };

  const removeSkillWanted = (index: number) => {
    setSkillsWanted(skillsWanted.filter((_, i) => i !== index));
  };

  const handleRequest = () => {
    if (!currentUser) {
      alert('Please login to request skills');
      return;
    }
    onRequest(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={user.profilePhoto || '/api/placeholder/80/80'}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                {user.location && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium text-gray-900">{user.rating}</span>
                    <span className="text-gray-500 ml-1">({user.completedSwaps} swaps)</span>
                  </div>
                  <div className="flex items-center">
                    {user.isPublic ? (
                      <Eye className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-orange-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${user.isPublic ? 'text-green-600' : 'text-orange-600'}`}>
                      {user.isPublic ? 'Public Profile' : 'Private Profile'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOwnProfile && !isEditing && (
                <Button variant="outline" size="sm" onClick={handleEditStart}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{user.completedSwaps}</div>
              <div className="text-sm text-blue-700">Completed Swaps</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{user.rating}</div>
              <div className="text-sm text-green-700">Average Rating</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{user.skillsOffered?.length || 0}</div>
              <div className="text-sm text-purple-700">Skills Offered</div>
            </div>
          </div>

          {/* Skills Offered */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Skills Offered</h3>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {skillsOffered.map((skill, index) => (
                    <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2">
                      <span className="font-medium">{skill}</span>
                      <button
                        onClick={() => removeSkillOffered(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you can offer"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  />
                  <Button onClick={addSkillOffered} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  user.skillsOffered.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills offered yet</p>
                )}
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Skills Wanted</h3>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {skillsWanted.map((skill, index) => (
                    <div key={index} className="flex items-center bg-green-100 text-green-800 rounded-full px-4 py-2">
                      <span className="font-medium">{skill}</span>
                      <button
                        onClick={() => removeSkillWanted(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <Button onClick={addSkillWanted} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted && user.skillsWanted.length > 0 ? (
                  user.skillsWanted.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills wanted yet</p>
                )}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2" />
              {user.availability || 'Not specified'}
            </div>
          </div>

          {/* Contact Information - Only show for admin */}
          {isAdminView && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleEditSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEditCancel}
                  className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {!isAdminView && !isOwnProfile && (
                  <Button
                    onClick={handleRequest}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={!currentUser}
                  >
                    Request Skill Swap
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
              </>
            )}
          </div>

          {!currentUser && !isAdminView && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Please login to request skill swaps
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;