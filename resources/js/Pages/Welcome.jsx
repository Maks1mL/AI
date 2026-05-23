import TestimonialCarousel from "@/Components/TestimonialCarousel";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    FaArrowRight,
    FaRobot,
    FaImage,
    FaHeadphones,
    FaCheck,
    FaChevronRight,
    FaBrain,
    FaLightbulb,
    FaRocket,
    FaShieldAlt,
    FaPlay,
    FaMagic,
    FaMicrophone,
    FaFileAlt,
    FaBolt,
    FaServer,
} from "react-icons/fa";
import AIImageGallery from "./AIImageGallery";

const getFeatureDescription = (planName) => {
    switch (planName.toLowerCase()) {
        case "basic":
            return "Essential AI tools for individuals";
        case "pro":
            return "Advanced features for professionals";
        case "enterprise":
            return "Ultimate AI solution for businesses";
        default:
            return "Customized AI solutions";
    }
};

export default function Welcome({ plans, appSetting }) {
    const user = usePage().props.auth.user;

    const individualAIModels = [
        { name: "OpenAI GPT-4", price: "$20", icon: "🤖" },
        { name: "Google Bard", price: "$15", icon: "🎭" },
        { name: "Anthropic Claude", price: "$25", icon: "🧠" },
        { name: "MidJourney (Pro)", price: "$30", icon: "🎨" },
        { name: "Stable Diffusion", price: "$10", icon: "🖼️" },
        { name: "Microsoft Copilot", price: "$25", icon: "✈️" },
        { name: "ElevenLabs (Pro)", price: "$22", icon: "🎙️" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="bg-gray-900 text-gray-100 font-sans min-h-screen">
                <Head>
                    <title>OSChat All-in-One AI</title>
                </Head>

                {/* Background Effects */}
                {/* Professional Background Effects with Modern Design Elements */}
                <div className="fixed inset-0 bg-gradient-to-br from-blue-950/40 via-gray-900 to-indigo-950/40 z-0">
                    {/* Subtle animated mesh grid overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] pointer-events-none"></div>
                </div>

                {/* Modern Gradient Orbs with Improved Positioning and Layering */}
                <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none z-0">
                    {/* Primary accent orbs with improved positioning */}
                    <div
                        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/5 blur-3xl animate-pulse"
                        style={{ animationDuration: "15s" }}
                    ></div>
                    <div
                        className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-gradient-to-l from-indigo-500/10 to-purple-500/5 blur-3xl animate-pulse"
                        style={{ animationDuration: "20s" }}
                    ></div>
                    <div
                        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-slate-500/10 to-indigo-400/5 blur-3xl animate-pulse"
                        style={{ animationDuration: "18s" }}
                    ></div>

                    {/* Secondary subtle accent elements */}
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full border border-white/5 opacity-30"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border border-white/5 opacity-20"></div>

                    {/* Subtle floating particles */}
                    <div className="absolute top-20 right-1/3 w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="absolute top-1/2 left-1/3 w-1 h-1 rounded-full bg-white/20"></div>
                    <div className="absolute bottom-1/3 right-1/2 w-2 h-2 rounded-full bg-white/20"></div>
                </div>

                {/* Optional: Subtle vignette overlay for depth */}
                <div
                    className="fixed inset-0 bg-radial-gradient pointer-events-none z-0 opacity-40"
                    style={{
                        background:
                            "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
                    }}
                ></div>

                {/* Top Fixed Header */}
                <header className="fixed top-0 left-0 right-0 backdrop-blur-lg bg-gray-900/70 border-b border-gray-800/50 shadow-lg z-50">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        {/* Branding */}
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                            {appSetting?.companyName || "OSChat"}
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a
                                href="#features"
                                className="font-medium text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#subscriptions"
                                className="font-medium text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                Pricing
                            </a>
                            <a
                                href="#testimonials"
                                className="font-medium text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                Testimonials
                            </a>
                        </nav>

                        {/* Desktop Dashboard Button */}
                        <div className="hidden md:block">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg text-center hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex space-x-4 items-center">
                                    <Link
                                        href="/login"
                                        className="text-gray-300 font-medium hover:text-purple-400 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg text-center hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                type="button"
                                className="text-gray-300 hover:text-purple-400 focus:outline-none"
                            >
                                {isMobileMenuOpen ? (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <nav className="absolute top-[65px] right-0 left-0 md:hidden backdrop-blur-xl bg-gray-900/90 border-b border-gray-800/50 shadow-lg">
                            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
                                <a
                                    href="#features"
                                    className="text-gray-300 font-medium hover:text-purple-400 transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Features
                                </a>
                                <a
                                    href="#subscriptions"
                                    className="text-gray-300 font-medium hover:text-purple-400 transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Pricing
                                </a>
                                <a
                                    href="#testimonials"
                                    className="text-gray-300 font-medium hover:text-purple-400 transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Testimonials
                                </a>
                                {user ? (
                                    <Link
                                        href="/dashboard"
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg text-center hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            href="/login"
                                            className="text-gray-300 font-medium hover:text-purple-400 transition-colors py-2"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg text-center hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    )}
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        {/* Pre-heading */}
                        <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            Ultimate AI Ecosystem
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            One Platform.{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                Unlimited AI Power.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Access the world's most advanced AI models in one
                            seamless experience. Transform content, images,
                            audio, and text with unparalleled speed and
                            precision.
                        </p>

                        {/* Call-to-Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10 lg:mb-0">
                            <Link
                                href="/subscription-plans"
                                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-purple-500/20 font-medium text-lg flex items-center justify-center group"
                            >
                                <span>Start Creating Now</span>
                                <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="bg-gray-800/50 backdrop-blur-sm text-gray-200 border border-gray-700 px-8 py-4 rounded-lg hover:bg-gray-800/80 transition duration-300 shadow-lg hover:shadow-blue-500/10 font-medium text-lg flex items-center justify-center">
                                <FaPlay className="mr-2 text-purple-400" /> See
                                AI in Action
                            </button>
                        </div>

                        {/* Feature Highlights */}
                        {/* Feature Highlights - Improved Layout */}
                        <div className="mt-16 max-w-5xl mx-auto">
                            {/* Section Title */}
                            <h3 className="text-xl text-gray-200 font-medium mb-6">
                                Powerful AI Capabilities
                            </h3>

                            {/* Main Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {/* Feature 1 - Multi-AI Chat */}
                                <div className="backdrop-blur-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-purple-500/50 transition-all group">
                                    <div className="p-4 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
                                        <div className="text-purple-400 text-3xl mb-3 group-hover:scale-110 transition-transform">
                                            <FaRobot />
                                        </div>
                                        <p className="text-white font-medium mb-1">
                                            Multi-AI Chat
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            GPT-4, Claude, Bard & more
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 - Image Generation */}
                                <div className="backdrop-blur-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-blue-500/50 transition-all group">
                                    <div className="p-4 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
                                        <div className="text-blue-400 text-3xl mb-3 group-hover:scale-110 transition-transform">
                                            <FaImage />
                                        </div>
                                        <p className="text-white font-medium mb-1">
                                            Visual AI
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Generate & transform images
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3 - Voice */}
                                <div className="backdrop-blur-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all group">
                                    <div className="p-4 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-full"></div>
                                        <div className="text-cyan-400 text-3xl mb-3 group-hover:scale-110 transition-transform">
                                            <FaMicrophone />
                                        </div>
                                        <p className="text-white font-medium mb-1">
                                            Audio Intelligence
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Text-to-speech & transcription
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 4 - Content */}
                                <div className="backdrop-blur-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-green-500/50 transition-all group">
                                    <div className="p-4 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
                                        <div className="text-green-400 text-3xl mb-3 group-hover:scale-110 transition-transform">
                                            <FaFileAlt />
                                        </div>
                                        <p className="text-white font-medium mb-1">
                                            Content Creator
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Blogs, logos & analytics
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-8 flex justify-center items-center space-x-8">
                            <div className="text-gray-400 flex items-center">
                                <FaShieldAlt className="mr-2 text-purple-400" />
                                <span className="text-sm">
                                    Enterprise-grade Security
                                </span>
                            </div>
                            <div className="text-gray-400 flex items-center">
                                <FaBolt className="mr-2 text-blue-400" />
                                <span className="text-sm">
                                    Real-time Processing
                                </span>
                            </div>
                            <div className="text-gray-400 flex items-center">
                                <FaServer className="mr-2 text-cyan-400" />
                                <span className="text-sm">99.9% Uptime</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Image Gallery Section */}
                <section className="py-24 relative overflow-hidden z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/80 to-gray-900/95 z-0"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                                AI CREATIONS
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Stunning AI-Generated Imagery
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Transform your ideas into breathtaking visuals
                                with our advanced image generation models
                            </p>
                        </div>

                        {/* Gallery */}
                        <div className="mt-12 max-w-7xl mx-auto ">
                            <AIImageGallery />
                        </div>

                        {/* Call to Action */}
                        <div className="mt-16 text-center">
                            <Link
                                href="/subscription-plans"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-purple-500/20 font-medium text-lg flex items-center justify-center mx-auto w-auto inline-flex"
                            >
                                <FaMagic className="mr-2" />
                                <span>Start Creating Images</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Funky AI Capabilities Showcase Section */}
                <section id="features" className="py-32 relative overflow-hidden">
                    {/* Dynamic animated background */}
                    <div className="absolute inset-0  z-0">
                        <div className="absolute inset-0 opacity-30">
                            {/* Animated background patterns would render here */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/circuit-pattern.svg')] bg-repeat animate-pulse"></div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                                UNLOCK THE MAGIC
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Multi-Model AI Superpowers
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                One platform. Infinite possibilities to create,
                                speak, write, and visualize.
                            </p>
                        </div>

                        {/* Funky Feature Grid with Different Sized Cards */}
                        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
                            {/* Chat with AI - Large Card */}
                            <div className="col-span-12 md:col-span-8 lg:col-span-6 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-purple-600/30 to-blue-500/30 border-2 border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-8 relative">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-16 h-16 flex items-center justify-center mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-8 h-8"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    x="3"
                                                    y="11"
                                                    width="18"
                                                    height="10"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                                <circle
                                                    cx="12"
                                                    cy="5"
                                                    r="2"
                                                ></circle>
                                                <path d="M12 7v4"></path>
                                                <line
                                                    x1="8"
                                                    y1="16"
                                                    x2="8"
                                                    y2="16"
                                                ></line>
                                                <line
                                                    x1="16"
                                                    y1="16"
                                                    x2="16"
                                                    y2="16"
                                                ></line>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                                            Chat with AI
                                        </h4>
                                        <p className="text-blue-100 text-lg">
                                            Engage in mind-expanding
                                            conversations with GPT-4, Claude,
                                            and Bard instantly. Ask anything,
                                            get brilliant answers.
                                        </p>
                                        <div className="mt-6 inline-block">
                                            <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                                                Try it now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text to Speech - Medium Card */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3 transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/30 border-2 border-blue-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                                            Text to Speech
                                        </h4>
                                        <p className="text-blue-100">
                                            Convert your words into lifelike
                                            human voices that sound incredibly
                                            natural.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Speech to Text - Medium-Tall Card */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-cyan-600/30 to-teal-500/30 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                                <line
                                                    x1="12"
                                                    y1="19"
                                                    x2="12"
                                                    y2="23"
                                                ></line>
                                                <line
                                                    x1="8"
                                                    y1="23"
                                                    x2="16"
                                                    y2="23"
                                                ></line>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                                            Speech to Text
                                        </h4>
                                        <p className="text-cyan-100">
                                            Accurately transcribe any audio to
                                            perfect text in seconds with
                                            unmatched precision.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Blog Generator - Wide Card */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-4 transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-amber-600/30 to-yellow-500/30 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                    x1="16"
                                                    y1="13"
                                                    x2="8"
                                                    y2="13"
                                                ></line>
                                                <line
                                                    x1="16"
                                                    y1="17"
                                                    x2="8"
                                                    y2="17"
                                                ></line>
                                                <line
                                                    x1="10"
                                                    y1="9"
                                                    x2="8"
                                                    y2="9"
                                                ></line>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-amber-300 transition-colors">
                                            AI Blog Generator
                                        </h4>
                                        <p className="text-amber-100">
                                            Create engaging, SEO-optimized blog
                                            posts with just one prompt. From
                                            outline to publication.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Analysis - Small Card */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-4 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-green-600/30 to-emerald-500/30 border-2 border-green-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    x="3"
                                                    y="3"
                                                    width="18"
                                                    height="18"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                                <circle
                                                    cx="8.5"
                                                    cy="8.5"
                                                    r="1.5"
                                                ></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-green-300 transition-colors">
                                            Image Analysis
                                        </h4>
                                        <p className="text-green-100">
                                            Let AI understand and explain any
                                            image with remarkable accuracy and
                                            insight.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Generation - Large Card */}
                            <div className="col-span-12 md:col-span-8 lg:col-span-4 transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-pink-600/30 to-rose-500/30 border-2 border-pink-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-8 relative">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-16 h-16 flex items-center justify-center mb-6 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-8 h-8"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                                <rect
                                                    x="1"
                                                    y="5"
                                                    width="15"
                                                    height="14"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-2xl font-bold mb-3 group-hover:text-pink-300 transition-colors">
                                            Image Generation
                                        </h4>
                                        <p className="text-pink-100 text-lg">
                                            Transform your ideas into
                                            breathtaking visual art with
                                            cutting-edge AI. From realistic to
                                            fantastical.
                                        </p>
                                        <div className="mt-6 inline-block">
                                            <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                                                Create now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image to Image - Medium Card */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-6 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-red-600/30 to-orange-500/30 border-2 border-red-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                <rect
                                                    x="3"
                                                    y="11"
                                                    width="18"
                                                    height="10"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-red-300 transition-colors">
                                            Image to Image
                                        </h4>
                                        <p className="text-red-100">
                                            Transform one image into completely
                                            different styles, concepts, or
                                            atmospheres with AI wizardry.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Background Remover - Small Card */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3 transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-orange-600/30 to-amber-500/30 border-2 border-orange-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    x="3"
                                                    y="3"
                                                    width="18"
                                                    height="18"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                                <circle
                                                    cx="9"
                                                    cy="9"
                                                    r="2"
                                                ></circle>
                                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                                            Background Remover
                                        </h4>
                                        <p className="text-orange-100">
                                            Magically erase image backgrounds
                                            with a single click. Clean,
                                            professional results every time.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upscale Image - Small Card */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-indigo-600/30 to-violet-500/30 border-2 border-indigo-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 7h10v10"></path>
                                                <path d="M7 17 17 7"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                                            Upscale Image
                                        </h4>
                                        <p className="text-indigo-100">
                                            Turn low-res images into stunning
                                            high-resolution masterpieces without
                                            quality loss.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Logo Generator - Medium Card */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-6 transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
                                <div className="h-full backdrop-blur-xl bg-gradient-to-br from-teal-600/30 to-green-500/30 border-2 border-teal-500/50 rounded-3xl shadow-2xl overflow-hidden group">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 text-white shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        </div>
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-teal-300 transition-colors">
                                            Logo Generator
                                        </h4>
                                        <p className="text-teal-100">
                                            Create professional, custom-designed
                                            logos for your brand in minutes, not
                                            days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Funky CTA */}
                        <div className="mt-16 text-center">
                            <Link
                                href="/subscription-plans"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-purple-500/20 font-medium text-lg flex items-center justify-center mx-auto w-auto inline-flex"
                            >
                                <FaMagic className="mr-2" />
                                <span>Unlock Superpowers </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="subscriptions" className="py-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900 z-0"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                                PRICING
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Choose the plan that works best for your needs
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-7xl w-full">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`backdrop-blur-lg bg-gray-800/40 rounded-2xl overflow-hidden ${
                                            plan.name === "Pro"
                                                ? "ring-2 ring-purple-500 transform md:-translate-y-4"
                                                : "border border-gray-700/50"
                                        } shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition duration-300`}
                                    >
                                        {plan.name === "Pro" && (
                                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 font-medium">
                                                MOST POPULAR
                                            </div>
                                        )}
                                        <div className="p-8">
                                            {/* Plan Name & Price */}
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-white mb-2">
                                                    {plan.name}
                                                </h2>
                                                <p className="text-gray-400 mb-6">
                                                    {getFeatureDescription(
                                                        plan.name
                                                    )}
                                                </p>
                                                <div className="flex justify-center items-baseline">
                                                    <span className="text-5xl font-extrabold text-white">
                                                        {plan.price > 0
                                                            ? `$${plan.price}`
                                                            : "Free"}
                                                    </span>
                                                    {plan.price > 0 && (
                                                        <span className="text-gray-400 ml-1 text-xl">
                                                            /month
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8"></div>

                                            {/* Feature List */}
                                            <ul className="space-y-4 mb-8">
                                                <li className="flex">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                                                        <FaRobot className="text-purple-400 w-3 h-3" />
                                                    </div>
                                                    <span className="text-gray-300">
                                                        <span className="font-semibold">
                                                            {plan.chat_limit}
                                                        </span>{" "}
                                                        AI Conversations
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                                        <FaImage className="text-blue-400 w-3 h-3" />
                                                    </div>
                                                    <span className="text-gray-300">
                                                        <span className="font-semibold">
                                                            {plan.image_limit}
                                                        </span>{" "}
                                                        Image Generations
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                                                        <FaHeadphones className="text-cyan-400 w-3 h-3" />
                                                    </div>
                                                    <span className="text-gray-300">
                                                        <span className="font-semibold">
                                                            {plan.audio_limit}
                                                        </span>{" "}
                                                        Audio Conversions
                                                    </span>
                                                </li>
                                                {plan.name !== "Basic" && (
                                                    <li className="flex">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                                            <FaCheck className="text-green-400 w-3 h-3" />
                                                        </div>
                                                        <span className="text-gray-300">
                                                            Priority Support
                                                        </span>
                                                    </li>
                                                )}
                                                {plan.name === "Enterprise" && (
                                                    <li className="flex">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                                            <FaCheck className="text-green-400 w-3 h-3" />
                                                        </div>
                                                        <span className="text-gray-300">
                                                            Custom AI
                                                            Integration
                                                        </span>
                                                    </li>
                                                )}
                                            </ul>

                                            {/* CTA Button */}
                                            <Link href="/subscription-plans">
                                                <button
                                                    className={`w-full py-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                                                        plan.name === "Pro"
                                                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                                                            : "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                                                    }`}
                                                >
                                                    <span className="flex items-center">
                                                        {plan.price > 0
                                                            ? "Select Plan"
                                                            : "Start Free"}
                                                        <FaArrowRight className="ml-2 w-4 h-4" />
                                                    </span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Compare Section - Enhanced Original Design */}
                <section className="py-24 relative">
                    {/* Enhanced background with subtle animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900  to-gray-900 z-0">
                        <div className="absolute inset-0 bg-[url('/stars-pattern.svg')] opacity-20"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        {/* Enhanced Heading */}
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
                                PREMIUM COMPARISON
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                All Premium AI Models in One Platform
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Get access to the world's leading AI models for
                                a fraction of the cost
                            </p>
                        </div>

                        {/* Enhanced Cards Container with 3D effect */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                            {/* Card 1: Individual Premium AI Models - Enhanced */}
                            <div className="backdrop-blur-xl bg-white/5 shadow-2xl rounded-3xl p-10 border border-white/10 hover:border-purple-500/30 transition-all hover:translate-y-[-8px] duration-300">
                                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                                    <span className="bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mr-4 text-gray-300 shadow-lg">
                                        1
                                    </span>
                                    Individual Premium AI Models
                                </h3>
                                <ul className="space-y-6">
                                    {individualAIModels.map((model, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between group"
                                        >
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                                                    {model.icon}
                                                </span>
                                                <span className="text-gray-200 font-medium">
                                                    {model.name}
                                                </span>
                                            </div>
                                            <span className="text-gray-300 font-bold">
                                                {model.price}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10 pt-6 border-t border-white/20">
                                    <p className="text-xl text-gray-200 flex items-center justify-between">
                                        <span className="font-semibold">
                                            Total Cost:
                                        </span>
                                        <span className="line-through text-red-400 font-bold">
                                            $147+ per month
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: All-in-One Premium Package - Enhanced */}
                            <div className="bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-purple-900/40 backdrop-blur-xl shadow-2xl rounded-3xl p-10 text-white border border-white/10 hover:border-blue-500/40 transition-all hover:translate-y-[-8px] duration-300 relative overflow-hidden">
                                {/* Best Value Badge */}
                                <div className="absolute top-0 right-0">
                                    <div className="bg-blue-600 text-white text-xs font-bold px-6 py-1 rounded-bl-lg rounded-tr-lg shadow-lg">
                                        BEST VALUE
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-8 flex items-center">
                                    <span className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-lg">
                                        2
                                    </span>
                                    {appSetting?.companyName || "OSChat"}{" "}
                                    All-in-One Package
                                </h3>
                                <ul className="space-y-6">
                                    {individualAIModels.map((model, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center group"
                                        >
                                            <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                                                {model.icon}
                                            </span>
                                            <span className="font-medium">
                                                {model.name}
                                            </span>
                                            <span className="ml-auto bg-green-500/20 p-1 rounded-full">
                                                <FaCheck className="text-green-400" />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10 pt-6 border-t border-white/20">
                                    <p className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            Total Cost:
                                        </span>
                                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            $49/month
                                        </span>
                                    </p>
                                </div>
                                <Link href="/subscription-plans">
                                    <button className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl flex items-center justify-center gap-2">
                                        Get Started Now
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Why Choose Us Section - Enhanced */}
                        <div className="mt-24 max-w-6xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-12 text-center">
                                Why Choose Our All-in-One Package?
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    {
                                        icon: (
                                            <FaRocket className="w-8 h-8 text-purple-400" />
                                        ),
                                        title: "Cost-Effective",
                                        description:
                                            "Save over $100/month compared to individual subscriptions.",
                                        color: "border-purple-500/30",
                                    },
                                    {
                                        icon: (
                                            <FaLightbulb className="w-8 h-8 text-blue-400" />
                                        ),
                                        title: "Convenience",
                                        description:
                                            "Access all premium AI models under one subscription.",
                                        color: "border-blue-500/30",
                                    },
                                    {
                                        icon: (
                                            <FaBrain className="w-8 h-8 text-cyan-400" />
                                        ),
                                        title: "Exclusive Features",
                                        description:
                                            "Get additional AI tools not available elsewhere.",
                                        color: "border-cyan-500/30",
                                    },
                                    {
                                        icon: (
                                            <FaShieldAlt className="w-8 h-8 text-green-400" />
                                        ),
                                        title: "Enterprise Security",
                                        description:
                                            "Built-in data protection and privacy controls.",
                                        color: "border-green-500/30",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl border ${item.color} hover:bg-white/10 transition-all text-white transform hover:translate-y-[-5px] duration-300`}
                                    >
                                        <div className="mb-6 bg-white/10 p-4 rounded-2xl inline-block">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-xl font-semibold text-white mb-3">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-300">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action - Enhanced */}
                        <div className="mt-16 text-center">
                            <Link href="/subscription-plans">
                                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-2xl">
                                    Get Started for $49/month
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials " className="mt-10 py-24 relative ">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-lg">
                            What Our Users Are Saying
                        </h2>
                        <TestimonialCarousel />
                    </div>
                </section>

                {/* Footer Section */}
                <footer>
                    <div className="container mx-auto px-6 ">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            {/* Branding */}
                            <div className="mb-4 md:mb-0">
                                <h4 className="text-white text-2xl font-bold drop-shadow-lg">
                                    {appSetting?.companyName}
                                </h4>
                                <p className="mt-2 text-sm text-white">
                                    {appSetting?.tagLine}
                                </p>
                            </div>
                        </div>
                        {/* Copyright */}
                        <div className="mt-8 border-t border-white/20 pt-4 text-center text-sm text-gray-100">
                            <p>{appSetting?.footer}. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
