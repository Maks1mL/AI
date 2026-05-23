// ProfileImageUpload.jsx
export default function ProfileImageUpload({ 
    imageUrl, 
    onChange, 
    error 
}) {
    return (
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="relative group">
                <img
                    src={imageUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={onChange}
                        accept="image/*"
                    />
                </label>
            </div>
            <div>
                <h4 className="text-base font-semibold text-gray-800">Profile Picture</h4>
                <p className="text-sm text-gray-500 mb-2">
                    Upload a professional picture for your profile
                </p>
                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Change Photo
                </button>
                {error && <InputError message={error} />}
            </div>
        </div>
    );
}