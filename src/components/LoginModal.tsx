import { useState } from 'react';
import { X, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser, sendLoginOTP, verifyLoginOTP } from '../utils/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    availability: '',
    skillsOffered: '',
    skillsWanted: '',
    otp: ''
  });

  const [isOtpSent, setIsOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      try {
        const result = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location,
          skillsOffered: formData.skillsOffered,
          skillsWanted: formData.skillsWanted,
          availability: formData.availability || 'Flexible',
        });

        if (result.success) {
          onLogin(result.user);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    } else {
      if (isOtpSent) {
        try {
          const result = await verifyLoginOTP(formData.email, formData.otp);

          if (result.success) {
            onLogin(result.user);
          } else {
            console.log(result.message);
          }
        } catch (error) {
          console.error('Error verifying OTP:', error);
        }
      } else {
        try {
          const result = await sendLoginOTP(formData.email);

          if (result.success) {
            console.log("OTP sent successfully.");
            setIsOtpSent(true);
          } else {
            console.log(result.message);
          }
        } catch (error) {
          console.error('Error sending OTP:', error);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Join SkillSwap' : 'Welcome Back'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                type="button"
                variant={userType === 'user' ? "default" : "ghost"}
                onClick={() => setUserType('user')}
                className={`flex-1 ${
                  userType === 'user' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                User
              </Button>
              <Button
                type="button"
                variant={userType === 'admin' ? "default" : "ghost"}
                onClick={() => setUserType('admin')}
                className={`flex-1 ${
                  userType === 'admin' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>

          {userType === 'admin' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center py-4">
                <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Login</h3>
              </div>

              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  type="email"
                  id="admin-email"
                  placeholder="admin@skillswap.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  type="password"
                  id="admin-password"
                  placeholder="Enter admin password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Access Admin Dashboard
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              {isOtpSent ? (
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    type="text"
                    id="otp"
                    name="otp"
                    required
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  />
                </div>
              )}

              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isOtpSent ? 'Verify OTP' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;