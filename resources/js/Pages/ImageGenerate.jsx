import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Head } from "@inertiajs/react";
import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

// Import your existing SideNav component
import SideNav from "../Components/SideNav";

// Renders an image with a Download button
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

const ImageGenerate = ({ imageModels }) => {
    // Keep the SideNav open/close functionality
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const sidebarWidth = isSidebarOpen ? "18rem" : "5rem";
    const [conversationMessages, setConversationMessages] = useState([]);

    // Keep the SideNav’s conversation states so the component remains functional
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const handleNewConversation = () => {
        setSelectedConversation(null);
        setConversationMessages([]);
    };

    // --- State for modes (image, img2img, bgremover, upscale, logo) ---
    const [mode, setMode] = useState(localStorage.getItem("mode") || "image");
    const [isPhotoStudioDropdownOpen, setIsPhotoStudioDropdownOpen] =
        useState(false);

    // For "image" mode:
    const [selectedImageModel, setSelectedImageModel] = useState("dall-e-3");
    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);

    // For "img2img" mode:
    const [initImage, setInitImage] = useState(null);
    const [img2imgResult, setImg2imgResult] = useState(null);

    // For "bgremover" mode:
    const [bgImage, setBgImage] = useState(null);
    const [bgRemovedImage, setBgRemovedImage] = useState(null);

    // For "upscale" mode:
    const [upscaleImage, setUpscaleImage] = useState(null);
    const [originalUpscaleImage, setOriginalUpscaleImage] = useState(null);
    const [upscaledImage, setUpscaledImage] = useState(null);

    // For "logo" mode:
    const [generatedLogo, setGeneratedLogo] = useState(null);
    const [logoType, setLogoType] = useState("Modern");
    const [logoStyle, setLogoStyle] = useState("Minimal");
    const [logoColor, setLogoColor] = useState("Blue");

    const [loading, setLoading] = useState(false);
    const mainContainerRef = useRef(null);

    // Photo Studio dropdown options
    const photoStudioOptions = [
        { label: "Image", value: "image" },
        { label: "Img2Img", value: "img2img" },
        { label: "Remove BG", value: "bgremover" },
        { label: "Upscale", value: "upscale" },
        { label: "Logo", value: "logo" },
    ];

    // --- Handlers ---
    const handleSetMode = (selectedMode) => {
        localStorage.setItem("mode", selectedMode);
        setMode(selectedMode);
        setPrompt("");
    };

    // Image generation
    const handleImage = async () => {
        try {
            const response = await axios.post("/image-generate", {
                model: selectedImageModel,
                prompt,
            });
            setGeneratedImage(response.data.image_base64);
        } catch (error) {
            console.error("Error generating image:", error);
            setGeneratedImage(null);
        }
    };

    // Img2Img
    const handleImg2Img = async () => {
        if (!initImage) {
            alert("Please select an initial image.");
            return;
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
        }
    };

    // Remove BG
    const handleBgRemover = async () => {
        if (!bgImage) {
            alert("Please select an image to remove the background.");
            return;
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
        }
    };

    // Upscale
    const handleUpscale = async () => {
        if (!upscaleImage) {
            alert("Please select an image to upscale.");
            return;
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
        }
    };

    // Logo
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
        }
    };

    // Unified submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            switch (mode) {
                case "image":
                    await handleImage();
                    break;
                case "img2img":
                    await handleImg2Img();
                    break;
                case "bgremover":
                    await handleBgRemover();
                    break;
                case "upscale":
                    await handleUpscale();
                    break;
                case "logo":
                    await handleLogo();
                    break;
                default:
                    console.warn("Unsupported mode.");
                    break;
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        } finally {
            setLoading(false);
        }
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

    return (
        <>
            <Head title="AI Photo Studio" />

            {/* Wrap in a container so we can place SideNav on the left */}
            <div className="relative">
                {/* Keep SideNav and its functionality */}
                <SideNav
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    conversations={conversations.filter(conv => conv.type == "image")}
                    onSelectConversation={setSelectedConversation}
                    selectedConversation={selectedConversation}
                    onNewConversation={handleNewConversation}
                    setConversations={setConversations}
                />

                {/* Main Content Container, offset by sidebar width */}
                <div
                    style={{ marginLeft: sidebarWidth }}
                    className="relative transition-all duration-300"
                >
                    {/* Header Bar */}
                    <header className="w-full bg-white shadow p-4 flex flex-wrap items-center justify-between">
                        {/* Left Section: Photo Studio Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsPhotoStudioDropdownOpen(
                                        (prev) => !prev
                                    )
                                }
                                className="px-4 py-2 rounded-md transition bg-gray-100 text-gray-800 w-48"
                            >
                                {mode === "img2img"
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
                                    {photoStudioOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => {
                                                handleSetMode(option.value);
                                                setIsPhotoStudioDropdownOpen(
                                                    false
                                                );
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Section: If "image", show model selector */}
                        {mode === "image" && (
                            <select
                                value={selectedImageModel}
                                onChange={(e) =>
                                    setSelectedImageModel(e.target.value)
                                }
                                className="p-2 border border-gray-300 rounded-md w-48"
                            >
                                {imageModels &&
                                    imageModels.map((model) => (
                                        <option
                                            key={model.id}
                                            value={model.id}
                                        >
                                            {model.name}
                                        </option>
                                    ))}
                            </select>
                        )}

                        {/* If "logo", show extra selects */}
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
                                    {["Minimal", "Detailed", "Flat", "3D"].map(
                                        (opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        )
                                    )}
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

                    {/* Main Content */}
                    <main
                        ref={mainContainerRef}
                        className="pt-20 pb-20 px-4 overflow-y-auto scrollbar-hide max-w-[1000px] mx-auto"
                        style={{ height: "calc(100vh - 120px)" }}
                    >
                        {selectedConversation && (
                            <div className="flex flex-col items-center justify-center">
                                {conversationMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-4 rounded-md shadow-md max-w-xl ${
                                            msg.sender === "user"
                                                ? "bg-blue-50 self-end "
                                                : "bg-gray-100 self-start"
                                        }`}
                                    >
                                        <p className="text-xs text-gray-500 mb-1">
                                            {msg.sender} •{" "}
                                            {new Date(
                                                msg.created_at
                                            ).toLocaleString()}
                                        </p>

                                        {msg.type === "text" ? (
                                            <p className="text-gray-800">
                                                {msg.content}
                                            </p>
                                        ) : msg.type === "image" ? (
                                            renderDownloadableImage(
                                                msg.content,
                                                "Generated Image",
                                                "image/png",
                                                `image-${msg.id}.png`
                                            )
                                        ) : (
                                            <p className="text-red-500">
                                                Unsupported message type
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Display results based on mode */}
                        { mode === "image" && (
                            <div className="flex flex-col items-center justify-center">
                                {generatedImage ? (
                                    renderDownloadableImage(
                                        generatedImage.startsWith("data:image")
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
                        )}

                        {mode === "img2img" && (
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
                        )}

                        {mode === "bgremover" && (
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
                        )}

                        {mode === "upscale" && (
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
                        )}

                        {mode === "logo" && (
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
                        )}
                    </main>

                    {/* Footer (Prompt + File Inputs) */}
                    <footer className="fixed bottom-0 w-full bg-white shadow p-4">
                        <div className="max-w-3xl mx-auto border-2 rounded-lg">
                            <form
                                onSubmit={handleSubmit}
                                className="flex items-center space-x-4 p-4"
                            >
                                {/* File input for some modes */}
                                {(mode === "img2img" ||
                                    mode === "bgremover" ||
                                    mode === "upscale") && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (mode === "img2img") {
                                                setInitImage(e.target.files[0]);
                                            } else if (mode === "bgremover") {
                                                setBgImage(e.target.files[0]);
                                            } else if (mode === "upscale") {
                                                setUpscaleImage(
                                                    e.target.files[0]
                                                );
                                            }
                                        }}
                                        className="border p-2 rounded"
                                    />
                                )}

                                {/* Prompt input for modes that need it */}
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
                                                mode === "img2img"
                                                    ? "Enter prompt for image transformation..."
                                                    : "Enter prompt for image generation..."
                                            }
                                            className="flex-1 border-none focus:outline-0 focus:ring-0 text-gray-800 placeholder-gray-500 bg-transparent"
                                        />
                                    )}

                                {/* Logo mode prompt */}
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
                                    disabled={loading}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all"
                                >
                                    {loading
                                        ? "Generating..."
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
                </div>
            </div>
        </>
    );
};

export default ImageGenerate;
