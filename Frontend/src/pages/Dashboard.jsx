import { useState, useEffect, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Save, X, Upload, User } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import imageCompression from 'browser-image-compression';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const userId = useSelector((state) => state.auth.uid);
  const url = `/api/getUser/${userId}`;
  const updateUrl = '/api/updateUser ';
  const avatarUrl = '/api/updateAvatar';

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(url);
        setUser(response.data.data);
        setTempValues(response.data.data);
        console.log(response);
        console.log('User data:', response.data.data);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [url]);

  const handleCrop = async () => {
    console.log('Cropping image...');
    const cropper = cropperRef.current.cropper;
    if (!cropper) {
      console.error('Cropper ref not set');
      return;
    }
    try {
      const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
      console.log('Cropped image generated:', croppedDataURL);
      setCropModalOpen(false);
      await handleAvatarUpdate(croppedDataURL); // Pass the cropped image directly
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };  

  const handleAvatarUpdate = async (croppedImage) => {
    if (!croppedImage) return;
    console.log('Updating avatar...');
  
    const base64Image = croppedImage.split(',')[1]; // Remove the data:image/png;base64, part
    if (!base64Image) {
      console.error('Invalid base64 string');
      return;
    }
    const decodedImage = atob(base64Image);
    const arrayBuffer = new ArrayBuffer(decodedImage.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < decodedImage.length; i++) {
      uint8Array[i] = decodedImage.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: 'image/png' });
    const formData = new FormData();
    const avatarImg = new File([blob], 'avatar.png', { type: 'image/png' });
  
    try {
      const compressedImage = await imageCompression(avatarImg, {
        quality: 0.8,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });
      console.log('Compressed image:', compressedImage);
      formData.append('avatar', compressedImage);
      formData.append('uid', userId);
  
      setIsLoading(true);
      setError(null);
      const response = await axios.put(avatarUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / event.total);
          console.log('Upload progress:', progress);
        },
      });
      console.log('Avatar update response:', response.data);
  
      if (response.data) {
        setUser((prev) => ({ ...prev, avatar: response.data.data }));
      } else {
        throw new Error('Avatar update failed');
      }
    } catch (error) {
      setError('Failed to update avatar');
      console.error('Error updating avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFileChange = (event) => {
    console.log('File changed:', event.target.files[0]);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (field, value) => {
    setIsLoading(true);
    setError(null);
    try {
      const updateData = {
        uid: userId,
        [field]: value
      };
      
      const response = await axios.put(updateUrl, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setUser(prev => ({ ...prev, [field]: value }));
        setEditingField(null);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setError('Failed to update user data');
      console.error('Error updating user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleAvatarUpdate = async (event) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append('avatar', file);
  //   formData.append('uid', userId);

  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.put(avatarUrl, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       onUploadProgress: (event) => {
  //         const progress = Math.round((event.loaded * 100) / event.total);
  //         console.log('Upload progress:', progress);
  //       },
  //     });
  //     console.log('Avatar update response:', response.data);

  //     if (response.data) {
  //       setUser((prev) => ({ ...prev, avatar: response.data.data }));
  //     } else {
  //       throw new Error('Avatar update failed');
  //     }
  //   } catch (error) {
  //     setError('Failed to update avatar');
  //     console.error('Error updating avatar:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const startEditing = (field) => {
    setEditingField(field);
    setTempValues(prev => ({ ...prev, [field]: user[field] }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setError(null);
  };

  // eslint-disable-next-line react/prop-types
  const EditableField = ({ field, value, type = 'text' }) => {
    const isEditing = editingField === field;
    const inputRef = useRef(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {type === 'select' ? (
            <Select 
              value={tempValues[field]} 
              onValueChange={(value) => {
                setTempValues(prev => ({ ...prev, [field]: value }));
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full sm:w-32 bg-slate-700">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 text-white border-t border-slate-600">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              ref={inputRef}
              type={type}
              value={tempValues[field] || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setTempValues(prev => ({ ...prev, [field]: newValue }));
              }}
              className="w-full sm:w-32 bg-slate-700 text-white hover:bg-slate-800 focus:bg-slate-800"
              disabled={isLoading}
            />
          )}
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => handleUpdate(field, tempValues[field])}
              className="text-green-500 hover:text-green-400 hover:bg-slate-600"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={cancelEditing}
              className="text-red-500 hover:text-red-400 hover:bg-slate-600"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className="break-all">{value}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => startEditing(field)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-400 hover:bg-slate-600"
          disabled={isLoading}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Rest of the loading and error states remain the same...
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-slate-700 rounded-full"></div>
          <div className="h-8 w-48 md:w-64 bg-slate-700 rounded"></div>
          <div className="h-6 w-32 md:w-48 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-red-700">
          <CardContent className="p-6">
            <p className="text-red-400 text-center">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  const registrationDate = new Date(user.registeredOn.seconds * 1000).toLocaleDateString();

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <Navbar />
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader className="flex flex-col items-center space-y-4 p-4 md:p-6">
          <div className="relative group">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-slate-600 shadow-xl"
              />
            ) : (
              <User className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-slate-600 shadow-xl text-slate-400" />
            )}

            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                className="text-white text-sm md:text-base"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Avatar
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-white text-center">
            {user?.username}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-slate-400">First Name:</span>
                    <EditableField field="fname" value={user.fname} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-slate-400">Last Name:</span>
                    <EditableField field="lname" value={user.lname} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-slate-400">Email:</span>
                    <EditableField field="email" value={user.email} type="email" />
                </div>
                </div>
                <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-slate-400">Age:</span>
                    <EditableField field="age" value={user.age} type="number" />
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-slate-400">Gender:</span>
                    <EditableField field="gender" value={user.gender} type="select" />
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-slate-400">Registered:</span>
                    <span>{registrationDate}</span>
                </div>
                </div>
            </div>
            </CardContent>
      </Card>
    </div>

    {/* Crop Modal */}
    {cropModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-lg w-11/12 max-w-md">
          <Cropper
            src={imageToCrop}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={false}
            ref={cropperRef}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setCropModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCrop}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Dashboard;