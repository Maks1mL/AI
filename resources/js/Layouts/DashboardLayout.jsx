import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import {
    FaBrain,
    FaImage,
    FaUserCircle,
    FaMicrophone,
    FaFileAlt,
    FaEye,
    FaChevronDown,
    FaCog,
    FaSignOutAlt,
    FaComment,
    FaTachometerAlt,
    FaBars,
    FaTimes,
    FaMoneyBill,
    FaEnvelope,
    FaTools,
    FaLayerGroup,
} from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";

const DashboardLayout = ({ children }) => {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAIplaygroundOpen, setIsAIplaygroundOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dropdownRef = useRef(null);
    const AIplaygroundRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close AI Playground dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                AIplaygroundRef.current &&
                !AIplaygroundRef.current.contains(event.target)
            ) {
                setIsAIplaygroundOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close sidebar on small screens when navigating
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Set initial state based on screen size

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex ">
                {/* Sidebar */}
                <aside
                    className={`${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed top-0 left-0 z-10 w-64 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0`}
                >
                    <div className="h-full flex flex-col overflow-y-auto">
                        {/* Sidebar Header with Logo and Toggle Button */}
                        <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-md text-blue-100 hover:bg-blue-600 transition-colors md:hidden"
                            >
                                {isSidebarOpen ? <FaTimes /> : <FaBars />}
                            </button>
                            <FaBrain className="text-2xl text-blue-200" />
                            <Link
                                href="/dashboard"
                                className="text-xl font-bold tracking-tight hover:text-blue-200 transition-colors"
                            >
                                Multi Model <span className="text-blue-200">AI SaaS</span>
                            </Link>
                        </div>

                        <div className="flex-1">
                            {/* Dashboard Link */}
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                            >
                                <FaTachometerAlt />
                                <span>Dashboard</span>
                            </Link>

                            {/* AI Playground Section */}
                            <div className="mt-6">
                                <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    AI PLAYGROUND
                                </div>

                                <Link
                                    href="/ai-chat"
                                    className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                >
                                    <FaComment />
                                    <span>Chat With AI</span>
                                </Link>

                                <Link
                                    href="/image-generate"
                                    className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                >
                                    <FaImage />
                                    <span>Image Generator</span>
                                </Link>

                                <Link
                                    href="/text-to-speech"
                                    className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                >
                                    <FaMicrophone />
                                    <span>Text to Speech</span>
                                </Link>

                                <Link
                                    href="/speech-to-text"
                                    className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                >
                                    <FaFileAlt />
                                    <span>Speech to Text</span>
                                </Link>

                                <Link
                                    href="/blog"
                                    className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                >
                                    <FaFileAlt />
                                    <span>Blog Generator</span>
                                </Link>

                                <Link
                                    href="/ai-vision"
                                    className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                >
                                    <FaEye />
                                    <span>AI Vision</span>
                                </Link>
                            </div>

                            {/* Admin Section - Only shown to admin users */}
                            {user?.id === 1 && (
                                <div className="mt-6">
                                    <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        ADMIN
                                    </div>

                                    
                                    <Link
                                        href="/subscription-plans"
                                        className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                    >
                                        <FaMoneyBill />
                                        <span>Plan</span>
                                    </Link>

                                    <Link
                                        href="/admin/plans"
                                        className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                    >
                                        <FaLayerGroup />
                                        <span>Manage Plans</span>
                                    </Link>


                                    <Link
                                        href="/providers"
                                        className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                    >
                                        <FaTools />
                                        <span>Providers</span>
                                    </Link>

                                    <Link
                                        href="/app-settings"
                                        className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                    >
                                        <FaCog />
                                        <span>App Settings</span>
                                    </Link>

                                    <Link
                                        href="/email-config"
                                        className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-600 transition-colors"
                                    >
                                        <FaEnvelope />
                                        <span>Email Config</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* User Profile at Bottom of Sidebar */}
                        <div className="mt-auto border-t border-gray-700">
                            <div
                                className="relative py-4 px-6"
                                ref={dropdownRef}
                            >
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen((prev) => !prev)
                                    }
                                    className="flex items-center space-x-2 w-full rounded-lg hover:bg-gray-700 transition-colors focus:outline-none p-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-blue-800">
                                        {user?.name
                                            ?.charAt(0)
                                            .toUpperCase() || <FaUserCircle />}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className="block truncate text-sm font-medium">
                                            {user?.name}
                                        </span>
                                        <span className="block truncate text-xs text-gray-400">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <FaChevronDown
                                        className={`transition-transform ${
                                            isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* User Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute left-4 bottom-16 w-56 bg-white text-gray-700 shadow-xl rounded-lg overflow-hidden z-50 border border-gray-200">
                                        {user?.id === 1 ? (
                                            <div className="py-1">
                                                <Link
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                    href="/profile"
                                                >
                                                    <FaUserCircle className="mr-3 text-gray-600" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    href="/subscription-plans"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                >
                                                    <FaFileAlt className="mr-3 text-gray-600" />
                                                    <span>Plans</span>
                                                </Link>
                                                <Link
                                                    href="/subscription"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                >
                                                    <AiFillDollarCircle className="mr-3 text-gray-600" />
                                                    <span>Subscription</span>
                                                </Link>

                                                <div className="border-t border-gray-200 mt-1">
                                                    <ResponsiveNavLink
                                                        className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                        method="post"
                                                        href={route("logout")}
                                                        as="button"
                                                    >
                                                        <FaSignOutAlt className="mr-3" />
                                                        <span>Log Out</span>
                                                    </ResponsiveNavLink>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-1">
                                                <Link
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                    href="/profile"
                                                >
                                                    <FaUserCircle className="mr-3 text-gray-600" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    href="/subscription-plans"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                >
                                                    <FaFileAlt className="mr-3 text-gray-600" />
                                                    <span>Plans</span>
                                                </Link>
                                                <Link
                                                    href="/subscription"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                >
                                                    <AiFillDollarCircle  className="mr-3 text-gray-600" />
                                                    <span>Subscription</span>
                                                </Link>

                                                <div className="border-t border-gray-200 mt-1">
                                                    <ResponsiveNavLink
                                                        className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                        method="post"
                                                        href={route("logout")}
                                                        as="button"
                                                    >
                                                        <FaSignOutAlt className="mr-3" />
                                                        <span>Log Out</span>
                                                    </ResponsiveNavLink>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-0 md:ml-64 flex-1 h-screen overflow-y-auto">
                    <div>{children}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
