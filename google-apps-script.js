/**
 * Shalom Retreat Centre — Google Sheets Handler
 *
 * CHANGES vs. original:
 *  1. Timestamp format  → DD/MM/YYYY HH:MM  (no seconds)
 *  2. Column order      → Timestamp, Name, Phone, Email, Message
 *  3. Phone format      → Irish local 08X XXX XXXX  (no +353)
 *  4. Admin SMS         → Twilio notification on every booking
 *  5. User email        → MailApp confirmation email after every submission
 *
 * ─────────────────────────────────────────────
 *  SETUP — Script Properties
 *  (Extensions → Apps Script → Project Settings → Script Properties)
 *
 *  Key                    Value
 *  TWILIO_ACCOUNT_SID     ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *  TWILIO_AUTH_TOKEN      your_auth_token
 *  TWILIO_FROM            +353XXXXXXXXXX  (your Twilio number)
 *  ADMIN_PHONE            +353XXXXXXXXXX  (work phone)
 *
 *  Twilio free trial: https://www.twilio.com/try-twilio
 *  Email uses the Gmail account that owns this script — no extra config.
 * ─────────────────────────────────────────────
 */

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var sheet     = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = determineSheetName(e.parameter);

    var targetSheet = sheet.getSheetByName(sheetName);
    if (!targetSheet) {
      targetSheet = sheet.insertSheet(sheetName);
      addHeaders(targetSheet, sheetName);
    }

    var params = normaliseParams(e.parameter);

    targetSheet.appendRow(prepareRowData(params, sheetName));

    // Side-effects — wrapped individually so neither can break the save
    sendAdminSMS(params);
    sendConfirmationEmail(params, sheetName);

    console.log('Saved to: ' + sheetName);
    return jsonOK('Data saved to ' + sheetName);

  } catch (error) {
    console.error('doPost error: ' + error.toString());
    return jsonError(error.toString());
  }
}

// ─── SHEET ROUTING ────────────────────────────────────────────────────────────
function determineSheetName(params) {
  if (params.sheetName   && params.sheetName.trim()   !== '') return params.sheetName.trim();
  if (params.retreatName && params.retreatName.trim() !== '') return params.retreatName.trim();
  if (params.subject || (params.message && !params.firstName)) return 'Contact Inquiries';
  return 'Newsletter Signups';
}

// ─── NORMALISE PARAMS ─────────────────────────────────────────────────────────
function normaliseParams(raw) {
  var p = {};
  for (var k in raw) p[k] = raw[k];
  p.displayName = (p.Name || p.name || '').trim();
  p.phone       = formatIrishPhone(p.phone || '');
  p.timestamp   = formatTimestamp(new Date());
  return p;
}

// ─── TIMESTAMP — DD/MM/YYYY HH:MM ────────────────────────────────────────────
function formatTimestamp(date) {
  var dd   = pad2(date.getDate());
  var mm   = pad2(date.getMonth() + 1);
  var yyyy = date.getFullYear();
  var hh   = pad2(date.getHours());
  var min  = pad2(date.getMinutes());
  return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
}
function pad2(n) { return n < 10 ? '0' + n : String(n); }

// ─── PHONE FORMATTER — 08X XXX XXXX (LTR, no +353) ───────────────────────────
function formatIrishPhone(raw) {
  if (!raw) return '';
  var digits = raw.replace(/[^\d]/g, '');

  // Strip international prefix 353 / 00353
  if (digits.length >= 11 && digits.substring(0, 3) === '353')
    digits = '0' + digits.substring(3);
  if (digits.length >= 12 && digits.substring(0, 4) === '0353')
    digits = '0' + digits.substring(4);

  // Format 10-digit Irish mobile
  if (digits.length === 10 && digits.substring(0, 2) === '08')
    return digits.substring(0, 3) + ' ' + digits.substring(3, 6) + ' ' + digits.substring(6, 10);

  return raw.trim();
}

// ─── HEADERS ─────────────────────────────────────────────────────────────────
function addHeaders(sheet, sheetName) {
  var headers;
  if (sheetName === 'Contact Inquiries') {
    headers = ['Timestamp', 'Name', 'Phone', 'Email', 'Subject', 'Message'];
  } else if (sheetName === 'Newsletter Signups') {
    headers = ['Timestamp', 'Name', 'Phone', 'Email', 'Message'];
  } else {
    headers = ['Timestamp', 'Retreat Name', 'Name', 'Phone', 'Email',
               'Address', 'Dietary Requirements', 'Medical Information', 'Additional Notes'];
  }

  sheet.appendRow(headers);
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setFontWeight('bold');
  range.setBackground('#5a7d9a');
  range.setFontColor('#ffffff');

  // Force LTR on the Phone column so numbers always read correctly
  var phoneCol = headers.indexOf('Phone') + 1;
  if (phoneCol > 0)
    sheet.getRange(2, phoneCol, sheet.getMaxRows() - 1, 1)
         .setTextDirection(SpreadsheetApp.TextDirection.LEFT_TO_RIGHT);

  for (var i = 1; i <= headers.length; i++) sheet.autoResizeColumn(i);
}

// ─── ROW DATA — column order: Timestamp, Name, Phone, Email, Message ─────────
function prepareRowData(p, sheetName) {
  if (sheetName === 'Contact Inquiries')
    return [p.timestamp, p.displayName, p.phone, p.email || '', p.subject || '', p.message || ''];

  if (sheetName === 'Newsletter Signups')
    return [p.timestamp, p.displayName, p.phone, p.email || '', p.message || ''];

  // Retreat registration
  return [p.timestamp, p.retreatName || '', p.displayName, p.phone,
          p.email || '', p.address || '', p.dietary || '', p.medical || '', p.notes || ''];
}

// ─── ADMIN SMS VIA TWILIO ─────────────────────────────────────────────────────
function sendAdminSMS(p) {
  try {
    var props = PropertiesService.getScriptProperties();
    var sid   = props.getProperty('TWILIO_ACCOUNT_SID');
    var token = props.getProperty('TWILIO_AUTH_TOKEN');
    var from  = props.getProperty('TWILIO_FROM');
    var to    = props.getProperty('ADMIN_PHONE');

    if (!sid || !token || !from || !to) {
      console.warn('Twilio not configured — SMS skipped.');
      return;
    }

    var body = [
      'NEW Shalom Booking',
      'Name:  ' + (p.displayName || '—'),
      'Phone: ' + (p.phone       || '—'),
      'Email: ' + (p.email       || '—'),
      'Time:  ' + p.timestamp
    ].join('\n');

    var resp = UrlFetchApp.fetch(
      'https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json',
      {
        method: 'post',
        muteHttpExceptions: true,
        headers: { Authorization: 'Basic ' + Utilities.base64Encode(sid + ':' + token) },
        payload: { From: from, To: to, Body: body }
      }
    );
    console.log('SMS [' + resp.getResponseCode() + ']: ' + resp.getContentText());
  } catch (e) {
    console.error('sendAdminSMS: ' + e.toString());
  }
}

// ─── USER CONFIRMATION EMAIL ──────────────────────────────────────────────────
function sendConfirmationEmail(p, sheetName) {
  var email = (p.email || '').trim();
  if (!email) { console.warn('No email — confirmation skipped.'); return; }

  try {
    var retreat  = (p.retreatName || 'our upcoming retreat').trim();
    var firstName = (p.displayName || 'there').split(' ')[0];

    var htmlBody = '<div style="font-family:Georgia,serif;color:#2c3e50;max-width:560px;margin:0 auto">'
      + '<div style="background:#5a7d9a;padding:28px 32px;border-radius:8px 8px 0 0;text-align:center">'
      +   '<p style="color:#fff;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px">The Shalom Retreat Centre</p>'
      +   '<h1 style="color:#fff;font-size:26px;font-weight:400;margin:0">Booking Received</h1>'
      + '</div>'
      + '<div style="background:#f8f9fa;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;border-top:none">'
      +   '<p style="font-size:16px">Dear ' + firstName + ',</p>'
      +   '<p>Thank you for registering for <strong>' + retreat + '</strong> at The Shalom Retreat Centre.</p>'
      +   '<p>Your booking request has been <strong>received</strong> and is currently <strong>pending confirmation</strong> from our staff. We will be in contact shortly to confirm your place.</p>'
      +   '<p>If you have any questions, please contact us:</p>'
      +   '<ul style="line-height:2.2">'
      +     '<li>&#x1F4E7; <a href="mailto:bookings@shalomcentre.ie">bookings@shalomcentre.ie</a></li>'
      +     '<li>&#x1F4DE; <a href="tel:+353834405359">+353 (0) 83 440 5359</a></li>'
      +     '<li>&#x1F552; Mon&ndash;Fri: 9:30am &ndash; 4:30pm</li>'
      +   '</ul>'
      +   '<p style="margin-top:24px">God bless,<br><strong>The Shalom Retreat Centre Team</strong><br>'
      +   '<small style="color:#6b7c8e">Main Street, Charleville, Co. Cork, P56 YP79</small></p>'
      + '</div></div>';

    var plainBody = 'Dear ' + firstName + ',\n\n'
      + 'Thank you for registering for ' + retreat + ' at The Shalom Retreat Centre.\n\n'
      + 'Your booking request has been received and is pending confirmation from our staff.\n'
      + 'We will be in contact shortly.\n\n'
      + 'Contact us:\n'
      + 'Email: bookings@shalomcentre.ie\n'
      + 'Phone: +353 (0) 83 440 5359\n'
      + 'Hours: Mon-Fri 9:30am - 4:30pm\n\n'
      + 'God bless,\nThe Shalom Retreat Centre\nMain Street, Charleville, Co. Cork';

    MailApp.sendEmail({
      to:       email,
      subject:  'Booking Received — ' + retreat + ' | Shalom Retreat Centre',
      body:     plainBody,
      htmlBody: htmlBody
    });
    console.log('Confirmation sent to ' + email);
  } catch (e) {
    console.error('sendConfirmationEmail: ' + e.toString());
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function jsonOK(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: msg }))
                       .setMimeType(ContentService.MimeType.JSON);
}
function jsonError(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: msg }))
                       .setMimeType(ContentService.MimeType.JSON);
}

// ─── MANUAL TEST ─────────────────────────────────────────────────────────────
function testScript() {
  var fake = {
    parameter: {
      sheetName:   'Test Retreat',
      retreatName: 'Test Retreat',
      Name:        'Aoife Murphy',
      email:       'test@example.com',
      phone:       '+353831234567',
      address:     '1 Test Lane, Cork',
      dietary:     'Vegetarian',
      medical:     'None',
      notes:       'Looking forward to it!'
    }
  };
  Logger.log(doPost(fake).getContent());
}
