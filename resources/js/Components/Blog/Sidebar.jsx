import React, { useState, useRef, useEffect } from "react";

const Sidebar = ({ isOpen, setIsOpen , children,title}) => {
    const sidebarRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(450); // Default width
    const [showButton, setShowButton] = useState(false);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    // Handle mouse drag to resize sidebar
    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const newWidth = Math.max(
            400,
            Math.min(4000, window.innerWidth - e.clientX)
        ); // Set Min: 200px, Max: 500px
        setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        if (isOpen) {
            const timeout = setTimeout(() => {
                setShowButton(true);
            }, 300); // Delay for 1 second (1000ms)

            return () => clearTimeout(timeout); // Cleanup timeout on unmount
        } else {
            setShowButton(false);
        }
    }, [isOpen]);
    return (
        <>
            {/* Overlay when sidebar is open */}
            {isOpen && (
                <div
                    onClick={handleClickOutside}
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 bottom-0 h-screen bg-white  shadow-lg z-50 transition-transform  ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ width: `${sidebarWidth}px` }}
            >
                <div className="text-lg capitalize font-semibold p-5 border-b flex justify-between ">
                    <h2>Generate {title}</h2>
                    <button
                        className="text-black text-2xl "
                        onClick={() => setIsOpen(false)}
                    >
                        &times;
                    </button>
                </div>
                <div className="p-5 overflow-y-auto h-[calc(100vh-80px)] ">{children}</div>
            </div>

            {/* Resize Handle */}

            <button
                className={` ${
                    showButton ? "fixed" : "hidden"
                }   h-[50px] w-4 rounded-full bg-gray-200/20  hover:bg-gray-400  z-[500] cursor-e-resize text-white`}
                style={{
                    right: `${sidebarWidth + 10}px`,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                onMouseDown={handleMouseDown}
            >
                ||
            </button>
        </>
    );
};

export default Sidebar;
