import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Create signature for subscription
        const body = razorpay_subscription_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        // Verify signature
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Subscription payment is successful
            // Here you can save subscription details to database
            return NextResponse.json({
                success: true,
                message: 'Subscription verified successfully',
                subscriptionId: razorpay_subscription_id,
                paymentId: razorpay_payment_id,
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Subscription verification failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying subscription:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify subscription' },
            { status: 500 }
        );
    }
}
