/**
 * Google Apps Script for MakeUp Mastry Club - Customer Data Collection
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy this code into the script editor
 * 4. Click Deploy > New deployment
 * 5. Select "Web app" as deployment type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click Deploy and copy the Web App URL
 * 9. Add the URL to your .env.local as GOOGLE_SHEET_URL
 */

function doPost(e) {
    try {
        // Parse the incoming data
        const data = JSON.parse(e.postData.contents);

        // Get the active spreadsheet
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Check if headers exist, if not create them
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Timestamp',
                'First Name',
                'Last Name',
                'Email',
                'Mobile',
                'Plan',
                'Amount (₹)',
                'Subscription ID',
                'Payment ID'
            ]);

            // Format header row
            const headerRange = sheet.getRange(1, 1, 1, 9);
            headerRange.setFontWeight('bold');
            headerRange.setBackground('#4285f4');
            headerRange.setFontColor('#ffffff');
        }

        // Add the new row with customer data
        sheet.appendRow([
            data.timestamp || new Date().toISOString(),
            data.firstName || '',
            data.lastName || '',
            data.email || '',
            data.mobile || '',
            data.plan || '',
            data.amount || '',
            data.subscriptionId || '',
            data.paymentId || ''
        ]);

        // Auto-resize columns for better readability
        sheet.autoResizeColumns(1, 9);

        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return error response
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.toString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Test function (optional - for testing in Apps Script editor)
function testDoPost() {
    const testData = {
        postData: {
            contents: JSON.stringify({
                timestamp: new Date().toISOString(),
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                mobile: '9876543210',
                plan: '3 Months Plan',
                amount: 2799,
                subscriptionId: 'sub_test123',
                paymentId: 'pay_test456'
            })
        }
    };

    const result = doPost(testData);
    Logger.log(result.getContent());
}
