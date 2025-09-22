import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const Tutorial = ({ onComplete, forceShow }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({});
    const [spotlightPosition, setSpotlightPosition] = useState({});

    const steps = [
        {
            title: "Welcome to DataLake Pro!",
            content: "Let's take a quick tour of your video metadata platform. This will only take 2 minutes!",
            target: null,
            position: "center"
        },
        {
            title: "Upload Your Data",
            content: "Start by uploading your video metadata files here. We support JSON, CSV, and XML formats.",
            target: "upload-area",
            position: "bottom"
        },
        {
            title: "Search & Filter",
            content: "Use these tools to quickly find specific videos by title, tags, or metadata.",
            target: "search-area",
            position: "bottom"
        },
        {
            title: "Explore Your Data",
            content: "View all your video metadata in an organized, easy-to-browse format.",
            target: "data-grid",
            position: "top"
        },
        {
            title: "Export Results",
            content: "Export your filtered data in multiple formats for further analysis.",
            target: "export-area",
            position: "top"
        },
        {
            title: "You're All Set",
            content: "Congratulations! You now know how to use DataLake Pro. Happy exploring!",
            target: null,
            position: "center"
        }
    ];

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('tutorial-completed');
        if (!hasSeenTutorial || forceShow) {
            setIsVisible(true);
            setCurrentStep(0); // reset to first step when restarting
        }
    }, [forceShow]);

    const getCenterPosition = () => ({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000
    });

    const scrollToElement = (element) => {
        if (!element) return;

        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top + window.pageYOffset;
        const elementHeight = elementRect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate the target scroll position
        // Center the element in the viewport, but with some offset for the tooltip
        const targetScrollTop = elementTop - (windowHeight / 2) + (elementHeight / 2);
        
        // Smooth scroll to the element
        window.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
        });
    };

    const calculatePositions = () => {
        const step = steps[currentStep];

        if (!step.target) {
            setTooltipPosition(getCenterPosition());
            setSpotlightPosition({});
            return;
        }

        const element = document.querySelector(`[data-tutorial="${step.target}"]`);
        if (!element) {
            setTooltipPosition(getCenterPosition());
            setSpotlightPosition({});
            return;
        }

        const rect = element.getBoundingClientRect();

        // Update spotlight position
        setSpotlightPosition({
            top: rect.top - 5,
            left: rect.left - 5,
            width: rect.width + 10,
            height: rect.height + 10
        });

        // Update tooltip position
        const tooltip = { position: 'fixed', zIndex: 10000 };
        const centerX = rect.left + rect.width / 2;
        
        if (step.position === 'bottom') {
            tooltip.top = rect.bottom + 10;
            tooltip.left = centerX;
            tooltip.transform = 'translateX(-50%)';
        } else if (step.position === 'top') {
            tooltip.bottom = window.innerHeight - rect.top + 10;
            tooltip.left = centerX;
            tooltip.transform = 'translateX(-50%)';
        } else {
            Object.assign(tooltip, getCenterPosition());
        }
        
        setTooltipPosition(tooltip);
    };

    const updatePositions = () => {
        const step = steps[currentStep];

        if (!step.target) {
            setTooltipPosition(getCenterPosition());
            setSpotlightPosition({});
            return;
        }

        const element = document.querySelector(`[data-tutorial="${step.target}"]`);
        if (!element) {
            setTooltipPosition(getCenterPosition());
            setSpotlightPosition({});
            return;
        }

        // Scroll to the element first
        scrollToElement(element);

        // Wait for scroll to potentially complete before calculating positions
        setTimeout(() => {
            calculatePositions();
        }, 300); // Wait for scroll animation to complete
    };

    //update the  positions when step changes or component mounts
    useEffect(() => {
        if (!isVisible) return;
        
        //When step changes, scroll to element and update positions
        updatePositions();

        //for manual scroll and resize events, just calculate positions without auto-scrolling
        const handleUpdate = () => calculatePositions();
        window.addEventListener('scroll', handleUpdate);
        window.addEventListener('resize', handleUpdate);

        return () => {
            window.removeEventListener('scroll', handleUpdate);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [currentStep, isVisible]);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleTutorialEnd();
        }
    };

    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleTutorialEnd = () => {
        localStorage.setItem('tutorial-completed', 'true');
        setIsVisible(false);
        onComplete?.();
    };

    if (!isVisible) return null;

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <>
            {/* Overlay */}
            <div className="tutorial-overlay" />

            {/* Spotlight */}
            {currentStepData.target && (
                <div className="tutorial-spotlight-container">
                    <div
                        className="tutorial-spotlight"
                        style={spotlightPosition}
                    />
                </div>
            )}

            {/* Tooltip */}
            <div className="tutorial-tooltip" style={tooltipPosition}>
                <div className="tutorial-header">
                    <h3 className="tutorial-title">{currentStepData.title}</h3>
                    <button onClick={handleTutorialEnd} className="tutorial-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <p className="tutorial-content">
                    {currentStepData.content}
                </p>

                <div className="tutorial-footer">
                    <div className="tutorial-progress">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`tutorial-progress-dot ${index <= currentStep ? 'active' : 'inactive'}`}
                            />
                        ))}
                    </div>

                    <div className="tutorial-navigation">
                        {!isFirstStep && (
                            <button onClick={prevStep} className="tutorial-btn tutorial-btn-secondary">
                                <ChevronLeft size={16} />
                                Back
                            </button>
                        )}

                        <button onClick={nextStep} className="tutorial-btn tutorial-btn-primary">
                            {isLastStep ? (
                                <>
                                    <Play size={16} />
                                    Get Started
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="tutorial-skip-container">
                    <button onClick={handleTutorialEnd} className="tutorial-skip-btn">
                        Skip tutorial
                    </button>
                </div>
            </div>
        </>
    );
};

export default Tutorial;