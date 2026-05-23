import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    FaBuilding,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaFileAlt,
    FaIdCard,
    FaFileInvoice,
    FaCreditCard,
    FaKey,
    FaImage,
    FaSave,
    FaCheckCircle,
} from "react-icons/fa";
import { TbPaywall } from "react-icons/tb";

export default function AppSettings() {
    const { appSetting, flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        companyName: appSetting.companyName || "",
        tagLine: appSetting.tagLine || "",
        address: appSetting.address || "",
        phone: appSetting.phone || "",
        email: appSetting.email || "",
        website: appSetting.website || "",
        footer: appSetting.footer || "",
        bin: appSetting.bin || "",
        mushak: appSetting.mushak || "",
        logo: null,
        STRIPE_KEY: appSetting.STRIPE_KEY || "",
        STRIPE_SECRET: appSetting.STRIPE_SECRET || "",
        STRIPE_WEBHOOK: appSetting.STRIPE_WEBHOOK || "",
    });

    const [previewLogo, setPreviewLogo] = useState(
        appSetting.logo ? `/storage/${appSetting.logo}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("app-settings.update"), {
            onSuccess: () => alert("Settings updated successfully!"),
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    // Reusable input field component
    const InputField = ({
        label,
        icon,
        name,
        type = "text",
        value,
        onChange,
        error,
        placeholder = "",
        textarea = false,
        rows = 3,
    }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    {icon}
                </div>
                {textarea ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(name, e.target.value)}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows={rows}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(name, e.target.value)}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={placeholder}
                    />
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );

    // Section component for better organization
    const Section = ({ title, children, className = "" }) => (
        <div
            className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 ${className}`}
        >
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            <Head title="App Settings" />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 overflow-hidden">
                <div className="px-6 py-8">
                    <div className="flex items-center">
                        <div className="bg-white/20 p-4 rounded-lg shadow-inner">
                            <FaBuilding className="text-white text-2xl" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-3xl font-bold text-white">
                                App Settings
                            </h2>
                            <p className="text-blue-100 mt-1">
                                Configure your application's general settings
                                and branding
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flash Message */}
            {flash?.message && (
                <div className="mb-6 flex items-center bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <p className="text-green-700">{flash.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Company Information Section */}

                        <div
                            className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 `}
                        >
                            <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                Company Information
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FaBuilding className="text-gray-400" />
                                    </div>

                                    <input
                                        type={"text"}
                                        value={data.companyName}
                                        onChange={(e) =>
                                            setData(
                                                "companyName",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder={"Your company name"}
                                    />
                                </div>
                                {errors?.companyName && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.companyName}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tag Line
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FaFileAlt className="text-gray-400" />
                                    </div>

                                    <input
                                        type={"text"}
                                        value={data.tagLine}
                                        onChange={(e) =>
                                            setData("tagLine", e.target.value)
                                        }
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder={"Your company slogan"}
                                    />
                                </div>
                                {errors?.tagLine && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.tagLine}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                    </div>

                                    <input
                                        type={"text"}
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Full company address"
                                    />
                                </div>
                                {errors?.address && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <FaPhone className="text-gray-400" />
                                        </div>

                                        <input
                                            type={"text"}
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Contact number"
                                        />
                                    </div>
                                    {errors?.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <FaEnvelope className="text-gray-400" />
                                        </div>

                                        <input
                                            type={"text"}
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="contact@example.com"
                                        />
                                    </div>
                                    {errors?.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Website & Footer Section */}
                        <Section title="Website & Footer">
                            <InputField
                                label="Website URL"
                                icon={<FaGlobe className="text-gray-400" />}
                                name="website"
                                type="url"
                                value={data.website}
                                onChange={setData}
                                error={errors.website}
                                placeholder="https://example.com"
                            />

                            <InputField
                                label="Footer Text"
                                icon={<FaFileAlt className="text-gray-400" />}
                                name="footer"
                                value={data.footer}
                                onChange={setData}
                                error={errors.footer}
                                textarea={true}
                                rows={2}
                                placeholder="Copyright text or additional information"
                            />
                        </Section>

                        {/* Business Information Section */}
                        <Section title="Business Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="BIN"
                                    icon={
                                        <FaIdCard className="text-gray-400" />
                                    }
                                    name="bin"
                                    value={data.bin}
                                    onChange={setData}
                                    error={errors.bin}
                                    placeholder="Business Identification Number"
                                />

                                <InputField
                                    label="Mushak"
                                    icon={
                                        <FaFileInvoice className="text-gray-400" />
                                    }
                                    name="mushak"
                                    value={data.mushak}
                                    onChange={setData}
                                    error={errors.mushak}
                                    placeholder="Mushak number"
                                />
                            </div>
                        </Section>
                    </div>

                    <div className="space-y-6">
                        {/* Logo Upload Section */}
                        <Section title="Company Logo">
                            <div className="flex flex-col items-center space-y-4">
                                {previewLogo ? (
                                    <div className="mb-4 p-2 border border-gray-200 rounded-md bg-gray-50 w-full flex justify-center">
                                        <img
                                            src={previewLogo}
                                            alt="Logo Preview"
                                            className="h-24 w-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-4 p-8 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 w-full flex justify-center items-center">
                                        <p className="text-gray-500 text-center">
                                            No logo uploaded
                                        </p>
                                    </div>
                                )}

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload New Logo
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaImage className="text-gray-400" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Recommended size: 200x60 pixels
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* Stripe Integration Section */}
                        <Section
                            title="Payment Integration"
                            className="bg-gradient-to-br from-gray-50 to-gray-100"
                        >
                            <InputField
                                label="Stripe API Key"
                                icon={
                                    <FaCreditCard className="text-gray-400" />
                                }
                                name="STRIPE_KEY"
                                value={data.STRIPE_KEY}
                                onChange={setData}
                                error={errors.STRIPE_KEY}
                                placeholder="pk_test_..."
                            />

                            <InputField
                                label="Stripe Secret Key"
                                icon={<FaKey className="text-gray-400" />}
                                name="STRIPE_SECRET"
                                value={data.STRIPE_SECRET}
                                onChange={setData}
                                error={errors.STRIPE_SECRET}
                                placeholder="sk_test_..."
                            />

                            <InputField
                                label="Stripe Webhook URL"
                                icon={<TbPaywall className="text-gray-400" />}
                                name="STRIPE_WEBHOOK"
                                value={data.STRIPE_WEBHOOK}
                                onChange={setData}
                                error={errors.STRIPE_WEBHOOK}
                                placeholder="https://example.com/webhook/stripe"
                            />

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-xs text-yellow-700">
                                    Keep your API keys secure. Never expose them
                                    in client-side code.
                                </p>
                            </div>
                        </Section>
                    </div>
                </div>

                {/* Informational Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6 shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-blue-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm text-blue-700">
                                These settings will be used throughout your
                                application for branding, contact information,
                                and payment processing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all transform hover:scale-105"
                    >
                        {processing ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Saving Changes...
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
    );
}
