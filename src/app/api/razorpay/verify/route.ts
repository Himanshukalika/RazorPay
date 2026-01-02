import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Create signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        // Verify signature
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is successful
            // Here you can save payment details to database
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Payment verification failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
