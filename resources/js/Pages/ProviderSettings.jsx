import React from 'react';
import { useForm, usePage } from "@inertiajs/react";

const ProviderEdit = ({ provider }) => {
  const { message } = usePage().props;
  const { data, setData, put, processing, errors } = useForm({
    name: provider.name || '',
    url: provider.url || '',
    api_key: provider.api_key || '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('provider.update', provider.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Edit Provider
        </h1>

        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
            {message}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={submit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
                Provider Name
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="url" className="block text-gray-600 font-medium mb-2">
                Provider URL
              </label>
              <input
                id="url"
                type="text"
                value={data.url}
                onChange={(e) => setData('url', e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
              {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="api_key" className="block text-gray-600 font-medium mb-2">
                API Key
              </label>
              <input
                id="api_key"
                type="text"
                value={data.api_key}
                onChange={(e) => setData('api_key', e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
              {errors.api_key && <p className="text-red-500 text-sm mt-1">{errors.api_key}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {processing ? 'Updating...' : 'Update Provider'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderEdit;
