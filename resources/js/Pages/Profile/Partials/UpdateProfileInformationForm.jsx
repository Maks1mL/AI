import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ProfileImageUpload from '@/Components/ProfileImageUpload';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '', profileImageUrl }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        profile_image: null,
        _method: 'PATCH',
    });

    // Load the correct profile image URL from Laravel
    const [previewImage, setPreviewImage] = useState(profileImageUrl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('profile_image', file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                console.log('Profile updated successfully!');
            },
        });
    };

    return (
        <section className={`bg-white rounded-xl  p-6 ${className}`}>
          
            <form onSubmit={submit} className="space-y-8">
                {/* Profile Image */}
                <div className="pb-6 border-b border-gray-200">
                    <ProfileImageUpload 
                        imageUrl={previewImage}
                        onChange={handleImageChange}
                        error={errors.profile_image}
                    />
                </div>

                {/* Account Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <TextInput
                            id="name"
                            label="Full Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <TextInput
                            id="email"
                            type="email"
                            label="Email Address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            required
                        />
                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div className="mt-2 text-xs text-amber-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                <span>Your email address is unverified.</span>
                                <button className="ml-1 underline text-blue-600 hover:text-blue-800">
                                    Click here to re-send verification email.
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                    {recentlySuccessful && (
                        <div className="mr-4 text-sm text-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Profile updated successfully!
                        </div>
                    )}
                    <PrimaryButton 
                        disabled={processing}
                        isLoading={processing}
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                        }
                    >
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}