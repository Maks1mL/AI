import { useState } from "react";
import { 
  FaRobot, 
  FaImage, 
  FaVolumeUp, 
  FaMicrophone, 
  FaBlog, 
  FaEye
} from "react-icons/fa";

export default function AIServiceCards() {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const services = [
    {
      id: 1,
      title: "Chat With AI",
      description: "Engage in intelligent conversations with our advanced AI assistant",
      icon: <FaRobot size={28} />,
      color: "blue",
      width: "wide",
      height: "tall",
      pattern: "circuit",
      link: "/ai-chat"
    },
    {
      id: 2,
      title: "Image Generator",
      description: "Create stunning visuals from text descriptions",
      icon: <FaImage size={24} />,
      color: "purple",
      width: "medium",
      height: "medium",
      pattern: "dots",
      link: "/image-generate"
    },
    {
      id: 3,
      title: "Text to Speech",
      description: "Convert your text into natural-sounding speech",
      icon: <FaVolumeUp size={22} />,
      color: "teal",
      width: "narrow",
      height: "short",
      pattern: "waves",
      link: "/text-to-speech"
    },
    {
      id: 4,
      title: "Speech to Text",
      description: "Transcribe audio recordings with high accuracy",
      icon: <FaMicrophone size={24} />,
      color: "orange",
      width: "medium",
      height: "medium",
      pattern: "waves",
      link: "/speech-to-text"
    },
    {
      id: 5,
      title: "Blog Generator",
      description: "Create engaging blog content in seconds",
      icon: <FaBlog size={22} />,
      color: "green",
      width: "narrow",
      height: "tall",
      pattern: "dots",
      link: "/blog"
    },
    {
      id: 6,
      title: "AI Vision",
      description: "Analyze and interpret visual content intelligently",
      icon: <FaEye size={26} />,
      color: "purple",
      width: "wide",
      height: "short",
      pattern: "circuit",
      link: "/ai-vision"
    }
  ];

  const colorMap = {
    blue: {
      primary: "bg-blue-500",
      secondary: "bg-blue-100",
      text: "text-blue-600",
      hover: "hover:bg-blue-600",
      border: "border-blue-200",
      light: "bg-blue-50"
    },
    purple: {
      primary: "bg-indigo-500",
      secondary: "bg-indigo-100",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-600",
      border: "border-indigo-200",
      light: "bg-indigo-50"
    },
    teal: {
      primary: "bg-teal-500",
      secondary: "bg-teal-100",
      text: "text-teal-600",
      hover: "hover:bg-teal-600",
      border: "border-teal-200",
      light: "bg-teal-50"
    },
    orange: {
      primary: "bg-amber-500",
      secondary: "bg-amber-100",
      text: "text-amber-600",
      hover: "hover:bg-amber-600",
      border: "border-amber-200",
      light: "bg-amber-50"
    },
    green: {
      primary: "bg-green-500",
      secondary: "bg-green-100",
      text: "text-green-600",
      hover: "hover:bg-green-600",
      border: "border-green-200",
      light: "bg-green-50"
    }
  };

  const widthMap = {
    narrow: "col-span-1",
    medium: "col-span-2",
    wide: "col-span-3"
  };



  const renderPattern = (pattern, color) => {
    switch(pattern) {
      case 'circuit':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-12 h-1 rounded-full bg-white"></div>
            <div className="absolute top-4 left-4 w-1 h-12 rounded-full bg-white"></div>
            <div className="absolute bottom-8 right-8 w-16 h-1 rounded-full bg-white"></div>
            <div className="absolute bottom-8 right-8 w-1 h-16 rounded-full bg-white"></div>
            <div className="absolute top-12 right-12 w-3 h-3 rounded-full bg-white"></div>
            <div className="absolute bottom-16 left-12 w-2 h-2 rounded-full bg-white"></div>
          </div>
        );
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full bg-white" 
                   style={{ 
                     top: `${Math.random() * 100}%`, 
                     left: `${Math.random() * 100}%` 
                   }}></div>
            ))}
          </div>
        );
      case 'waves':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-0 right-0 h-1 rounded-full bg-white"></div>
            <div className="absolute top-2/4 left-0 right-0 h-1 rounded-full bg-white"></div>
            <div className="absolute top-3/4 left-0 right-0 h-1 rounded-full bg-white"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {services.map((service) => {
          const colors = colorMap[service.color];
          const isHovered = hoveredCard === service.id;
          const width = widthMap[service.width];
          const height = 'h-full';
          
          
          return (
            <div 
              key={service.id}
              className={`${width} transition-all duration-300`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <a 
                href={service.link}
                className={`block ${height} rounded-2xl border ${colors.border} overflow-hidden shadow-sm transition-all hover:shadow-lg transform ${isHovered ? 'scale-[1.02]' : ''}`}
              >
                <div className={`relative h-full flex flex-col ${isHovered ? colors.primary : colors.light} transition-colors duration-300`}>
                  {/* AI-themed background pattern */}
                  {renderPattern(service.pattern, service.color)}
                  
                  {/* Top icon area */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.secondary} ${colors.text} mb-4`}>
                      {service.icon}
                    </div>
                    
                    <h3 className={`text-lg font-bold ${isHovered ? 'text-white' : colors.text} transition-colors duration-300`}>
                      {service.title}
                    </h3>
                    
                    <p className={`mt-2 text-sm ${isHovered ? 'text-white' : 'text-gray-600'} transition-colors duration-300`}>
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Action button */}
                  <div className={`px-6 pb-6 flex items-center justify-between text-sm font-medium ${isHovered ? 'text-white' : colors.text} transition-colors duration-300`}>
                    <span>Get Started</span>
                    <div className={`w-8 h-8 rounded-full ${isHovered ? 'bg-white' : colors.secondary} flex items-center justify-center transition-colors duration-300`}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ${isHovered ? colors.text : colors.text} transition-colors duration-300`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}