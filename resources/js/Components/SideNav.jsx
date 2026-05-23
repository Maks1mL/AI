import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, usePage } from "@inertiajs/react";
import { TiHome } from "react-icons/ti";
import { 
  HiOutlineChatAlt2, 
  HiOutlinePlus, 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight,
  HiOutlineDotsVertical,
  HiOutlineTrash
} from "react-icons/hi";
import { 
  BiImageAlt, 
  BiMicrophone, 
  BiHeadphone, 
  BiPencil,
  BiCamera 
} from "react-icons/bi";

const SideNav = ({
    isSidebarOpen,
    toggleSidebar,
    conversations,
    onSelectConversation,
    selectedConversation,
    onNewConversation,
    setConversations,
}) => {
    const sidebarWidth = isSidebarOpen ? "18rem" : "5rem";
    const user = usePage().props.auth.user;
    const rootUrl = window.location.origin;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAIplaygroundOpen, setIsAIplaygroundOpen] = useState(false);
    const dropdownRef = useRef(null);
    const AIplaygroundRef = useRef(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
        isOpen: false,
        conversationId: null,
    });

    const spliteText = (text) =>
        text.length > 27 ? text.slice(0, 27) + "..." : text;

    // Function to Soft Delete a Conversation
    const handleDeleteConversation = async (conversationId) => {
        try {
            await axios.patch(`/conversations/${conversationId}/soft-delete`);
            setConversations((prev) =>
                prev.filter((conv) => conv.id !== conversationId)
            );
            onSelectConversation(null);
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

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
    
    // Get first letter of user name for avatar fallback
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <aside
            className="fixed top-0 left-0 bottom-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-hidden shadow-xl z-10"
            style={{ width: sidebarWidth }}
        >
            <div className="flex flex-col h-full">
                {/* Top Section with Logo and Toggle */}
                <div className={`flex items-center justify-between ${isSidebarOpen ? "px-4 py-4" : "px-3 py-4"}`}>
                    {isSidebarOpen && (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <HiOutlineChatAlt2 size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                AI Chat Pro
                            </span>
                        </div>
                    )}
                    
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none flex items-center justify-center"
                    >
                        {isSidebarOpen ? (
                            <HiOutlineChevronLeft size={18} />
                        ) : (
                            <HiOutlineChevronRight size={18} />
                        )}
                    </button>
                </div>

                {/* New Conversation & AI Playground Buttons */}
                <div className={`${isSidebarOpen ? "px-4 py-3" : "px-2 py-3 flex flex-col items-center"}`}>
                    <button
                        onClick={onNewConversation}
                        className={`flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white rounded-lg font-medium 
                        ${isSidebarOpen ? "w-full py-2 px-4" : "w-10 h-10"}`}
                    >
                        <HiOutlinePlus size={isSidebarOpen ? 18 : 20} />
                        {isSidebarOpen && <span className="ml-2">New Chat</span>}
                    </button>
                    
                    {isSidebarOpen && (
                        <div className="relative mt-3" ref={AIplaygroundRef}>
                            <button
                                onClick={() => setIsAIplaygroundOpen(!isAIplaygroundOpen)}
                                className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors duration-200 px-4 py-2 rounded-lg focus:outline-none"
                            >
                                <span>AI Playground</span>
                                <span className={`transition-transform duration-200 ${isAIplaygroundOpen ? "rotate-180" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isAIplaygroundOpen && (
                                <div className="absolute left-0 right-0 mt-2 bg-gray-800 text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-700 z-20">
                                    <Link
                                        href="/ai-chat"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <HiOutlineChatAlt2 className="mr-3 text-indigo-400" size={18} />
                                        <span>Chat With AI</span>
                                    </Link>
                                    <Link
                                        href="/image-generate"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiImageAlt className="mr-3 text-indigo-400" size={18} />
                                        <span>Image Generator</span>
                                    </Link>
                                    <Link
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                        href={"/text-to-speech"}
                                    >
                                        <BiHeadphone className="mr-3 text-indigo-400" size={18} />
                                        <span>Text to Speech</span>
                                    </Link>
                                    <Link
                                        href={"/speech-to-text"}
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiMicrophone className="mr-3 text-indigo-400" size={18} />
                                        <span>Speech to Text</span>
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiPencil className="mr-3 text-indigo-400" size={18} />
                                        <span>Blog Generator</span>
                                    </Link>
                                    <Link
                                        href="/ai-vision"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiCamera className="mr-3 text-indigo-400" size={18} />
                                        <span>AI Vision</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!isSidebarOpen && (
                        <div className="mt-3 relative" ref={AIplaygroundRef}>
                            <button
                                onClick={() => setIsAIplaygroundOpen(!isAIplaygroundOpen)}
                                className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors duration-200 rounded-lg focus:outline-none"
                            >
                                <span className="text-xl">🎮</span>
                            </button>
                            
                            {isAIplaygroundOpen && (
                                <div className="absolute left-full ml-2 mt-0 bg-gray-800 text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-700 z-20 w-48">
                                    <Link
                                        href="/ai-chat"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <HiOutlineChatAlt2 className="mr-3 text-indigo-400" size={18} />
                                        <span>Chat With AI</span>
                                    </Link>
                                    <Link
                                        href="/image-generate"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiImageAlt className="mr-3 text-indigo-400" size={18} />
                                        <span>Image Generator</span>
                                    </Link>
                                    <Link
                                        href="/text-to-speech"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiHeadphone className="mr-3 text-indigo-400" size={18} />
                                        <span>Text to Speech</span>
                                    </Link>
                                    <Link
                                        href="/speech-to-text"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiMicrophone className="mr-3 text-indigo-400" size={18} />
                                        <span>Speech to Text</span>
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiPencil className="mr-3 text-indigo-400" size={18} />
                                        <span>Blog Generator</span>
                                    </Link>
                                    <Link
                                        href="/ai-vision"
                                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <BiCamera className="mr-3 text-indigo-400" size={18} />
                                        <span>AI Vision</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className={`${isSidebarOpen ? "mx-4" : "mx-2"} my-3 border-b border-gray-700 opacity-60`}></div>

                {/* Conversations List */}
                <div className="flex-grow overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {conversations.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center h-32 ${isSidebarOpen ? "px-4" : "px-1"}`}>
                            <div className="text-gray-400 text-5xl mb-2">💬</div>
                            {isSidebarOpen && (
                                <p className="text-sm text-gray-400 text-center">
                                    No conversations yet.
                                </p>
                            )}
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {conversations.map((convo) => (
                                <li
                                    key={convo.id}
                                    className={`rounded-lg ${
                                        selectedConversation?.id === convo.id
                                            ? "bg-gray-700 border-l-4 border-indigo-500"
                                            : "hover:bg-gray-700/60"
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div
                                            onClick={() => onSelectConversation(convo)}
                                            className={`flex-1 cursor-pointer ${isSidebarOpen ? "p-3" : "py-3 px-2"}`}
                                        >
                                            {isSidebarOpen ? (
                                                <>
                                                    <p className="font-medium text-gray-200">
                                                        {spliteText(convo.title)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(convo.updated_at).toLocaleDateString()} · {new Date(convo.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </>
                                            ) : (
                                                <div className="flex justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                                                        <HiOutlineChatAlt2 size={16} className="text-indigo-300" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isSidebarOpen && (
                                            <div className="relative pr-2">
                                                <button
                                                    onClick={() => setIsDeleteModalOpen({
                                                        isOpen: !isDeleteModalOpen.isOpen || isDeleteModalOpen.conversationId !== convo.id,
                                                        conversationId: convo.id
                                                    })}
                                                    className="p-1 hover:bg-gray-600 rounded-full transition-colors duration-200"
                                                >
                                                    <HiOutlineDotsVertical size={16} />
                                                </button>

                                                {isDeleteModalOpen.conversationId === convo.id && isDeleteModalOpen.isOpen && (
                                                    <div className="absolute top-0 right-8 mt-1 bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700 z-10">
                                                        <button
                                                            onClick={() => handleDeleteConversation(convo.id)}
                                                            className="flex items-center px-4 py-2 hover:bg-gray-700 text-red-400 w-full text-sm text-left"
                                                        >
                                                            <HiOutlineTrash size={16} className="mr-2" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* User Profile Footer */}
                <div className={`p-3 border-t border-gray-700 bg-gray-800/50 mt-auto`}>
                    <div className={`flex ${isSidebarOpen ? "justify-between" : "justify-center"} items-center`}>
                        <div className="flex items-center space-x-3">
                            {user?.profile_image ? (
                                <img
                                    src={`${rootUrl}/storage/${user.profile_image}`}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {getInitials(user?.name)}
                                </div>
                            )}
                            
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{user?.name || "User"}</span>
                                    <span className="text-xs text-gray-400">{user?.email || ""}</span>
                                </div>
                            )}
                        </div>
                        
                        {isSidebarOpen && (
                            <Link 
                                href="/dashboard" 
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                title="Home"
                            >
                                <TiHome size={22} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideNav;