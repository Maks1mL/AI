import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FaEdit, FaEye, FaEyeSlash, FaServer, FaPlus, FaCheck, FaTimes, FaThLarge, FaTable } from 'react-icons/fa';

const ProviderIndex = ({ providers }) => {
  const { message } = usePage().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [visibleApiKeys, setVisibleApiKeys] = useState({});
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  // useForm for the edit modal
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    url: '',
    api_key: '',
  });

  // Open modal and load provider data
  const openModal = (provider) => {
    setSelectedProvider(provider);
    setData({
      name: provider.name,
      url: provider.url,
      api_key: provider.api_key,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  // Submit updated data
  const submit = (e) => {
    e.preventDefault();
    post(route('provider.update', selectedProvider.id), {
      onSuccess: () => closeModal(),
    });
  };

  // Toggle API Key visibility
  const toggleApiKey = (id) => {
    setVisibleApiKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle view mode between card and table
  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'table' : 'card');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
                  <Head title="Providers"/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">API Providers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your AI service providers and API configurations
              </p>
            </div>
            <div className="flex space-x-4">
              {/* View Toggle Button */}
              <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-2 text-sm rounded-l-md focus:outline-none flex items-center ${
                    viewMode === 'card' 
                      ? 'bg-blue-50 text-blue-700 border-r border-gray-300' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Card view"
                >
                  <FaThLarge className="mr-1.5" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm rounded-r-md focus:outline-none flex items-center ${
                    viewMode === 'table' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Table view"
                >
                  <FaTable className="mr-1.5" />
                  Table
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 flex items-center p-4 border-l-4 border-green-500 bg-green-50 rounded-md">
            <FaCheck className="text-green-500 mr-3" />
            <span className="text-green-700">{message}</span>
          </div>
        )}

        {/* Provider Cards */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <FaServer className="text-blue-600" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900 truncate" title={provider.name}>
                      {provider.name}
                    </h3>
                  </div>
                  {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ID: {provider.id}
                  </span> */}
                </div>
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Provider URL</label>
                    <div className="text-sm text-gray-900 break-all bg-gray-50 p-2 rounded border border-gray-200">
                      {provider.url}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-500">API Key</label>
                      <button
                        onClick={() => toggleApiKey(provider.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none transition flex items-center"
                        title={visibleApiKeys[provider.id] ? "Hide API Key" : "Show API Key"}
                      >
                        {visibleApiKeys[provider.id] ? (
                          <>
                            <FaEyeSlash className="mr-1" /> Hide
                          </>
                        ) : (
                          <>
                            <FaEye className="mr-1" /> Show
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 font-mono flex items-center">
                      <div className="flex-1 truncate">
                        {visibleApiKeys[provider.id] ? provider.api_key : '•••••••••••••••••••••••••'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => openModal(provider)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      <FaEdit className="mr-1.5" />
                      Edit Configuration
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {providers.length === 0 && (
              <div className="col-span-full bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-12 text-center">
                  <FaServer className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Providers Configured</h3>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Provider Table */}
        {viewMode === 'table' && (
          <div className="overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="bg-white overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Key
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {providers.map((provider) => (
                    <tr key={provider.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-1.5 rounded">
                            <FaServer className="text-blue-600 text-xs" />
                          </div>
                          <div className="ml-3 font-medium text-gray-900">{provider.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={provider.url}>
                        {provider.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="font-mono max-w-xs truncate" title={visibleApiKeys[provider.id] ? provider.api_key : 'API Key Hidden'}>
                            {visibleApiKeys[provider.id] ? provider.api_key : '•••••••••••••••••••'}
                          </span>
                          <button
                            onClick={() => toggleApiKey(provider.id)}
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                            aria-label={visibleApiKeys[provider.id] ? "Hide API Key" : "Show API Key"}
                          >
                            {visibleApiKeys[provider.id] ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(provider)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                          <FaEdit className="mr-1" size={12} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {providers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaServer className="h-8 w-8 text-gray-400 mb-2" />
                          <p>No providers configured. Add your first API provider to get started.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Provider Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Modal overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
              onClick={closeModal}
            ></div>
            
            {/* Modal panel */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md z-50 transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    {selectedProvider.id === 'new' ? 'Add New Provider' : 'Edit Provider'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <form onSubmit={submit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Provider Name
                    </label>
                    <input
                      disabled={selectedProvider.id === 'new' ? false : true}
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                      placeholder="Enter provider name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                      Provider URL
                    </label>
                    <input
                      id="url"
                      type="text"
                      value={data.url}
                      onChange={(e) => setData('url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                      placeholder="https://api.provider.com/v1"
                    />
                    {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                  </div>

                  <div>
                    <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      id="api_key"
                      type="text"
                      value={data.api_key}
                      onChange={(e) => setData('api_key', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono transition"
                      placeholder="Enter API key"
                    />
                    {errors.api_key && <p className="mt-1 text-sm text-red-600">{errors.api_key}</p>}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-1.5" />
                        {selectedProvider.id === 'new' ? 'Add Provider' : 'Update Provider'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderIndex;