import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeAnimation from './WelcomeAnimation';

const WelcomeManager = () => {
    const location = useLocation();
    const [welcomeType, setWelcomeType] = useState(null);

    useEffect(() => {
        // Check for the flag on every location change
        const type = sessionStorage.getItem('showWelcome');
        if (type) {
            setWelcomeType(type);
        }
    }, [location]);

    const handleAnimationComplete = () => {
        setWelcomeType(null);
        sessionStorage.removeItem('showWelcome');
    };

    if (!welcomeType) return null;

    return <WelcomeAnimation type={welcomeType} onComplete={handleAnimationComplete} />;
};

export default WelcomeManager;
