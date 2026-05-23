import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, profile_image_url }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    {profile_image_url && (
                        <div className="mr-4">
                            <img 
                                src={profile_image_url} 
                                alt="Profile" 
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">
                        My Profile
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Sidebar with user info summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6 text-center">
                                    <div className="mb-4">
                                        {profile_image_url ? (
                                            <img 
                                                src={profile_image_url} 
                                                alt="Profile" 
                                                className="mx-auto h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                                            />
                                        ) : (
                                            <div className="mx-auto h-24 w-24 rounded-full bg-green-300 flex items-center justify-center">
                                                   { user?.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage your profile information, security settings, and account preferences.
                                    </p>
                                    <div className="mt-6">
                                        <a href="#profile-info" className="text-indigo-600 hover:text-indigo-800 block py-2 text-sm">
                                            Profile Information
                                        </a>
                                        <a href="#password" className="text-indigo-600 hover:text-indigo-800 block py-2 text-sm">
                                            Password
                                        </a>
                                        <a href="#delete-account" className="text-red-600 hover:text-red-800 block py-2 text-sm">
                                            Delete Account
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main content area */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Profile Information Section */}
                            <div id="profile-info" className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                                    <div className="border-t border-gray-200 pt-4">
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                            className="w-full"
                                            profileImageUrl={profile_image_url}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Section */}
                            <div id="password" className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Update Password</h3>
                                    <div className="border-t border-gray-200 pt-4">
                                        <UpdatePasswordForm className="w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Delete Account Section */}
                            <div id="delete-account" className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                                    <div className="border-t border-gray-200 pt-4">
                                        <DeleteUserForm className="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}