import { useEffect, useState } from 'react';

const useDeviceDetect = (): string => {
    const [device, setDevice] = useState('desktop');

    useEffect(() => {
        const detectDevice = () => {
            const userAgent = navigator.userAgent;
            const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const isMobileViewport = window.innerWidth <= 768;
            setDevice(isMobileUserAgent || isMobileViewport ? 'mobile' : 'desktop');
        };

        detectDevice();
        window.addEventListener('resize', detectDevice);

        return () => {
            window.removeEventListener('resize', detectDevice);
        };
    }, []);

    return device;
};

export default useDeviceDetect;