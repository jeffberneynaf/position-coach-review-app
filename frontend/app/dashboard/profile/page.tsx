'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { User as UserIcon, Mail, Phone, MapPin, Briefcase, Award, Camera, ArrowLeft, Save, Lock } from 'lucide-react';

interface CoachProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  zipCode: string;
  phoneNumber: string;
  yearsOfExperience: number;
  profilePhotoUrl?: string;
}

export default function ProfileEditPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    specialization: '',
    zipCode: '',
    phoneNumber: '',
    yearsOfExperience: 0,
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!user || user.userType !== 'Coach') {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get<CoachProfile>(`/api/coaches/${user?.id}`);
        setProfile(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          bio: response.data.bio,
          specialization: response.data.specialization,
          zipCode: response.data.zipCode,
          phoneNumber: response.data.phoneNumber,
          yearsOfExperience: response.data.yearsOfExperience,
        });
        if (response.data.profilePhotoUrl) {
          setPhotoPreview(`${process.env.NEXT_PUBLIC_API_URL}${response.data.profilePhotoUrl}`);
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? (value === '' ? 0 : parseInt(value) || 0) : value
    }));
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setProfilePhoto(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (jpg, jpeg, png, gif, webp)');
      e.target.value = '';
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 2MB');
      e.target.value = '';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setProfilePhoto(file);
  };

  const handlePhotoUpload = async () => {
    if (!profilePhoto || !user) return;

    setUploadingPhoto(true);
    setError('');
    setSuccess('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('photo', profilePhoto);

      const response = await api.post<{ photoUrl: string }>(
        `/api/coaches/${user.id}/photo`,
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPhotoPreview(`${process.env.NEXT_PUBLIC_API_URL}${response.data.photoUrl}`);
      setProfilePhoto(null);
      setSuccess('Profile photo updated successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate password complexity
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)');
      return;
    }

    setChangingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await api.post(`/api/coaches/${user.id}/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/api/coaches/${user.id}`, formData);
      
      // Update photo if changed
      if (profilePhoto) {
        await handlePhotoUpload();
      }
      
      setSuccess('Profile updated successfully!');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#f91942]"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="gradient-secondary text-white pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
          <p className="text-white/90">Update your coaching profile information</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Photo</h2>
            
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={48} className="text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#f91942] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#d01437] transition shadow-lg"
                >
                  <Camera size={20} className="text-white" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Upload Photo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a professional photo that represents you. Max size: 2MB
                </p>
                {profilePhoto && (
                  <Button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    variant="secondary"
                    size="sm"
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                icon={<UserIcon size={18} />}
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                icon={<UserIcon size={18} />}
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  icon={<Mail size={18} />}
                  helperText="Email cannot be changed"
                />
              </div>

              <Input
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                icon={<Phone size={18} />}
                placeholder="(123) 456-7890"
              />

              <Input
                label="Zip Code"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                icon={<MapPin size={18} />}
                placeholder="12345"
                required
              />
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>
            
            <div className="space-y-6">
              <Input
                label="Specialization"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                icon={<Briefcase size={18} />}
                placeholder="e.g., Quarterback, Wide Receiver"
                helperText="What position(s) do you coach?"
              />

              <Input
                label="Years of Experience"
                name="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                icon={<Award size={18} />}
                min="0"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent resize-none"
                  placeholder="Tell athletes about your coaching philosophy, experience, and what makes you unique..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  This will be displayed on your public profile
                </p>
              </div>
            </div>
          </Card>

          {/* Change Password Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
            
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                icon={<Lock size={18} />}
                required
              />

              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                icon={<Lock size={18} />}
                helperText="At least 8 characters, one uppercase, one lowercase, one number, and one special character"
                required
                minLength={8}
              />

              <Input
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                icon={<Lock size={18} />}
                helperText="Re-enter your new password"
                required
                minLength={8}
              />

              <Button
                type="submit"
                disabled={changingPassword}
                variant="secondary"
              >
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              icon={<Save size={20} />}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
