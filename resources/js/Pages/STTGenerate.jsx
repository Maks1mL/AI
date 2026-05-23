import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SideNav from "../Components/SideNav";
import {
    FaPlay,
    FaStop,
    FaPaperPlane,
    FaMicrophone,
    FaFileAlt,
    FaHeadphones,
} from "react-icons/fa";
import { IoMdVolumeHigh, IoMdDocument } from "react-icons/io";
import { RiTranslate } from "react-icons/ri";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { Head } from "@inertiajs/react";

const STTGenerate = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedModel, setSelectedModel] = useState("whisper-1");
    const [recording, setRecording] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [transcription, setTranscription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [playingAudio, setPlayingAudio] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Model options with additional metadata
    const modelOptions = [
        {
            id: "whisper-1",
            name: "Whisper v1",
            description: "Standard accuracy",
        },
        {
            id: "whisper-enhanced",
            name: "Whisper Enhanced",
            description: "High accuracy",
        },
        {
            id: "whisper-multilingual",
            name: "Whisper Multilingual",
            description: "Multiple languages",
        },
    ];

    const handleOpenNewChat = () => {
        setSelectedConversation(null);
        setConversationMessages([]);
        setFileName("");
        setAudioFile(null);
        setTranscription("");
        setError(null);
        setPlayingAudio(null);
        setRecording(false);
        setLoading(false);
    }
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
            setFileName(file.name);
            // Read the file if needed
            const reader = new FileReader();
            reader.onload = (event) => {
                // Handle the loaded file data if needed
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/mpeg",
                });
                setAudioFile(
                    new File([audioBlob], "recorded_audio.mp3", {
                        type: "audio/mpeg",
                    })
                );
                setFileName("recorded_audio.mp3");
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            setError("Could not access microphone. Please check permissions.");
            console.error("Error accessing media devices:", err);
        }
    };


    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            // Stop all tracks
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    const handleTranscribe = async () => {
        if (!audioFile) {
            setError("Please upload an audio file or record audio first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("model", selectedModel);
        formData.append("conversation_type", "speech_to_text" || null);

        try {
            const response = await axios.post("/transcribe-audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.error) {
                if (response.data.error === "Transcription limit exceeded") {
                    window.location.href = `/subscription-plans?error=${encodeURIComponent(
                        response.data.error
                    )}`;
                } else {
                    setError(response.data.error);
                }
                return;
            }

            axios
            .get("/conversations")
            .then((response) => setConversations(response.data.conversations))
            .catch((error) =>
                console.error("Error loading conversations:", error)
            );

            // Create or update conversation
            const newConversation = {
                id: response.data.conversation_id,
                title: "Speech to Text",
            };

            setConversations((prev) => [
                newConversation,
                ...prev.filter((c) => c.id !== newConversation.id),
            ]);

            setSelectedConversation(newConversation);

            // Add audio input message
            setConversationMessages((prev) => [
                ...prev,
                {
                    sender: "user",
                    type: "audio",
                    content: response.data.audio_url,
                    filename: fileName,
                },
            ]);

            // Add transcription message
            setConversationMessages((prev) => [
                ...prev,
                {
                    sender: "assistant",
                    type: "text",
                    content: response.data.transcription,
                },
            ]);

            setTranscription(response.data.transcription);
            setAudioFile(null);
            setFileName("");
        } catch (err) {
            setError("Failed to transcribe audio. Please try again.");
            console.error("Transcription error:", err);
        }

        setLoading(false);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Head title="Speech to Text"/>
            {/* Sidebar */}
            <SideNav
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                conversations={conversations.filter(
                    (c) => c.type === "speech_to_text"
                )}
                onSelectConversation={setSelectedConversation}
                selectedConversation={selectedConversation}
                setConversations={setConversations}
                onNewConversation={handleOpenNewChat}
            />

            {/* Main Content */}
            <div
                className="flex-1 flex flex-col transition-all duration-300 relative"
                style={{ marginLeft: isSidebarOpen ? "18rem" : "5rem" }}
            >
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <HiOutlineSpeakerWave className="text-indigo-600 text-2xl mr-2" />
                        <h1 className="text-xl font-bold text-gray-800">
                            Speech to Text
                        </h1>
                    </div>
                </header>

                {/* Chat Section */}
                <main className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="max-w-4xl mx-auto space-y-4 mb-24">
                        {conversationMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <div className="relative">
                                    <FaMicrophone className="text-6xl text-indigo-200 mb-4" />
                                    <RiTranslate className="text-3xl text-indigo-500 absolute -right-4 -bottom-2" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    Convert Speech to Text
                                </h2>
                                <p className="text-gray-500 mt-2 max-w-lg">
                                    Upload an audio file or record your voice to
                                    convert speech into text. Perfect for
                                    transcriptions, notes, and more.
                                </p>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                        <FaFileAlt className="text-3xl text-indigo-400 mb-2" />
                                        <h3 className="font-medium text-gray-800">
                                            Upload Audio
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center mt-1">
                                            Upload existing audio files for
                                            transcription
                                        </p>
                                        <button
                                            onClick={handleFileUploadClick}
                                            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                                        >
                                            Select File
                                        </button>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                        <FaHeadphones className="text-3xl text-indigo-400 mb-2" />
                                        <h3 className="font-medium text-gray-800">
                                            Record Audio
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center mt-1">
                                            Use your microphone to record audio
                                            on the fly
                                        </p>
                                        <button
                                            onClick={
                                                recording
                                                    ? stopRecording
                                                    : startRecording
                                            }
                                            className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                recording
                                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                            }`}
                                        >
                                            {recording
                                                ? "Stop Recording"
                                                : "Start Recording"}
                                        </button>
                                    </div>
                                </div>
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
                                        {msg.sender === "assistant" ? (
                                            <div>
                                                <p className="text-sm text-gray-600 md:text-base">
                                                    {msg.content}
                                                </p>
                                                {msg.sender === "assistant" && (
                                                    <div className="mt-2 flex justify-end">
                                                        <button
                                                            className="text-xs text-indigo-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    msg.content
                                                                );
                                                            }}
                                                        >
                                                            <IoMdDocument
                                                                size={14}
                                                            />
                                                            Copy
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`font-medium ${
                                                        msg.sender === "user"
                                                            ? "text-white"
                                                            : "text-gray-800"
                                                    }`}
                                                >
                                                    {msg.filename || "Audio"}
                                                </span>
                                                <div className="flex items-center bg-gray-100 p-2 rounded-full">
                                                    <button
                                                        onClick={() =>
                                                            playAudio(
                                                                msg.filePath
                                                            )
                                                        }
                                                        className={`text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none ${
                                                            playingAudio ===
                                                            msg.filePath
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
                                                            msg.filePath
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
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* File selection status */}
                        {fileName && (
                            <div className="bg-indigo-50 p-3 mb-3 rounded-lg flex items-center justify-between ">
                                <div className="flex items-center ">
                                    <IoMdVolumeHigh className="text-indigo-500 mr-2" />
                                    <span className="text-sm text-indigo-700 font-medium">
                                        {fileName}
                                    </span>
                                    <span className="text-xs text-gray-500 pl-2">
                                        {audioFile.size / 1024 / 1024 > 25
                                            ? "File too large"
                                            : `${(
                                                  audioFile.size / 1024
                                              ).toFixed(2)} KB`}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FaPlay
                                        size={14}
                                        className="text-indigo-500 cursor-pointer hover:text-indigo-700"
                                        onClick={() => {
                                            if (audioRef.current) {
                                                const audioURL =
                                                    URL.createObjectURL(
                                                        audioFile
                                                    );
                                                audioRef.current.src = audioURL;
                                                audioRef.current.play();
                                            }
                                        }}
                                        title="Play audio preview"
                                    />
                                    <FaStop
                                        size={14}
                                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                                        onClick={() => {
                                            if (audioRef.current) {
                                                audioRef.current.pause();
                                                audioRef.current.currentTime = 0;
                                            }
                                        }}
                                        title="Stop audio preview"
                                    />

                                    <button
                                        onClick={() => {
                                            setAudioFile(null);
                                            setFileName("");
                                        }}
                                        className="text-red-500 hover:text-red-700 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recording status */}
                        {recording && (
                            <div className="bg-red-50 p-3 mb-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                    <span className="text-sm text-red-700 font-medium">
                                        Recording in progress...
                                    </span>
                                </div>
                                <button
                                    onClick={stopRecording}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Stop
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="audio/*"
                                className="hidden"
                            />

                            <button
                                onClick={handleFileUploadClick}
                                className="bg-white text-indigo-600 border border-gray-300 rounded-full p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                aria-label="Upload audio file"
                            >
                                <FaFileAlt size={16} />
                            </button>

                            <button
                                onClick={
                                    recording ? stopRecording : startRecording
                                }
                                className={`rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    recording
                                        ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                                        : "bg-white text-indigo-600 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500"
                                }`}
                                aria-label={
                                    recording
                                        ? "Stop recording"
                                        : "Start recording"
                                }
                            >
                                <FaMicrophone
                                    size={16}
                                    className={recording ? "animate-pulse" : ""}
                                />
                            </button>

                            <div className="flex-1 flex">
                                <button
                                    onClick={handleTranscribe}
                                    disabled={
                                        loading || (!audioFile && !recording)
                                    }
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Transcribing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Transcribe Audio</span>
                                            <FaPaperPlane size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Supported formats: MP3, WAV, M4A, FLAC, OGG (max
                            25MB)
                        </p>
                    </div>
                </footer>
            </div>
            <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />
        </div>
    );
};

export default STTGenerate;
