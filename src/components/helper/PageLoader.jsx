import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../../assets/nprogress-custom.css';
NProgress.configure({
    showSpinner: false
});

const PageLoader = () => {
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 0);

        return () => {
            clearTimeout(timeout);
        };
    }, [location.pathname]);

    return null;
};

export default PageLoader;
