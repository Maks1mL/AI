import { useState } from "react";
import { Link } from "@inertiajs/react";
import { FaSearch, FaChevronRight, FaTimes, FaDownload, FaShare } from "react-icons/fa";
import FuturisticCity from "../../../public/images/Futuristic city.png";
import dragon from "../../../public/images/Fantasy dragon perched on a castle tower at sunset.png";
import bioluminescent from "../../../public/images/Deep sea bioluminescent creatures in an underwater cave.png";
import Astronaut from "../../../public/images/Astronaut exploring an alien planet with two moons.png";
import Cyberpunk from "../../../public/images/Cyberpunk character with neon implants in a rainy alley.jpg";
import forest from "../../../public/images/Enchanted forest with magical creatures and glowing plants.jpg";

const AIImageGallery = () => {
    const galleryImages = [
        { id: 1, url: FuturisticCity, prompt: "Futuristic city with flying cars and neon lights", model: "Midjourney v5" },
        { id: 2, url: dragon, prompt: "Fantasy dragon perched on a castle tower at sunset", model: "Stable Diffusion XL" },
        { id: 3, url: bioluminescent, prompt: "Deep sea bioluminescent creatures in an underwater cave", model: "DALL-E 3" },
        { id: 4, url: Astronaut, prompt: "Astronaut exploring an alien planet with two moons", model: "Midjourney v5" },
        { id: 5, url: Cyberpunk, prompt: "Cyberpunk character with neon implants in a rainy alley", model: "Stable Diffusion XL" },
        { id: 6, url: forest, prompt: "Enchanted forest with magical creatures and glowing plants", model: "DALL-E 3" },
    ];

    const [activeImage, setActiveImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (image) => {
        setActiveImage(image);
        setIsModalOpen(true);
        // Prevent page scrolling when modal is open
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Re-enable page scrolling when modal is closed
        document.body.style.overflow = "auto";
    };

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
                <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                    onClick={() => openModal(image)}
                >
                    <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white font-medium text-sm mb-2">{image.prompt}</p>
                        <div className="flex justify-between items-center text-xs text-gray-300">
                            <span>{image.model}</span>
                            <span className="text-blue-400 font-medium flex items-center">
                                <FaSearch className="mr-1" /> View details
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {isModalOpen && activeImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300" 
                    onClick={closeModal}
                >
                    <div 
                        className="relative w-full max-w-5xl p-2 sm:p-4 mx-4 transform transition-all duration-300 scale-100" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-2 -right-2 z-10 flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full border border-gray-700 shadow-lg hover:bg-gray-800 transition-colors"
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            <FaTimes />
                        </button>
                        
                        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl flex flex-col md:flex-row">
                            <div className="w-full md:w-2/3 bg-black/30 relative">
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.prompt}
                                    className="w-full h-full object-contain max-h-[70vh]"
                                />
                                <div className="absolute bottom-4 right-4 flex space-x-2">
                                    <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors">
                                        <FaDownload className="text-white" />
                                    </button>
                                    <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors">
                                        <FaShare className="text-white" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-1/3 p-6 flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">Generated Image</h3>
                                
                                <div className="mb-6">
                                    <div className="text-gray-400 text-sm mb-1">Prompt</div>
                                    <p className="text-gray-200 font-medium">{activeImage.prompt}</p>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="text-gray-400 text-sm mb-1">Model</div>
                                    <span className="inline-flex items-center bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                        {activeImage.model}
                                    </span>
                                </div>
                                
                                <div className="mt-auto">
                                    <div className="text-gray-400 text-sm mb-2">Want to create similar images?</div>
                                    <Link
                                        href="/subscription-plans"
                                        className="flex items-center justify-center py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Create your own <FaChevronRight className="ml-2 text-xs" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIImageGallery;