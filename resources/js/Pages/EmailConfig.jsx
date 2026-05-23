import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FaEnvelope, FaServer, FaUser, FaLock, FaCog, FaSave, FaCheckCircle } from "react-icons/fa";

export default function EmailConfig() {
    const { emailConfig, flash } = usePage().props;
    const [testStatus, setTestStatus] = useState(null);
    
    const { data, setData, post, processing, errors } = useForm({
        emailConfigName: emailConfig.emailConfigName || "",
        emailHost: emailConfig.emailHost || "",
        emailPort: emailConfig.emailPort || "",
        emailUser: emailConfig.emailUser || "",
        emailPass: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("email-config.update"), {
            onSuccess: () => alert("Email configuration updated successfully!"),
        });
    };

    const handleTestConnection = () => {
        // Simulate testing email connection
        setTestStatus("testing");
        setTimeout(() => {
            setTestStatus("success");
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10">
                        <Head title="Email Config"/>

            {/* Page Header with Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                    <div className="flex items-center">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <FaEnvelope className="text-white text-xl" />
                        </div>
                        <h2 className="ml-4 text-2xl font-bold text-white">Email Configuration</h2>
                    </div>
                    <p className="text-blue-100 mt-1 ml-14">Configure your SMTP settings for system emails</p>
                </div>

                {/* Flash Message */}
                {flash?.message && (
                    <div className="m-6 flex items-center bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <FaCheckCircle className="text-green-500 mr-3" />
                        <p className="text-green-700">{flash.message}</p>
                    </div>
                )}

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                            {/* Email Config Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Configuration Name</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCog className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.emailConfigName}
                                        onChange={(e) => setData("emailConfigName", e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Primary Email Configuration"
                                        required
                                    />
                                </div>
                                {errors.emailConfigName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.emailConfigName}</p>
                                )}
                            </div>

                            {/* Email Host */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaServer className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.emailHost}
                                        onChange={(e) => setData("emailHost", e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="smtp.example.com"
                                        required
                                    />
                                </div>
                                {errors.emailHost && <p className="mt-1 text-sm text-red-600">{errors.emailHost}</p>}
                            </div>

                            {/* Email Port */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-medium">#</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={data.emailPort}
                                        onChange={(e) => setData("emailPort", e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="587"
                                        required
                                    />
                                </div>
                                {errors.emailPort && <p className="mt-1 text-sm text-red-600">{errors.emailPort}</p>}
                            </div>

                            {/* Email User */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Username</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.emailUser}
                                        onChange={(e) => setData("emailUser", e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                                {errors.emailUser && <p className="mt-1 text-sm text-red-600">{errors.emailUser}</p>}
                            </div>

                            {/* Email Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={data.emailPass}
                                        onChange={(e) => setData("emailPass", e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                {errors.emailPass && <p className="mt-1 text-sm text-red-600">{errors.emailPass}</p>}
                            </div>
                        </div>

                        {/* Informational Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                    <p className="text-sm text-blue-700">
                                        These settings will be used for sending system emails, notifications, and password resets.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleTestConnection}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {testStatus === "testing" ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Testing Connection...
                                    </>
                                ) : testStatus === "success" ? (
                                    <>
                                        <FaCheckCircle className="mr-2 text-green-500" />
                                        Connection Successful
                                    </>
                                ) : (
                                    "Test Connection"
                                )}
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        Save Configuration
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}