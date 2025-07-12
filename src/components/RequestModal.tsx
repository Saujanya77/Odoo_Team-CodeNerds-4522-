
import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: any;
  currentUser: any;
  onSubmit: (requestData: any) => void;
}

const RequestModal = ({ isOpen, onClose, targetUser, currentUser, onSubmit }: RequestModalProps) => {
  const [mySkills, setMySkills] = useState<string[]>(['']);
  const [message, setMessage] = useState('');

  if (!isOpen || !targetUser) return null;

  const addSkillField = () => {
    setMySkills([...mySkills, '']);
  };

  const removeSkillField = (index: number) => {
    if (mySkills.length > 1) {
      setMySkills(mySkills.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (index: number, value: string) => {
    const updated = [...mySkills];
    updated[index] = value;
    setMySkills(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSkills = mySkills.filter(skill => skill.trim() !== '');
    
    if (filteredSkills.length === 0) {
      alert('Please add at least one skill you can offer');
      return;
    }

    const requestData = {
      id: Date.now(),
      fromUser: currentUser,
      toUser: targetUser,
      skillsOffered: filteredSkills,
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmit(requestData);
    
    // Reset form
    setMySkills(['']);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Request Skill Swap</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Target User Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={targetUser.profilePhoto || '/api/placeholder/48/48'}
                alt={targetUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{targetUser.name}</h3>
                <p className="text-sm text-gray-600">
                  Skills available: {targetUser.skillsOffered.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skills I Can Offer */}
            <div>
              <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                Skills I Can Offer
              </Label>
              <div className="space-y-3">
                {mySkills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder="Enter a skill (e.g., Web Development, Photography)"
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required={index === 0}
                    />
                    {mySkills.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkillField(index)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkillField}
                  className="w-full border-dashed border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Skill
                </Button>
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-lg font-semibold text-gray-900 mb-2 block">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them why you'd like to swap skills and any additional details..."
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Send Request
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
