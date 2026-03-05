# Security Implementation & Deployment Guide

## Overview

This guide walks you through deploying the enhanced security features for Danvion. The implementation uses **Phased Deployment** to ensure zero downtime and maintain admin access throughout.

---

## Phase 1: Setup (Today - 30 mins)

### Step 1: Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### Step 2: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This deploys 7 functions:

- ✅ `setAdminClaims` - Set admin custom claim on your account
- ✅ `rateLimitContactSubmission` - Rate limiting for form submissions
- ✅ `logAdminAccess` - Audit logging for all admin changes
- ✅ `deleteOldContactMessages` - Auto-delete for GDPR (runs daily 3 AM UTC)
- ✅ `sendContactConfirmation` - Notification when message received
- ✅ `recordUserConsent` - GDPR consent tracking
- ✅ `cleanupRateLimitLogs` - Cleanup old rate limiting logs

**What happens:**

- Functions are deployed but not yet activated
- Your current email-based admin access still works
- All new infrastructure is in place

### Step 3: Setup Cloud Scheduler for Auto-Delete

1. Go to **Firebase Console** → **Cloud Functions**
2. Click on `deleteOldContactMessages` function
3. If not already scheduled, go to **Cloud Scheduler** in Google Cloud Console
4. Create a new job:
   - **Name:** `delete-old-contact-messages`
   - **Frequency:** `0 3 * * *` (Daily at 3 AM UTC)
   - **Timezone:** UTC
   - **Execution Timeout:** 540 seconds (9 minutes)
   - **Retry on Failure:** Yes (1 retry)

---

## Phase 2: Activate Custom Claims (Testing - Day 1)

### Step 1: Call setAdminClaims Function

This needs to be done from your logged-in account:

**Option A: From Firebase Console (Easiest)**

1. Go to Firebase Console → Cloud Functions
2. Click on `setAdminClaims` function
3. Click "Testing" tab
4. Click "Call the function"
5. Should return: `success: true, Admin claims set successfully`

**Option B: From Your App (If integrated)**

```javascript
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const setAdminClaims = httpsCallable(functions, "setAdminClaims");

async function setupAdminClaims() {
  try {
    const result = await setAdminClaims({});
    console.log("Admin claims set:", result.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

setAdminClaims();
```

### Step 2: Verify Custom Claim Was Set

1. Log out and log back in to your admin account
2. Go to **Firebase Console** → **Authentication**
3. Find your user (sazid@danvion.com)
4. Click the three dots → **Edit user**
5. Scroll to **Custom Claims** section
6. Verify you see: `{ "admin": true }`

### Step 3: Update Firestore Rules (Hybrid Mode)

1. Go to **Firebase Console** → **Firestore** → **Rules**
2. Replace the current rules with the new `firestore.rules` content from the project
3. **Key change:** Now accepts BOTH email AND custom claims:
   ```javascript
   function isAdmin() {
     return (
       request.auth != null &&
       (request.auth.token.admin == true || // NEW
         request.auth.token.email == "sazid@danvion.com") // OLD (temporary)
     );
   }
   ```
4. Click **Publish**

### Step 4: Test Admin Panel Access

- ✅ Log in to admin panel at `/admin`
- ✅ Verify you can read contact messages
- ✅ Verify you can edit products/blogs
- ✅ Try creating a new entry - should work

**If it works:** Excellent! Move to Phase 3.
**If it doesn't work:**

- Check Cloud Firestore > Rules in console for errors
- Verify custom claim exists (Step 2 above)
- Refresh page/clear browser cache

---

## Phase 3: Production Deployment (Day 2-3)

### Step 1: Test Rate Limiting

Submit contact form 5+ times from same IP/email:

- ✅ First 5 submissions should succeed
- ✅ 6th submission should show: "Too many submissions. Please try again in 1 hour."

### Step 2: Verify Audit Logs

1. Go to **Firestore Console**
2. Check `audit_logs` collection:
   - Should have entries for admin_claim_set
   - Should have entries for contact_message_created
   - Should have entries for admin operations

### Step 3: Monitor and Schedule Cleanup

Background jobs running:

- ✅ `deleteOldContactMessages` - Deletes messages older than 30 days (daily 3 AM UTC)
- ✅ `cleanupRateLimitLogs` - Deletes rate limit logs older than 7 days (daily 4 AM UTC)

### Step 4: Remove Email-Based Fallback (Optional - Final Security)

**⚠️ ONLY after thoroughly testing custom claims**

Update `firestore.rules`:

```javascript
// PHASE 2 ONLY: Remove this option
function isAdmin() {
  return request.auth != null && request.auth.token.admin == true;
}
```

Then publish rules in Firebase Console.

---

## Deployment Checklist

### Before Publishing Rules

- [ ] Cloud Functions deployed successfully
- [ ] `setAdminClaims` function called
- [ ] Custom claim verified in Firebase Console
- [ ] Admin panel access tested
- [ ] Contact form works
- [ ] Rate limiting tested

### After Publishing Rules

- [ ] Admin panel still accessible
- [ ] Can read/edit contact messages
- [ ] Can create/edit products
- [ ] Can create/edit blogs
- [ ] Rate limiting prevents spam
- [ ] Audit logs recording events

### Production Safety

- [ ] Backup Firestore (if not already auto-backed up)
- [ ] Monitor Cloud Function logs for errors
- [ ] Check Firestore for unexpected data
- [ ] Verify rate limiting is working

---

## Testing Scenarios

### Test 1: Rate Limiting

```
1. Open contact form in incognito window
2. Submit 5 valid messages
3. 6th submission should fail with "Too many submissions"
4. Wait 1 hour (or clear localStorage for testing)
5. Should allow submission again
```

### Test 2: Input Validation

```
1. Try submitting with invalid email: "test@invalid"
   → Should fail (invalid format)
2. Try submitting with name: "A"
   → Should fail (too short, min 2 chars)
3. Try submitting with message: "Short"
   → Should fail (too short, min 10 chars)
4. Submit valid form
   → Should succeed
```

### Test 3: Admin Access

```
1. Go to /admin
2. Try accessing Contact Messages (should show)
3. Try accessing Products (should show)
4. Try creating new product (should work if admin)
5. Try deleting a product (should work if admin)
```

### Test 4: Audit Logging

```
1. Submit a contact message
2. Go to Firestore Console
3. Check audit_logs collection
4. Should see entry: contact_message_created
```

---

## Rollback Plan (If Something Goes Wrong)

### Issue: Can't access admin panel

**Solution:**

1. Go to Firebase Console → Authentication
2. Manually set custom claim via Firebase CLI:
   ```bash
   firebase functions:shell
   > setAdminClaims()
   ```
3. Or temporarily revert rules to accept email only:
   ```javascript
   function isAdmin() {
     return request.auth != null && request.auth.token.email == "sazid@danvion.com";
   }
   ```

### Issue: Rate limiting too aggressive

**Solution:**
Update limits in `functions/index.js`:

```javascript
if (ipSnapshot.size >= 5) {
  // Change to higher number like 10
  throw new error();
}
```

Then redeploy:

```bash
firebase deploy --only functions
```

### Issue: Auto-delete deleting too much data

**Solution:**
Modify retention period in `functions/index.js`:

```javascript
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60); // Change to 60 days
```

Or disable auto-delete by commenting out the function call.

---

## Monitoring & Troubleshooting

### Check Cloud Function Logs

```bash
firebase functions:log
```

### Check Firestore Rules Validation

- Firebase Console → Firestore → Rules
- Tab "Rules Playground" (left sidebar)
- Test your rules against sample requests

### Check Audit Logs

```javascript
// In Firestore Console, query:
db.collection("audit_logs").orderBy("timestamp", "desc").limit(20).get();
```

### Monitor Rate Limiting

```javascript
// Check recent rate limit logs:
db.collection("contact_submissions_log").orderBy("timestamp", "desc").limit(50).get();
```

---

## GDPR Compliance Status

After this deployment:

- ✅ Data retention policy: 30 days auto-delete
- ✅ Audit trail: All admin access logged
- ✅ Consent tracking: Timestamps recorded
- ✅ Input validation: Only clean data accepted
- ✅ Rate limiting: Prevents spam/abuse
- ⚠️ Encryption: Not yet implemented (Phase 3 optional)

---

## Next Steps (Future Enhancements)

### Optional - Phase 3 Improvements:

1. **Field-level encryption** for email/message
2. **Email notifications** when new contact received
3. **IP-based geolocation** for suspicious activity
4. **Two-factor authentication** for admin login
5. **Email verification** for contact submissions

---

## Support

If you encounter issues:

1. Check Cloud Function logs: `firebase functions:log`
2. Verify Firestore Rules in Firebase Console
3. Clear browser cache and log out/in
4. Check browser console for errors
5. Verify custom claim exists in Firebase Auth

**Emergency:** Rollback to email-based access in firestore.rules
