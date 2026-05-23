export default function FileInput({
    label,
    onChange,
    accept,
    error,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <InputLabel value={label} className="mb-1" />
            )}
            <label className={`
                flex flex-col items-center justify-center w-full px-4 py-6
                bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg
                cursor-pointer hover:bg-gray-100 transition-colors duration-200
                ${error ? 'border-red-300' : 'hover:border-blue-400'}
                ${className}
            `}>
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        {accept?.replace('image/*', 'PNG, JPG, GIF up to 10MB')}
                    </p>
                </div>
                <input 
                    type="file" 
                    className="hidden" 
                    onChange={onChange}
                    accept={accept}
                    {...props}
                />
            </label>
            {error && <InputError message={error} />}
        </div>
    );
}
