import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Password strength indicator
    const checkPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        const strengthMap = {
            0: { label: '', color: 'bg-gray-200' },
            1: { label: 'Very Weak', color: 'bg-red-500' },
            2: { label: 'Weak', color: 'bg-orange-500' },
            3: { label: 'Medium', color: 'bg-yellow-500' },
            4: { label: 'Strong', color: 'bg-blue-500' },
            5: { label: 'Very Strong', color: 'bg-green-500' },
        };
        
        return { strength, ...strengthMap[strength] };
    };
    
    const passwordStrength = checkPasswordStrength(data.password);

    return (
        <section className={`bg-white rounded-xl p-6 ${className}`}>
           

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="p-5 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Password Requirements</h3>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            At least 8 characters long
                        </li>
                        <li className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Include at least one uppercase letter
                        </li>
                        <li className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Include at least one number
                        </li>
                        <li className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Include at least one special character
                        </li>
                    </ul>
                </div>

                <div className="space-y-5">
                    {/* Current Password */}
                    <div className="relative">
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type={showPassword.current ? 'text' : 'password'}
                            className="pr-10"
                            label="Current Password"
                            error={errors.current_password}
                            autoComplete="current-password"
                            required
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            onClick={() => togglePasswordVisibility('current')}
                        >
                            {showPassword.current ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* New Password with Strength Indicator */}
                    <div>
                        <div className="relative">
                            <TextInput
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type={showPassword.new ? 'text' : 'password'}
                                className="pr-10"
                                label="New Password"
                                error={errors.password}
                                autoComplete="new-password"
                                required
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                onClick={() => togglePasswordVisibility('new')}
                            >
                                {showPassword.new ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {data.password && (
                            <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                                    <span className={`text-xs font-medium ${
                                        passwordStrength.strength <= 2 ? 'text-red-600' : 
                                        passwordStrength.strength === 3 ? 'text-yellow-600' : 
                                        'text-green-600'
                                    }`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                        className={`h-1.5 rounded-full ${passwordStrength.color}`} 
                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type={showPassword.confirm ? 'text' : 'password'}
                            className="pr-10"
                            label="Confirm Password"
                            error={errors.password_confirmation}
                            autoComplete="new-password"
                            required
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            onClick={() => togglePasswordVisibility('confirm')}
                        >
                            {showPassword.confirm ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            )}
                        </button>
                        
                        {/* Password Match Indicator */}
                        {data.password && data.password_confirmation && (
                            <div className="mt-2 flex items-center text-xs">
                                {data.password === data.password_confirmation ? (
                                    <>
                                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span className="text-green-600">Passwords match</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        <span className="text-red-600">Passwords do not match</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="mr-4 text-sm text-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Password updated successfully!
                        </div>
                    </Transition>

                    <PrimaryButton 
                        disabled={processing} 
                        isLoading={processing}
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        }
                    >
                        Update Password
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}