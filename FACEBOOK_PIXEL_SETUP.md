# Facebook/Meta Pixel Tracking Setup

## Overview
Facebook Pixel is integrated to track all user actions on the checkout page for advertising optimization and analytics.

## Events Being Tracked

### Standard Events:

1. **PageView** 
   - Automatically tracked on every page load
   - Location: Layout component

2. **InitiateCheckout**
   - Triggered when: User starts filling the form (first character in First Name)
   - Data: Product name, category, value, currency

3. **AddToCart**
   - Triggered when: User clicks "Complete Order" button
   - Data: Product name, type, category, value, currency

4. **Subscribe** (Subscription only)
   - Triggered when: Subscription payment is successful
   - Data: Product name, category, value, currency, predicted LTV

5. **Purchase**
   - Triggered when: Payment is successfully verified
   - Data: Product name, type, value, currency, quantity
   - Variants: Subscription vs One-time payment

### Custom Events:

1. **FormProgress**
   - Triggered when: User enters valid email
   - Data: Step name, product name

## Setup Instructions

### Step 1: Get Facebook Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel or create a new one
3. Copy the Pixel ID (15-16 digit number)

### Step 2: Add Pixel ID to Environment Variables

Update `.env.local`:

```env
# Facebook/Meta Pixel ID
NEXT_PUBLIC_FB_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

Example:
```env
NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456
```

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Verify Installation

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/) Chrome extension
2. Visit your checkout page
3. Click the extension icon
4. Verify Pixel is active and events are firing

## Event Flow Example

### User Journey with Tracking:

```
1. User lands on page
   → PageView tracked

2. User types first name
   → InitiateCheckout tracked

3. User enters email
   → FormProgress (custom) tracked

4. User clicks "Complete Order"
   → AddToCart tracked

5. User completes payment (Subscription)
   → Subscribe tracked
   → Purchase tracked
```

## Testing Events

### Using Facebook Pixel Helper:

1. Open checkout page
2. Perform actions (fill form, click button, etc.)
3. Check Pixel Helper for events
4. Verify event parameters

### Using Facebook Events Manager:

1. Go to Events Manager → Test Events
2. Enter your website URL
3. Perform actions on the page
4. See real-time events in Test Events tab

## Event Parameters

### Standard Parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `content_name` | Product/Service name | "MakeUp Mastry Club" |
| `content_type` | Type of content | "product" |
| `content_category` | Category | "Subscription" |
| `value` | Transaction value | 1.00 |
| `currency` | Currency code | "INR" |
| `num_items` | Quantity | 1 |
| `predicted_ltv` | Lifetime value | 12.00 |

## Custom Event Tracking

To add more custom events, use the helper functions:

```typescript
import { trackEvent, trackCustomEvent } from '@/components/FacebookPixel';

// Standard event
trackEvent('ViewContent', {
  content_name: 'Product Name',
  value: 100,
  currency: 'INR',
});

// Custom event
trackCustomEvent('ButtonClick', {
  button_name: 'Subscribe',
  page: 'checkout',
});
```

## Conversion API (Advanced)

For better tracking accuracy, implement Conversion API:

### Benefits:
- Server-side tracking
- Works without cookies
- Better data accuracy
- iOS 14+ tracking

### Implementation:
1. Get Conversion API Access Token from Facebook
2. Create server-side endpoint
3. Send events from backend
4. Match with browser events using `event_id`

## Privacy & Compliance

### GDPR Compliance:
- Add cookie consent banner
- Allow users to opt-out
- Update privacy policy

### Data Collection:
- Email addresses (hashed)
- Transaction data
- User behavior
- No sensitive payment info

## Troubleshooting

### Pixel Not Loading:
- ✅ Check Pixel ID in `.env.local`
- ✅ Verify environment variable name: `NEXT_PUBLIC_FB_PIXEL_ID`
- ✅ Restart development server
- ✅ Clear browser cache

### Events Not Firing:
- ✅ Check browser console for errors
- ✅ Verify Pixel Helper shows pixel active
- ✅ Check network tab for `fbevents.js`
- ✅ Ensure ad blockers are disabled

### Wrong Event Data:
- ✅ Check event parameters in code
- ✅ Verify data types (numbers vs strings)
- ✅ Test with Facebook Test Events

## Best Practices

1. **Test Before Launch:**
   - Use Test Events feature
   - Verify all events fire correctly
   - Check parameter values

2. **Monitor Regularly:**
   - Check Events Manager daily
   - Look for errors or warnings
   - Monitor event match quality

3. **Optimize for Conversions:**
   - Set up Custom Conversions
   - Create lookalike audiences
   - Use for ad optimization

4. **Keep Updated:**
   - Update pixel code regularly
   - Follow Facebook's guidelines
   - Implement new features

## Facebook Ads Integration

### Using Tracked Events:

1. **Campaign Optimization:**
   - Optimize for Purchase events
   - Use Subscribe for subscription campaigns

2. **Custom Audiences:**
   - Create audience from InitiateCheckout
   - Retarget AddToCart users
   - Exclude Purchase users

3. **Lookalike Audiences:**
   - Based on Purchase events
   - Based on Subscribe events

4. **Dynamic Ads:**
   - Use product catalog
   - Show personalized ads

## Analytics & Reporting

### Available Reports:

1. **Event Analytics:**
   - Total events
   - Unique users
   - Conversion rate

2. **Funnel Analysis:**
   - PageView → InitiateCheckout
   - InitiateCheckout → AddToCart
   - AddToCart → Purchase

3. **Revenue Tracking:**
   - Total revenue
   - Average order value
   - Subscription revenue

## Next Steps

- [ ] Add cookie consent banner
- [ ] Implement Conversion API
- [ ] Set up Custom Conversions
- [ ] Create Facebook ad campaigns
- [ ] Monitor and optimize events
- [ ] A/B test different tracking strategies

## Support & Resources

- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Events Manager](https://business.facebook.com/events_manager)
- [Pixel Helper Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)
- [Conversion API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
