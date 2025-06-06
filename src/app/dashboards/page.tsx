'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  usage: number;
  monthlyLimit?: number | null;
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      toast.error('Failed to load API keys');
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    
    setIsCreating(true);
    try {
      const isEditMode = isEditing && editingKey;
      const url = isEditMode ? `/api/keys/${editingKey.id}` : '/api/keys';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName.trim(),
          monthlyLimit: isLimitEnabled ? parseInt(monthlyLimit) : null
        }),
      });

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update API key' : 'Failed to create API key');
      }

      const responseData = await response.json();
      
      if (isEditMode) {
        setApiKeys(prevKeys => prevKeys.map(key => 
          key.id === editingKey.id ? responseData : key
        ));
        toast.success('API key updated successfully');
      } else {
        setApiKeys(prevKeys => [...prevKeys, responseData]);
        toast.success('API key created successfully');
      }

      resetForm();
    } catch (error) {
      const errorMessage = isEditing ? 'Failed to update API key' : 'Failed to create API key';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully', {
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      });
    } catch (error) {
      toast.error('Failed to delete API key', {
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      });
      console.error('Error deleting API key:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard', {
      position: 'top-center',
      style: {
        background: '#22c55e',
        color: '#ffffff',
      },
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const openEditModal = (key: ApiKey) => {
    setEditingKey(key);
    setNewKeyName(key.name);
    setMonthlyLimit(key.monthlyLimit?.toString() || '1000');
    setIsLimitEnabled(!!key.monthlyLimit);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewKeyName('');
    setMonthlyLimit('1000');
    setIsLimitEnabled(false);
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingKey(null);
  };

  const CreateKeyModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={resetForm}
        />
        
        <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isEditing ? `Edit API key "${editingKey?.name}"` : 'Create a new API key'}
            </h2>
            <p className="text-base text-gray-600 mb-8">
              {isEditing ? 'Update the name and limit for this API key.' : 'Enter a name and limit for the new API key.'}
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Key Name
                </label>
                <p className="text-sm text-gray-500 mb-2">A unique name to identify this key</p>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key Name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isLimitEnabled}
                    onChange={(e) => setIsLimitEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">Limit monthly usage*</span>
                </label>
                {isLimitEnabled && (
                  <input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    className="mt-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                )}
              </div>

              <p className="text-sm text-gray-500">
                *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
              </p>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={isCreating || !newKeyName.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? 'Saving...' : isEditing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900">Pages / Overview</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-gray-700">Operational</span>
            </div>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-600 via-purple-400 to-pink-300 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold tracking-wide mb-2">CURRENT PLAN</div>
              <h2 className="text-3xl font-bold mb-4">Researcher</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">API Limit</span>
                <div className="w-64 h-2 bg-white/30 rounded-full">
                  <div className="w-1/4 h-full bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium">24/1,000 Requests</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30">
              Manage Plan
            </button>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                + New Key
              </button>
            </div>

            <table className="w-full mt-6">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 text-sm font-semibold text-gray-600">NAME</th>
                  <th className="pb-4 text-sm font-semibold text-gray-600">USAGE</th>
                  <th className="pb-4 text-sm font-semibold text-gray-600">KEY</th>
                  <th className="pb-4 text-sm font-semibold text-gray-600">OPTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id}>
                    <td className="py-4 text-sm font-medium text-gray-900">{apiKey.name}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">{apiKey.usage || 0}</td>
                    <td className="py-4 font-mono text-sm font-medium text-gray-900">
                      {visibleKeys.has(apiKey.id) ? (
                        apiKey.key
                      ) : (
                        `${apiKey.key.substring(0, 8)}************************`
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => toggleKeyVisibility(apiKey.id)} 
                          className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${visibleKeys.has(apiKey.id) ? 'bg-gray-100' : ''}`}
                          title={visibleKeys.has(apiKey.id) ? "Hide API key" : "Show API key"}
                        >
                          <svg 
                            className="w-5 h-5 text-gray-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            ) : (
                              <>
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                />
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                />
                              </>
                            )}
                          </svg>
                        </button>
                        <button 
                          onClick={() => copyToClipboard(apiKey.key)} 
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Copy API key"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => openEditModal(apiKey)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Edit API key"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(apiKey.id)} 
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Delete API key"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CreateKeyModal />
    </div>
  );
} 