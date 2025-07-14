import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 bg-red-500 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-red-600 hover:scale-110 transform will-change-transform ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            aria-label="Lên đầu"
        >
            <ArrowUp size={20} />
        </button>
    );
}
