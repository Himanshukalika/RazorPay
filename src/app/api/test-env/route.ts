import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        razorpay_key_configured: !!process.env.RAZORPAY_KEY_ID,
        razorpay_secret_configured: !!process.env.RAZORPAY_KEY_SECRET,
        public_key_configured: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        pixel_configured: !!process.env.NEXT_PUBLIC_META_PIXEL_ID,
        // Don't expose actual values, just check if they exist
    });
}
