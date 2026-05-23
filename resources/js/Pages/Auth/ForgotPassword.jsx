import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

const ForgotPassword = ({ status }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout title="Forgot Password">
            <Head title="Forgot Password" />
            <div className="flex items-center justify-center  bg-gray-100">
                <div className="bg-white p-8  w-full max-w-md">
                    
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                        Forgot Password?
                    </h2>
                    <p className="text-sm text-gray-600 text-center mb-4">
                        Enter your email address and we will send you a password
                        reset link.
                    </p>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={processing}
                        >
                            {processing
                                ? "Sending..."
                                : "Send Password Reset Link"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Remembered your password?{" "}
                            <a
                                href={route("login")}
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default ForgotPassword;
