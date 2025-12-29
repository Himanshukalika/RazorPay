#!/bin/bash

# Razorpay Payment Gateway - Vercel Deployment Script
# Run this after vercel login

echo "🚀 Starting Vercel Deployment..."
echo ""

# Step 1: Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings → Domains"
echo "4. Add your subdomain (e.g., pay.example.com)"
echo ""
echo "5. Add Environment Variables:"
echo "   Settings → Environment Variables → Add:"
echo "   - RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0"
echo "   - RAZORPAY_KEY_SECRET=917FiE8XMWwrcpG7kzChKObR"
echo "   - NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0"
echo "   - NEXT_PUBLIC_META_PIXEL_ID=2064676100935063"
echo "   - NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_Rx1jfbIaIu8tzL"
echo ""
echo "6. Redeploy after adding environment variables"
echo ""
echo "7. Update Hostinger DNS:"
echo "   - Type: CNAME"
echo "   - Name: pay (or your subdomain)"
echo "   - Points to: cname.vercel-dns.com"
echo ""
echo "8. Update Razorpay Dashboard:"
echo "   - Add your domain in Website Details"
echo ""
echo "🎉 Done! Your payment page will be live at your subdomain!"
