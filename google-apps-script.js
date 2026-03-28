/**
 * Shalom Retreat Centre - Improved Google Sheets Handler
 * 
 * This script automatically organizes form submissions into different tabs
 * based on the retreat name. Each retreat gets its own organized tab!
 * 
 * HOW TO USE:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire code
 * 5. Click "Deploy" → "New deployment"
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click "Deploy" and copy the URL
 * 10. Update the URL in your website's script.js file
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Determine which sheet to use based on the form type
    var sheetName = determineSheetName(e.parameter);
    
    // Get or create the target sheet
    var targetSheet = sheet.getSheetByName(sheetName);
    if (!targetSheet) {
      targetSheet = sheet.insertSheet(sheetName);
      addHeaders(targetSheet, sheetName);
    }
    
    // Prepare and append data
    var rowData = prepareRowData(e.parameter, sheetName);
    targetSheet.appendRow(rowData);
    
    // Log success
    console.log('Data saved to: ' + sheetName);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully to ' + sheetName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    console.error('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Determine which sheet to save data to
 */
function determineSheetName(params) {
  // Priority 1: Explicit sheetName from retreat form
  if (params.sheetName && params.sheetName.trim() !== '') {
    return params.sheetName.trim();
  }
  
  // Priority 2: Retreat name from retreat registration
  if (params.retreatName && params.retreatName.trim() !== '') {
    return params.retreatName.trim();
  }
  
  // Priority 3: Contact page submission
  if (params.subject || (params.message && !params.firstName)) {
    return 'Contact Inquiries';
  }
  
  // Default: General contact/newsletter signups
  return 'Newsletter Signups';
}

/**
 * Add appropriate headers based on sheet type
 */
function addHeaders(sheet, sheetName) {
  var headers;
  
  if (sheetName === 'Contact Inquiries') {
    headers = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message'
    ];
  } else if (sheetName === 'Newsletter Signups') {
    headers = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Message'
    ];
  } else {
    // Retreat registration headers
    headers = [
      'Timestamp',
      'Retreat Name',
      'Name',
      'Email',
      'Phone',
      'Address',
      'Dietary Requirements',
      'Medical Information',
      'Additional Notes'
    ];
  }
  
  sheet.appendRow(headers);
  
  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#5a7d9a');
  headerRange.setFontColor('#ffffff');
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Prepare row data based on form type
 */
function prepareRowData(params, sheetName) {
  var timestamp = new Date();
  
  if (sheetName === 'Contact Inquiries') {
    return [
      timestamp,
      params.name || '',
      params.email || '',
      params.phone || '',
      params.subject || '',
      params.message || ''
    ];
  } else if (sheetName === 'Newsletter Signups') {
    return [
      timestamp,
      params.name || '',
      params.email || '',
      params.phone || '',
      params.message || ''
    ];
  } else {
    // Retreat registration data
    return [
      timestamp,
      params.retreatName || '',
      params.Name || '',
      params.email || '',
      params.phone || '',
      params.address || '',
      params.dietary || '',
      params.medical || '',
      params.notes || ''
    ];
  }
}

/**
 * Test function - use this to verify the script works
 */
function testScript() {
  var testData = {
    parameter: {
      sheetName: 'Test Retreat',
      retreatName: 'Test Retreat',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Test St',
      accommodation: 'Private Room',
      dietary: 'No restrictions',
      medical: 'None',
      emergency: 'Jane Doe - 098-765-4321',
      notes: 'Looking forward to the retreat!'
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}


/**
 * INSTALLATION INSTRUCTIONS:
 * 
 * 1. Save this script in Google Apps Script
 * 2. Run the testScript() function to make sure it works
 * 3. Deploy as a Web App:
 *    - Click "Deploy" → "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 
 * 4. Copy the Web App URL that looks like:
 *    https://script.google.com/macros/s/ABC123.../exec
 * 
 * 5. Update your website's script.js:
 *    Find: const scriptURL = '...';
 *    Replace with your new URL
 * 
 * 6. Save and upload script.js to your website
 * 
 * RESULT:
 * - Newsletter signups go to "Newsletter Signups" tab
 * - Contact form submissions go to "Contact Inquiries" tab
 * - Each retreat gets its own tab (e.g., "Silent Retreat", "Advent Retreat")
 * - All data is automatically organized!
 */
