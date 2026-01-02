import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        const { planId, totalCount, customerNotify = 1, notes = {} } = await req.json();

        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // Create subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId || process.env.RAZORPAY_PLAN_ID!,
            total_count: totalCount || 12, // Number of billing cycles (e.g., 12 months)
            customer_notify: customerNotify,
            notes: notes,
        });

        return NextResponse.json({
            success: true,
            subscriptionId: subscription.id,
            status: subscription.status,
            planId: subscription.plan_id,
            shortUrl: subscription.short_url,
        });
    } catch (error: any) {
        console.error('Error creating Razorpay subscription:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to create subscription',
                details: error.error?.description || error.description
            },
            { status: 500 }
        );
    }
}
