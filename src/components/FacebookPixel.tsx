'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
    interface Window {
        fbq: any;
        _fbq: any;
    }
}

export default function FacebookPixel() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

    useEffect(() => {
        if (!pixelId) {
            console.warn('Facebook Pixel ID not found in environment variables');
            return;
        }

        // Initialize Facebook Pixel
        import('react-facebook-pixel')
            .then((module) => module.default)
            .then((ReactPixel) => {
                ReactPixel.init(pixelId);
                ReactPixel.pageView();
                console.log('Facebook Pixel initialized:', pixelId);
            })
            .catch((error) => {
                console.error('Error loading Facebook Pixel:', error);
            });
    }, [pixelId]);

    useEffect(() => {
        // Track page views on route change
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'PageView');
            console.log('Facebook Pixel: PageView tracked');
        }
    }, [pathname, searchParams]);

    return null;
}

// Helper functions for tracking events
export const trackEvent = (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, data);
        console.log(`Facebook Pixel: ${eventName} tracked`, data);
    }
};

export const trackCustomEvent = (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', eventName, data);
        console.log(`Facebook Pixel: Custom ${eventName} tracked`, data);
    }
};
