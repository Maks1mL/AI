import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import ApplicationLogo from "@/Components/ApplicationLogo";

const Login = ({ status, canResetPassword }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout title="Login">
            <Head title="Login" />
            <div className="flex items-center justify-center  bg-gray-100">
                <div className="bg-white p-8  w-full max-w-md">
                    {/* Company Logo */}
                    <div className="flex items-center justify-center">
                        <Link href="/" >
                            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-center my-6 text-3xl font-extrabold text-gray-900">
                            Welcome Back
                        </h2>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                    
                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
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

                        {/* Password Input */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 text-sm text-gray-600"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={processing}
                        >
                            {processing ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    {canResetPassword && (
                        <div className="mt-4 text-center">
                            <a
                                href={route("password.request")}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    )}

                    {/* Register Link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a
                                href={route("register")}
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Register
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Login;
