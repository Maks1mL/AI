import React from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon = null,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400 border border-gray-300",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        outline: "bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-600 focus:ring-blue-500",
    };
    
    const sizeClasses = {
        sm: "text-xs px-3 py-2",
        md: "text-sm px-4 py-2.5",
        lg: "text-base px-6 py-3",
    };
    
    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={`
                ${baseClasses}
                ${variantClasses[variant] || variantClasses.primary}
                ${sizeClasses[size] || sizeClasses.md}
                ${disabled && 'opacity-50 cursor-not-allowed'}
                ${className}
            `}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            
            {icon && !isLoading && (
                <span className="mr-2">{icon}</span>
            )}
            
            {children}
        </button>
    );
}