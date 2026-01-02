import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'INR' } = await req.json();

        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // Create order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
