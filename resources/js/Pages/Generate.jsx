// resources/js/Pages/Generate.jsx
import React, { useState, useRef, useEffect, Link } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import SideNav from "../Components/SideNav";
import { FaArrowUp, FaCopy, FaDownload } from "react-icons/fa"; // Import copy and download icons
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Head } from "@inertiajs/react";
const CodeBlock = ({ inline, children, ...props }) => {
    const handleCopy = () => {
        const codeText = children && children[0] ? children[0] : "";
        navigator.clipboard
            .writeText(codeText)
            .then(() => console.log("Copied to clipboard!"))
            .catch((err) => console.error("Failed to copy text: ", err));
    };

    if (inline) {
        return (
            <code
                className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm"
                {...props}
            >
                {children}
            </code>
        );
    } else {
        return (
            <div className="relative my-4">
                <div className="p-4 bg-[#0D1117] rounded-lg">
                    <div>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 text-sm text-gray-700 bg-white hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 shadow-md flex items-center gap-2 transition ease-in-out duration-150 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FaCopy className="text-gray-600" />
                            <span>Copy</span>
                        </button>
                    </div>
                    <pre
                        className="bg-white text-gray-800 p-4 rounded-lg overflow-auto border border-gray-200 shadow-sm"
                        {...props}
                    >
                        <code className="text-sm">{children}</code>
                    </pre>
                </div>
            </div>
        );
    }
};

const renderDownloadableImage = (
    src,
    alt,
    mimeType = "image/png",
    filename = "generated-image.png"
) => (
    <div className="relative">
        <img
            src={`data:${mimeType};base64,${src}`}
            alt={alt}
            className="max-w-full h-auto rounded-md shadow"
        />
        <a
            href={`data:${mimeType};base64,${src}`}
            download={filename}
            className="absolute top-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
        >
            <FaDownload />
        </a>
    </div>
);

const Generate = ({ textModels, imageModels }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mode, setMode] = useState(localStorage.getItem("mode") || "chat");
    const [isPhotoStudioDropdownOpen, setIsPhotoStudioDropdownOpen] =
        useState(false);
    const [selectedImageModel, setSelectedImageModel] = useState("dall-e-3");


    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [initImage, setInitImage] = useState(null);
    const [img2imgResult, setImg2imgResult] = useState(null);
    const [bgImage, setBgImage] = useState(null);
    const [bgRemovedImage, setBgRemovedImage] = useState(null);
    const [upscaleImage, setUpscaleImage] = useState(null);
    const [originalUpscaleImage, setOriginalUpscaleImage] = useState(null);
    const [upscaledImage, setUpscaledImage] = useState(null);
    const [generatedLogo, setGeneratedLogo] = useState(null);
    const [logoType, setLogoType] = useState("Modern");
    const [logoStyle, setLogoStyle] = useState("Minimal");
    const [logoColor, setLogoColor] = useState("Blue");
    const messagesEndRef = useRef(null);
    const mainContainerRef = useRef(null);



    const photoStudioOptions = [
        { label: "Image", value: "image" },
        { label: "Img2Img", value: "img2img" },
        { label: "Remove BG", value: "bgremover" },
        { label: "Upscale", value: "upscale" },
        { label: "Logo", value: "logo" },
    ];

    // For Chat mode only.
    const availableModels =
        mode === "chat"
            ? [
                  ...textModels,
                  {
                      id: "gpt-3.5-turbo-0125",
                      name: "OpenAI GPT-3.5 Turbo",
                      isComingSoon: true,
                  },
                  {
                      id: "gpt-4.0",
                      name: "OpenAI GPT-4.0",
                      isComingSoon: true,
                  },
                  {
                      id: "gpt-4.0-turbo",
                      name: "OpenAI GPT-4.0 Turbo",
                      isComingSoon: true,
                  },
              ]
            : [
                  ...imageModels,
                  {
                      id: "dall-e-2",
                      name: "DALL-E-2",
                      isComingSoon: true,
                  },
                  {
                      id: "dall-e-3",
                      name: "DALL-E-3",
                      isComingSoon: true,
                  },
              ];

    const [selectedModel, setSelectedModel] = useState(
        localStorage.getItem("selectedModel") || availableModels[0]?.name
    );

    const handleNewConversation = () => {
        setSelectedConversation(null);
        setConversationMessages([]);
    };

    // Helper function for chat mode
    const handleChat = async () => {
        if (!selectedConversation) {
            try {
                const response = await axios.post("/conversations", { prompt });
                const convo = response.data.conversation;
                setSelectedConversation(convo);
                setConversationMessages((prev) => [
                    ...prev,
                    { sender: "user", type: "text", content: prompt },
                ]);
                submitChat(convo.id, prompt);
                setConversations((prev_1) => [convo, ...prev_1]);
            } catch (err) {
                console.error("Error creating conversation:", err);
                throw err; // Re-throw the error to handle it in handleSubmit
            }
        } else {
            setConversationMessages((prev) => [
                ...prev,
                { sender: "user", type: "text", content: prompt },
            ]);
            submitChat(selectedConversation.id, prompt);
            return Promise.resolve(); // No API call needed
        }
    };
    // Helper function for img2img mode
    const handleImg2Img = async () => {
        if (!initImage) {
            alert("Please select an initial image.");
            return Promise.reject(new Error("No initial image selected"));
        }

        const formData = new FormData();
        formData.append("init_image", initImage);
        formData.append("prompt", prompt);
        formData.append("image_strength", 0.35);
        formData.append("cfg_scale", 7);
        formData.append("samples", 1);
        formData.append("steps", 30);

        try {
            const response = await axios.post("/generate-img2img", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImg2imgResult(response.data.image_base64);
        } catch (error) {
            console.error("Error generating image-to-image:", error);
            setImg2imgResult(null);
            throw error; // Re-throw the error to handle it in handleSubmit
        }
    };
    // Helper function for bgremover mode
    const handleBgRemover = async () => {
        if (!bgImage) {
            alert("Please select an image to remove the background.");
            return Promise.reject(
                new Error("No image selected for background removal")
            );
        }

        const formData = new FormData();
        formData.append("image", bgImage);
        formData.append("output_format", "webp");

        try {
            const response = await axios.post("/remove-background", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setBgRemovedImage(response.data.image_base64);
        } catch (error) {
            console.error("Error removing background:", error);
            setBgRemovedImage(null);
            throw error; // Re-throw the error to handle it in handleSubmit
        }
    };

    // Helper function for upscale mode
    const handleUpscale = async () => {
        if (!upscaleImage) {
            alert("Please select an image to upscale.");
            return Promise.reject(new Error("No image selected for upscaling"));
        }

        const formData = new FormData();
        formData.append("image", upscaleImage);
        formData.append("output_format", "webp");

        try {
            const response = await axios.post("/upscale", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setOriginalUpscaleImage(response.data.original_image_base64);
            setUpscaledImage(response.data.upscaled_image_base64);
        } catch (error) {
            console.error("Error upscaling image:", error);
            setOriginalUpscaleImage(null);
            setUpscaledImage(null);
            throw error; // Re-throw the error to handle it in handleSubmit
        }
    };

    // Helper function for logo mode
    const handleLogo = async () => {
        try {
            const response = await axios.post("/generate-logo", {
                prompt,
                type: logoType,
                style: logoStyle,
                color: logoColor,
            });
            setGeneratedLogo(response.data.logo_base64);
        } catch (error) {
            console.error("Error generating logo:", error);
            setGeneratedLogo(null);
            throw error; // Re-throw the error to handle it in handleSubmit
        }
    };

    // Helper function for image mode
    const handleImage = async () => {
        try {
            const response = await axios.post("/generate", {
                model: selectedImageModel,
                prompt: prompt,
            });
            setGeneratedImage(response.data.image_base64);
        } catch (error) {
            console.error("Error generating image:", error);
            setGeneratedImage(null);
            throw error; // Re-throw the error to handle it in handleSubmit
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        let apiCallPromise;

        switch (mode) {
            case "chat":
                apiCallPromise = handleChat();
                break;
            case "img2img":
                apiCallPromise = handleImg2Img();
                break;
            case "bgremover":
                apiCallPromise = handleBgRemover();
                break;
            case "upscale":
                apiCallPromise = handleUpscale();
                break;
            case "logo":
                apiCallPromise = handleLogo();
                break;
            case "image":
                apiCallPromise = handleImage();
                break;
            default:
                apiCallPromise = handleDefault();
        }

        apiCallPromise
            .then(() => {
                setPrompt("");
            })
            .catch((error) => {
                console.error("Error in handleSubmit:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSetMode = (mode) => {
        localStorage.setItem("mode", mode);
        setMode(mode);
    };


    const submitChat = async (conversationId, prompt) => {
        try {
            const model_id = availableModels.find(
                (model) => model.name === selectedModel
            )?.id;
            const response = await axios.post("/generate", {
                model: model_id,
                prompt,
                conversation_id: conversationId,
            });
            const assistantMessage = {
                sender: "assistant",
                type: "text",
                content: response.data.text,
            };
            if (response.data.error) {
                if (
                    response.data.error === "Chat limit exceeded" ||
                    response.data.error === "Image limit exceeded"
                ) {
                    window.location.href = `/subscription-plans?error=${encodeURIComponent(
                        response.data.error
                    )}`;
                }
            }
            setConversationMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error generating chat:", error.response.data.error);
            const errorMessage = {
                sender: "assistant",
                type: "text",
                content:
                    error.response.data.error ||
                    "An error occurred while generating text.",
            };
            setConversationMessages((prev) => [...prev, errorMessage]);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sidebarWidth = isSidebarOpen ? "18rem" : "5rem";

    let availableModelsList = [...availableModels];

    const handleSelectModel = (values) => {
        const { name: modelName, isComingSoon } = values;
        if (isComingSoon) {
            window.alert(
                "This model is coming soon. Please select another model."
            );
            return;
        }
        setSelectedModel(modelName);
        localStorage.setItem("selectedModel", modelName);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        axios
            .get("/conversations")
            .then((response) => {
                setConversations(response.data.conversations);
            })
            .catch((error) =>
                console.error("Error loading conversations:", error)
            );
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            axios
                .get(`/conversations/${selectedConversation.id}`)
                .then((response) => {
                    setConversationMessages(response.data.messages);
                })
                .catch((error) =>
                    console.error("Error loading conversation messages:", error)
                );
        } else {
            setConversationMessages([]);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (mode === "chat") {
            setSelectedModel(
                localStorage.getItem("selectedModel") || textModels[0]?.name
            );
        }
    }, [mode, textModels, imageModels]);

    useEffect(() => {
        if (mode === "chat") {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversationMessages, mode]);

    useEffect(() => {
        const handleScroll = () => {
            if (mainContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } =
                    mainContainerRef.current;
                setShowScrollButton(
                    scrollHeight - scrollTop - clientHeight > 50
                );
            }
        };
        const container = mainContainerRef.current;
        if (container) container.addEventListener("scroll", handleScroll);
        return () =>
            container && container.removeEventListener("scroll", handleScroll);
    }, []);

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

    return (
        <>
            <Head title="Chat" />
            <div className="relative">
                <SideNav
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    conversations={conversations}
                    onSelectConversation={setSelectedConversation}
                    selectedConversation={selectedConversation}
                    onNewConversation={handleNewConversation}
                    setConversations={setConversations}
                />
                <div
                    style={{ marginLeft: sidebarWidth }}
                    className="relative transition-all duration-300"
                >
                    <header
                        className="fixed top-0 right-0 z-20 bg-white shadow p-4 flex flex-wrap items-center justify-between transition-all duration-300"
                        style={{ left: sidebarWidth }}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleSetMode("chat")}
                                    className={`px-4 py-2 rounded-md transition ${
                                        mode === "chat"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    Chat
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsPhotoStudioDropdownOpen(
                                                (prev) => !prev
                                            )
                                        }
                                        className="px-4 py-2 rounded-md transition bg-gray-100 text-gray-800 w-48"
                                    >
                                        {mode === "chat"
                                            ? "AI Photo Studio"
                                            : mode === "img2img"
                                            ? "Img2Img"
                                            : mode === "image"
                                            ? "Image"
                                            : mode === "bgremover"
                                            ? "Remove BG"
                                            : mode === "upscale"
                                            ? "Upscale"
                                            : mode === "logo"
                                            ? "Logo"
                                            : "AI Photo Studio"}
                                    </button>
                                    {isPhotoStudioDropdownOpen && (
                                        <div className="absolute left-0 top-full bg-white border border-gray-200 rounded-md shadow-lg w-48 mt-1 z-10">
                                            {photoStudioOptions.map(
                                                (option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => {
                                                            handleSetMode(
                                                                option.value
                                                            );
                                                            setIsPhotoStudioDropdownOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {mode === "chat" && (
                                <div
                                    className="relative"
                                    ref={dropdownRef}
                                >
                                    <button
                                        onClick={() =>
                                            setIsDropdownOpen(
                                                !isDropdownOpen
                                            )
                                        }
                                        className="p-2 rounded-md w-full text-left min-w-[250px]"
                                    >
                                        <div className="flex items-center gap-2 text-gray-800 w-full p-2 rounded-md font-semibold">
                                            <span>
                                                {selectedModel ||
                                                    "Select Model"}
                                            </span>

                                            <span className="text-gray-600 text-sm">
                                                {isDropdownOpen ? (
                                                    <MdOutlineKeyboardArrowDown className="rotate-180" size={22} />
                                                ) : (
                                                    <MdOutlineKeyboardArrowDown size={22} />
                                                )}
                                            </span>
                                        </div>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute left-0 top-full bg-white border border-gray-200 rounded-md shadow-lg w-full mt-1 z-10">
                                            {availableModelsList.map(
                                                (model) => (
                                                    <div
                                                        key={model.id}
                                                        onClick={() =>
                                                            handleSelectModel(
                                                                {
                                                                    name: model.name,
                                                                    isComingSoon:
                                                                        model?.isComingSoon,
                                                                }
                                                            )
                                                        }
                                                        className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"
                                                    >
                                                        <span>
                                                            {model.name}
                                                        </span>
                                                        {model.isComingSoon && (
                                                            <span className="font-semibold text-[10px] text-red-600 rounded-full bg-slate-200 px-1">
                                                                PRO
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {mode === "image" && (
                                <select
                                    value={selectedImageModel}
                                    onChange={(e) =>
                                        setSelectedImageModel(e.target.value)
                                    }
                                    className="p-2 border border-gray-300 rounded-md w-48"
                                >
                                    <option value="dall-e-3">
                                        DALL‑E‑3
                                    </option>
                                    <option value="dall-e-2">
                                        DALL‑E‑2
                                    </option>
                                    <option value="stable-diffusion-xl">
                                        Stable Diffusion XL
                                    </option>
                                    <option value="flux.1-schnell">
                                        Flux.1 Schnell
                                    </option>
                                </select>
                            )}
                        </div>
                        {mode === "logo" && (
                            <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                                <select
                                    value={logoType}
                                    onChange={(e) =>
                                        setLogoType(e.target.value)
                                    }
                                    className="p-2 border border-gray-300 rounded-md w-40"
                                >
                                    {[
                                        "Modern",
                                        "Vintage",
                                        "Abstract",
                                        "Geometric",
                                    ].map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={logoStyle}
                                    onChange={(e) =>
                                        setLogoStyle(e.target.value)
                                    }
                                    className="p-2 border border-gray-300 rounded-md w-40"
                                >
                                    {[
                                        "Minimal",
                                        "Detailed",
                                        "Flat",
                                        "3D",
                                    ].map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={logoColor}
                                    onChange={(e) =>
                                        setLogoColor(e.target.value)
                                    }
                                    className="p-2 border border-gray-300 rounded-md w-40"
                                >
                                    {[
                                        "Blue",
                                        "Red",
                                        "Green",
                                        "Black",
                                        "White",
                                    ].map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </header>

                    <main
                        ref={mainContainerRef}
                        className="pt-20 pb-20 px-4 overflow-y-auto scrollbar-hide max-w-[1000px] mx-auto"
                        style={{ height: "calc(100vh - 100px)" }}
                    >
                        {mode === "chat" ? (
                            <div className="space-y-4 relative">
                                {conversationMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`w-full flex ${
                                            msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        } my-2`}
                                    >
                                        <div
                                            className={`p-4 rounded-lg ${
                                                msg.sender === "user"
                                                    ? "bg-[#F3F3F3] max-w-[600px]"
                                                    : ""
                                            }`}
                                        >
                                            {msg.type === "image" ? (
                                                renderDownloadableImage(
                                                    msg.content.startsWith(
                                                        "data:image"
                                                    )
                                                        ? msg.content.split(
                                                              ","
                                                          )[1]
                                                        : msg.content,
                                                    "Generated",
                                                    "image/png",
                                                    "generated-image.png"
                                                )
                                            ) : msg.sender ===
                                              "assistant" ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[
                                                        remarkGfm,
                                                    ]}
                                                    rehypePlugins={[
                                                        rehypeHighlight,
                                                    ]}
                                                    components={{
                                                        code: CodeBlock,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <span>{msg.content}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        ) : mode === "img2img" ? (
                            <div className="flex flex-col items-center justify-center">
                                {img2imgResult ? (
                                    renderDownloadableImage(
                                        img2imgResult,
                                        "Img2Img Result",
                                        "image/png",
                                        "img2img.png"
                                    )
                                ) : (
                                    <p className="text-center text-gray-500">
                                        No image generated yet.
                                    </p>
                                )}
                            </div>
                        ) : mode === "bgremover" ? (
                            <div className="flex flex-col items-center justify-center">
                                {bgRemovedImage ? (
                                    renderDownloadableImage(
                                        bgRemovedImage,
                                        "Background Removed",
                                        "image/webp",
                                        "bgremoved.webp"
                                    )
                                ) : (
                                    <p className="text-center text-gray-500">
                                        No image generated yet.
                                    </p>
                                )}
                            </div>
                        ) : mode === "upscale" ? (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                {originalUpscaleImage && (
                                    <div className="flex flex-col items-center">
                                        <p className="mb-2 font-semibold">
                                            Original
                                        </p>
                                        {renderDownloadableImage(
                                            originalUpscaleImage,
                                            "Original Image",
                                            "image/png",
                                            "original.png"
                                        )}
                                    </div>
                                )}
                                {upscaledImage && (
                                    <div className="flex flex-col items-center">
                                        <p className="mb-2 font-semibold">
                                            Upscaled
                                        </p>
                                        {renderDownloadableImage(
                                            upscaledImage,
                                            "Upscaled Image",
                                            "image/webp",
                                            "upscaled.webp"
                                        )}
                                    </div>
                                )}
                                {!(originalUpscaleImage && upscaledImage) && (
                                    <p className="text-center text-gray-500">
                                        No image generated yet.
                                    </p>
                                )}
                            </div>
                        ) : mode === "logo" ? (
                            <div className="flex flex-col items-center justify-center">
                                {generatedLogo ? (
                                    renderDownloadableImage(
                                        generatedLogo,
                                        "Generated Logo",
                                        "image/png",
                                        "logo.png"
                                    )
                                ) : (
                                    <p className="text-center text-gray-500">
                                        No logo generated yet.
                                    </p>
                                )}
                            </div>
                        ) : mode === "image" ? (
                            <div className="flex flex-col items-center justify-center">
                                {generatedImage ? (
                                    renderDownloadableImage(
                                        generatedImage.startsWith(
                                            "data:image"
                                        )
                                            ? generatedImage.split(",")[1]
                                            : generatedImage,
                                        "Generated",
                                        "image/png",
                                        "generated-image.png"
                                    )
                                ) : (
                                    <p className="text-center text-gray-500">
                                        No image generated yet.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p>Mode not supported.</p>
                        )}
                    </main>

                    <footer
                        className="fixed bottom-0 right-0 z-20 bg-white shadow p-4 transition-all duration-300"
                        style={{ left: sidebarWidth }}
                    >
                        <div className="max-w-3xl mx-auto border-2 rounded-lg">
                            <form
                                onSubmit={handleSubmit}
                                className="flex items-center space-x-4 p-4"
                            >
                                {(mode === "img2img" ||
                                    mode === "bgremover" ||
                                    mode === "upscale") && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (mode === "img2img") {
                                                setInitImage(
                                                    e.target.files[0]
                                                );
                                            } else if (mode === "bgremover") {
                                                setBgImage(
                                                    e.target.files[0]
                                                );
                                            } else if (mode === "upscale") {
                                                setUpscaleImage(
                                                    e.target.files[0]
                                                );
                                            }
                                        }}
                                        className="border p-2 rounded"
                                    />
                                )}
                                {mode !== "bgremover" &&
                                    mode !== "upscale" &&
                                    mode !== "logo" && (
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) =>
                                                setPrompt(e.target.value)
                                            }
                                            placeholder={
                                                mode === "chat"
                                                    ? "How can I help you today?"
                                                    : mode === "img2img"
                                                    ? "Enter prompt for image transformation..."
                                                    : "Enter prompt for image generation..."
                                            }
                                            className="flex-1 border-none focus:outline-0 focus:ring-0 text-gray-800 placeholder-gray-500 bg-transparent"
                                        />
                                    )}
                                {mode === "logo" && (
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) =>
                                            setPrompt(e.target.value)
                                        }
                                        placeholder="Enter logo prompt"
                                        className="flex-1 border p-2 rounded text-gray-800 placeholder-gray-500"
                                    />
                                )}
                                <button
                                    type="submit"
                                    disabled={
                                        loading || prompt.trim() === ""
                                    }
                                    className={`bg-indigo-600 text-white ${
                                        mode == "chat" && !loading
                                            ? "px-3"
                                            : "px-6"
                                    } py-3 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all`}
                                >
                                    {loading
                                        ? "Generating..."
                                        : mode === "chat"
                                        ? <FaArrowUp />
                                        : mode === "img2img"
                                        ? "Generate Img2Img"
                                        : mode === "bgremover"
                                        ? "Remove BG"
                                        : mode === "upscale"
                                        ? "Upscale"
                                        : mode === "logo"
                                        ? "Generate Logo"
                                        : "Generate Image"}
                                </button>
                            </form>
                        </div>
                    </footer>

                    {mode === "chat" && showScrollButton && (
                        <button
                            onClick={scrollToBottom}
                            className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white p-2 rounded-full opacity-40 hover:opacity-60 transition"
                        >
                            ▼
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Generate;
