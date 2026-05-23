import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SideNav from "../Components/SideNav";
import {
    FaUpload,
    FaImage,
    FaRobot,
    FaUser,
    FaTimes,
    FaPaperPlane,
} from "react-icons/fa";
import { Head } from "@inertiajs/react";

const ImageUpload = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleOpenNewConversation = () => {
        setSelectedConversation(null);
        setConversationMessages([]);
        setPrompt("");
        setImagePreview(null);
        setSelectedFile(null);
        setError(null);
        setLoading(false);
    };
    // Load existing conversations on mount
    useEffect(() => {
        axios
            .get("/conversations")
            .then((response) => setConversations(response.data.conversations))
            .catch((error) =>
                console.error("Error loading conversations:", error)
            );
    }, []);

    // Load messages when a conversation is selected
    useEffect(() => {
        if (selectedConversation) {
            axios
                .get(`/conversations/${selectedConversation.id}`)
                .then((response) =>
                    setConversationMessages(response.data.messages)
                )
                .catch((error) =>
                    console.error("Error loading conversation messages:", error)
                );
        } else {
            setConversationMessages([]);
        }
    }, [selectedConversation]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    // Handle file selection and preview
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate image type
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
            setError(
                "Invalid file type. Please upload a JPG, PNG, or WEBP image."
            );
            return;
        }

        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleAnalyzeImage = async () => {
        if (!selectedFile) {
            setError("Please upload an image.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("prompt", prompt);
        formData.append("conversation_type", "image_analysis");

        try {
            const response = await axios.post("/analyze-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            // Create or update conversation
            const newConversation = {
                id: response.data.conversation_id,
                title: "Image Analysis",
            };

            setConversations((prev) => [
                newConversation,
                ...prev.filter((c) => c.id !== newConversation.id),
            ]);

            setSelectedConversation(newConversation);

            // Add user request message
            setConversationMessages((prev) => [
                ...prev,
                {
                    sender: "user",
                    type: "text",
                    content: prompt,
                    image: imagePreview,
                },
            ]);

            // Add AI response message
            setConversationMessages((prev) => [
                ...prev,
                {
                    sender: "assistant",
                    type: "text",
                    content: response.data.ai_response,
                },
            ]);

            setSelectedFile(null); // Clear input
            setImagePreview(null);
            setPrompt("");
        } catch (err) {
            setError("Failed to analyze image.");
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (selectedFile && prompt.trim()) {
                handleAnalyzeImage();
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Head title="Image Analyzer" />

            {/* Sidebar */}
            <SideNav
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                conversations={conversations.filter(
                    (c) => c.type === "image_analysis"
                )}
                onSelectConversation={setSelectedConversation}
                selectedConversation={selectedConversation}
                setConversations={setConversations}
                onNewConversation={handleOpenNewConversation}
            />

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? "ml-[18rem]" : "ml-[5rem]"
                }`}
            >
                {/* Header */}
                <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaRobot className="mr-3 text-indigo-600" />
                            <span>Image Analyzer</span>
                        </h1>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
                    <div className="max-w-4xl mx-auto">
                        {conversationMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                <div className="bg-indigo-600 text-white rounded-full p-6 mb-6">
                                    <FaRobot className="text-5xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                    Welcome to Image Analyzer
                                </h2>
                                <p className="text-gray-600 max-w-md mb-8">
                                    Upload an image and ask a question to get
                                    AI-powered insights and analysis.
                                </p>
                                <div className="flex items-center space-x-4 text-gray-500">
                                    <div className="flex items-center">
                                        <FaUpload className="mr-2" />
                                        <span>Upload Image</span>
                                    </div>
                                    <div>→</div>
                                    <div className="flex items-center">
                                        <FaPaperPlane className="mr-2" />
                                        <span>Ask Question</span>
                                    </div>
                                    <div>→</div>
                                    <div className="flex items-center">
                                        <FaRobot className="mr-2" />
                                        <span>Get Analysis</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {conversationMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-3xl rounded-2xl shadow-sm p-5 ${
                                                msg.sender === "user"
                                                    ? "bg-indigo-600 text-white rounded-br-none"
                                                    : "bg-white rounded-bl-none"
                                            }`}
                                        >
                                            <div className="flex items-center mb-3">
                                                {msg.sender === "user" ? (
                                                    <>
                                                        <FaUser className="mr-2 text-indigo-100" />
                                                        <span className="font-medium">
                                                            You
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRobot className="mr-2 text-indigo-600" />
                                                        <span className="font-medium text-gray-800">
                                                            AI Assistant
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Show uploaded image in user message */}
                                            {msg.filePath && (
                                                <div className="mb-3">
                                                    <img
                                                        src={`http://localhost:8000/storage/${msg.filePath}`}
                                                        alt="Uploaded"
                                                        className="max-h-60 rounded-lg"
                                                    />
                                                </div>
                                            )}

                                            <p
                                                className={`whitespace-pre-line ${
                                                    msg.sender === "user"
                                                        ? "text-indigo-50"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {msg.content}
                                            </p>

                                            <div
                                                className={`text-xs mt-2 text-right ${
                                                    msg.sender === "user"
                                                        ? "text-indigo-200"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {new Date().toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                                <button
                                    onClick={() => setError(null)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}

                        <div className="flex items-end space-x-4">
                            {/* Image Upload/Preview */}
                            <div className="flex-shrink-0">
                                {imagePreview ? (
                                    <div className="relative h-16 w-16">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-16 w-16 rounded-lg object-cover border border-gray-300"
                                        />
                                        <button
                                            onClick={() => {
                                                setImagePreview(null);
                                                setSelectedFile(null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                                            title="Remove image"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={triggerFileInput}
                                        className="h-16 w-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                        title="Upload image"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <FaImage className="text-xl text-gray-500 hover:text-indigo-600" />
                                    </button>
                                )}
                            </div>

                            {/* Text Input */}
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Ask something about the image..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleAnalyzeImage}
                                    disabled={
                                        loading ||
                                        !selectedFile ||
                                        !prompt.trim()
                                    }
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition ${
                                        loading ||
                                        !selectedFile ||
                                        !prompt.trim()
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-indigo-600 hover:bg-indigo-100"
                                    }`}
                                >
                                    {loading ? (
                                        <svg
                                            className="animate-spin h-5 w-5"
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
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-2 text-center">
                            {selectedFile
                                ? `${selectedFile.name} (${Math.round(
                                      selectedFile.size / 1024
                                  )} KB) - Press Enter to analyze`
                                : "Upload an image first, then ask your question"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
