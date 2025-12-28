import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
    try {
        const { planId, totalCount, quantity, customerId, notes } = await request.json();

        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // Create subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: totalCount || 12, // Number of billing cycles
            quantity: quantity || 1,
            customer_notify: 1,
            notes: notes || {},
        });

        return NextResponse.json({
            success: true,
            subscription,
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create subscription',
            },
            { status: 500 }
        );
    }
}
