import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SideNav from "../Components/SideNav";
import { FaPlay, FaStop, FaPaperPlane, FaMicrophone } from "react-icons/fa";
import { IoMdVolumeHigh } from "react-icons/io";
import { Head } from "@inertiajs/react";

const TTSGenerate = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedVoice, setSelectedVoice] = useState("alloy");
    const [textInput, setTextInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [playingAudio, setPlayingAudio] = useState(null);

    const messagesEndRef = useRef(null);
    const mainContainerRef = useRef(null);
    const audioRef = useRef(null);

    const handleOpenNewConversation = () => {
        setSelectedConversation(null);
        setConversationMessages([]);
        setTextInput("");
        setError(null);
        setPlayingAudio(null);
        setSelectedVoice("alloy");
        setLoading(false);
        setIsSidebarOpen(true);
    };
    // Voice options with additional metadata
    const voiceOptions = [
        { id: "alloy", name: "Alloy", description: "Neutral & balanced" },
        { id: "echo", name: "Echo", description: "Deep & resonant" },
        { id: "fable", name: "Fable", description: "Warm & friendly" },
        { id: "onyx", name: "Onyx", description: "Authoritative & strong" },
        { id: "nova", name: "Nova", description: "Soft & smooth" },
        { id: "shimmer", name: "Shimmer", description: "Clear & bright" },
    ];

    useEffect(() => {
        axios
            .get("/conversations")
            .then((response) => setConversations(response.data.conversations))
            .catch((error) =>
                console.error("Error loading conversations:", error)
            );
    }, []);

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    const playAudio = (audioPath) => {
        const audioUrl = `${window.location.origin}/storage/${audioPath}`;
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
            setPlayingAudio(audioPath);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlayingAudio(null);
        }
    };

    const handleGenerateSpeech = async () => {
        if (!textInput.trim()) {
            setError("Please enter some text.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/generate-tts", {
                text: textInput,
                voice: selectedVoice,
                conversation_type: "text-to-speech",
            });

            if (response.data.error) {
                if (response.data.error === "Audio limit exceeded") {
                    window.location.href = `/subscription-plans?error=${encodeURIComponent(
                        response.data.error
                    )}`;
                }
            }

            axios
                .get("/conversations")
                .then((response) =>
                    setConversations(response.data.conversations)
                )
                .catch((error) =>
                    console.error("Error loading conversations:", error)
                );

            // Create or update conversation
            const newConversation = {
                id: response.data.conversation_id,
                title: "Text to Speech",
            };

            setConversations((prev) => [
                newConversation,
                ...prev.filter((c) => c.id !== newConversation.id),
            ]);

            setSelectedConversation(newConversation);

            // Add user input message
            setConversationMessages((prev) => [
                ...prev,
                { sender: "user", type: "text", content: textInput },
            ]);

            // Add generated audio message
            setConversationMessages((prev) => [
                ...prev,
                {
                    sender: "assistant",
                    type: "audio",
                    content: response.data.audio_url,
                },
            ]);

            setTextInput(""); // Clear input field
        } catch (err) {
            setError("Failed to generate speech.");
        }

        setLoading(false);
    };

    // Handle keyboard shortcut for generating speech
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerateSpeech();
        }
    };

    return (
        <>
            <Head title="Text to Speech" />
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <SideNav
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    conversations={conversations.filter(
                        (c) => c.type === "text-to-speech"
                    )}
                    onSelectConversation={setSelectedConversation}
                    selectedConversation={selectedConversation}
                    setConversations={setConversations}
                    onNewConversation={handleOpenNewConversation}
                />

                {/* Main Content */}
                <div
                    className="flex-1 flex flex-col transition-all duration-300 relative"
                    style={{ marginLeft: isSidebarOpen ? "18rem" : "5rem" }}
                >
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 flex justify-between items-center">
                        <div className="flex items-center">
                            <IoMdVolumeHigh className="text-indigo-600 text-2xl mr-2" />
                            <h1 className="text-xl font-bold text-gray-800">
                                Text to Speech
                            </h1>
                        </div>

                        <div className="relative group">
                            {/* Selected Voice Display */}
                            <div className="bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-2 rounded-lg shadow-sm cursor-pointer flex items-center justify-between w-48">
                                <span className="font-medium">
                                    {
                                        voiceOptions.find(
                                            (v) => v.id === selectedVoice
                                        )?.name
                                    }
                                </span>
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>

                            {/* Fancy Dropdown Menu */}
                            <div className="absolute z-10 right-0">
                                <div className=" mt-2 hidden group-hover:block right-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-64">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Choose a Voice
                                    </p>
                                    <ul className="space-y-2">
                                        {voiceOptions.map((voice) => (
                                            <li
                                                key={voice.id}
                                                onClick={() =>
                                                    setSelectedVoice(voice.id)
                                                }
                                                className={`flex justify-between items-center text-sm px-3 py-2 rounded-md cursor-pointer transition-colors 
                                        ${
                                            selectedVoice === voice.id
                                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                                : "hover:bg-gray-100 text-gray-600"
                                        }`}
                                            >
                                                <span>{voice.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {voice.description}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Chat Section */}
                    <main className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="max-w-4xl mx-auto space-y-4 mb-24">
                            {conversationMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-96 text-center">
                                    <FaMicrophone className="text-6xl text-indigo-200 mb-4" />
                                    <h2 className="text-2xl font-semibold text-gray-700">
                                        Convert Text to Natural Speech
                                    </h2>
                                    <p className="text-gray-500 mt-2 max-w-lg">
                                        Enter your text below and select a voice
                                        to convert it into natural-sounding
                                        speech. Perfect for content creation,
                                        accessibility, and more.
                                    </p>
                                </div>
                            ) : (
                                conversationMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`rounded-2xl px-6 py-4 max-w-lg shadow-sm ${
                                                msg.sender === "user"
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-white border border-gray-200"
                                            }`}
                                        >
                                            {msg.type === "text" ? (
                                                <p className="text-sm md:text-base">
                                                    {msg.content}
                                                </p>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`font-medium ${
                                                            msg.sender ===
                                                            "user"
                                                                ? "text-white"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        Generated Audio
                                                    </span>
                                                    <div className="flex items-center bg-gray-100 p-2 rounded-full">
                                                        <button
                                                            onClick={() =>
                                                                playAudio(
                                                                    msg.content
                                                                )
                                                            }
                                                            className={`text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none ${
                                                                playingAudio ===
                                                                msg.content
                                                                    ? "hidden"
                                                                    : ""
                                                            }`}
                                                            aria-label="Play audio"
                                                        >
                                                            <FaPlay size={16} />
                                                        </button>
                                                        <button
                                                            onClick={stopAudio}
                                                            className={`text-red-600 hover:text-red-800 transition-colors focus:outline-none ${
                                                                playingAudio !==
                                                                msg.content
                                                                    ? "hidden"
                                                                    : ""
                                                            }`}
                                                            aria-label="Stop audio"
                                                        >
                                                            <FaStop size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </main>

                    {/* Input Area */}
                    <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
                        <div className="max-w-4xl mx-auto">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3 rounded">
                                    <p className="text-red-700 text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}
                            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm">
                                <textarea
                                    value={textInput}
                                    onChange={(e) =>
                                        setTextInput(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter text to convert to speech..."
                                    className="flex-1 py-3 px-4 bg-transparent rounded-l-full focus:outline-none focus:border-r-0 border border-l-0 border-y-0 border-r-gray-200  resize-none max-h-32"
                                    rows={1}
                                    style={{
                                        overflow: "auto",
                                        height:
                                            textInput.split("\n").length > 3
                                                ? "auto"
                                                : "52px",
                                    }}
                                />
                                <button
                                    onClick={handleGenerateSpeech}
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 mx-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    aria-label="Generate speech"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Press Enter to generate speech. Shift+Enter for
                                new line.
                            </p>
                        </div>
                    </footer>
                </div>
                <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />
            </div>
        </>
    );
};

export default TTSGenerate;
