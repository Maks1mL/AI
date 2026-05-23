import React, { useState, useRef, useEffect } from 'react';
import '../../css/carousel.css';
import '../../css/glassmorphism.css';

const TestimonialCarousel = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userRole: 'Marketing Director',
      userImageUrl: '',
      text: "The AI models have completely transformed our creative process. We're producing stunning content in a fraction of the time it used to take.",
    },
    {
      id: 2,
      userName: 'Michael Chen',
      userRole: 'Tech Entrepreneur',
      userImageUrl: '',
      text: 'Having all these premium AI models in one platform saves me hundreds of dollars each month. The seamless integration is brilliant.',
    },
    {
      id: 3,
      userName: 'Amelia Rodriguez',
      userRole: 'Content Creator',
      userImageUrl: '',
      text: "This platform offers the perfect balance between powerful AI capabilities and user-friendly design. It's the only tool I need now.",
    },
    {
      id: 4,
      userName: 'David Kim',
      userRole: 'Product Designer',
      userImageUrl: '',
      text: 'The image generation capabilities are exceptional. My design workflow is now 3x faster with consistently impressive results.',
    },
    {
      id: 5,
      userName: 'Elena Petrov',
      userRole: 'Small Business Owner',
      userImageUrl: '',
      text: "Customer support is outstanding. Any time I've had questions, the team responds quickly with helpful solutions.",
    },
    {
      id: 6,
      userName: 'James Wilson',
      userRole: 'Digital Consultant',
      userImageUrl: '',
      text: "I've tried many AI platforms, but this one stands out for its reliability and performance. Well worth the investment.",
    },
  ];

  // Duplicate the testimonials for infinite scroll effect
  const testimonialsLoop = [...testimonials, ...testimonials];
  const containerRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const fullWidth = containerRef.current.scrollWidth;
      setScrollDistance(fullWidth / 2);
    }
  }, [testimonialsLoop]);

  return (
    <div className="overflow-hidden">
      <div
        className="flex animate-scroll py-4"
        ref={containerRef}
        style={{
          width: scrollDistance ? `${scrollDistance * 2}px` : 'auto',
          '--scroll-distance': `${scrollDistance}px`,
        }}
      >
        {testimonialsLoop.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const [imageError, setImageError] = useState(false);
  const randomGlowClass = () => {
    const glowClasses = ['glass-card-glow-purple', 'glass-card-glow-blue', 'glass-card-glow-cyan'];
    return glowClasses[testimonial.id % glowClasses.length];
  };

  return (
    <div className="mx-4 flex-shrink-0 w-[300px] sm:w-[340px]">
      <div className={`glass-card ${randomGlowClass()} p-6 h-full animate-blur`}>
        <div className="gradient-border w-12 h-1 mb-4">
          <div className="gradient-border-content"></div>
        </div>
        
        <p className="glass-text text-lg mb-6">"{testimonial.text}"</p>
        
        <div className="mt-auto flex items-center">
          <div className="gradient-border rounded-full p-[1px] mr-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-filter backdrop-blur-md text-white text-xl">
              {testimonial.userName.charAt(0)}
            </div>
          </div>
          
          <div>
            <p className="font-bold glass-text">{testimonial.userName}</p>
            <p className="glass-text-subtle text-sm">{testimonial.userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
