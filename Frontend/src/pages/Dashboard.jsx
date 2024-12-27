import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Save, X } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const userId = 'a7mfrQXJD9OqS1pQvJy6VYA4mOn1';
  const url = `https://travel-o-backend.vercel.app/api/getUser/${userId}`;
  const updateUrl = `https://travel-o-backend.vercel.app/api/updateUser`;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(url);
        setUser(response.data.data);
        // Initialize tempValues with all user data
        setTempValues(response.data.data);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [url]);

  const handleUpdate = async (field, value) => {
    setIsLoading(true);
    setError(null);
    try {
      const updateData = {
        uid: userId,
        [field]: value
      };
      
      const response = await axios.put(updateUrl, updateData);
      
      if (response.data.success) {
        setUser(prev => ({ ...prev, [field]: value }));
        setTempValues(prev => ({ ...prev, [field]: value }));
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

  const startEditing = (field) => {
    setEditingField(field);
    setTempValues(prev => ({ ...prev, [field]: user[field] }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setError(null);
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
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

  // eslint-disable-next-line react/prop-types
  const EditableField = ({ field, value, type = 'text' }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {type === 'select' ? (
            <Select 
              value={tempValues[field]} 
              onValueChange={(value) => setTempValues(prev => ({ ...prev, [field]: value }))}
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
              type={type}
              value={tempValues[field] || ''}
              onChange={(e) => setTempValues(prev => ({ ...prev, [field]: e.target.value }))}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader className="flex flex-col items-center space-y-4 p-4 md:p-6">
          <div className="relative group">
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-slate-600 shadow-xl transition-transform group-hover:scale-105" 
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="ghost" className="text-white text-sm md:text-base">
                Change Avatar
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-white text-center">
            <EditableField field="username" value={user.username} />
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
  );
};

export default Dashboard;