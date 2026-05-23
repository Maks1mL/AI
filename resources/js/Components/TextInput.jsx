// TextInput.jsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const TextInput = forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, label, error, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative">
            {label && (
                <label className="absolute -top-2 left-2 px-1 bg-white text-xs font-medium text-blue-600 z-10">
                    {label}
                </label>
            )}
            <input
                {...props}
                type={type}
                className={
                    `w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 
                    transition-all duration-200 ease-in-out 
                    ${error ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'} 
                    placeholder:text-gray-400 text-gray-700 outline-none
                    shadow-sm focus:shadow-md ` + className
                }
                ref={localRef}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
});

export default TextInput;