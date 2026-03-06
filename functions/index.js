const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * FUNCTION 1: Set Admin Custom Claims
 * ============================================================
 * Sets admin custom claim on a user account
 * Only callable by users with email 'sazid@danvion.com'
 * Part of Phase 1: Setting up custom claims for secure admin verification
 */
exports.setAdminClaims = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in");
  }

  // Only allow the owner to set admin claims
  const ownerEmail = "sazid@danvion.com";
  if (context.auth.email !== ownerEmail) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only the site owner can set admin claims",
    );
  }

  try {
    // Set custom claim
    await admin.auth().setCustomUserClaims(context.auth.uid, { admin: true });

    // Log this action
    await db.collection("audit_logs").add({
      action: "admin_claim_set",
      userId: context.auth.uid,
      email: context.auth.email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ipAddress: context.rawRequest.ip,
      userAgent: context.rawRequest.headers["user-agent"],
    });

    return {
      success: true,
      message: "Admin claims set successfully",
      uid: context.auth.uid,
    };
  } catch (error) {
    console.error("Error setting admin claims:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * FUNCTION 2: Rate Limiting for Contact Form Submissions
 * ============================================================
 * Prevents spam by limiting submissions per IP address
 * Limit: 5 submissions per hour per IP
 * Called via Cloud Function HTTP endpoint
 */
exports.rateLimitContactSubmission = functions.https.onCall(async (data, context) => {
  const ipAddress = context.rawRequest.ip;
  const email = data.email;

  // Get current hour timestamp
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    // Check submissions from this IP in the last hour
    const ipSnapshot = await db
      .collection("contact_submissions_log")
      .where("ipAddress", "==", ipAddress)
      .where("timestamp", ">=", hourAgo)
      .get();

    if (ipSnapshot.size >= 5) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Too many submissions from your IP address. Please try again in 1 hour.",
      );
    }

    // Check submissions from this email in the last hour
    const emailSnapshot = await db
      .collection("contact_submissions_log")
      .where("email", "==", email)
      .where("timestamp", ">=", hourAgo)
      .get();

    if (emailSnapshot.size >= 3) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Too many submissions from this email. Please try again in 1 hour.",
      );
    }

    // Log this submission attempt
    await db.collection("contact_submissions_log").add({
      ipAddress,
      email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: context.rawRequest.headers["user-agent"],
    });

    return {
      success: true,
      allowed: true,
      message: "Rate limit check passed",
    };
  } catch (error) {
    if (error.code === "resource-exhausted") {
      throw error;
    }
    console.error("Rate limit check error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * FUNCTION 3: Audit Logging for Admin Operations
 * ============================================================
 * Logs all admin access and modifications
 * Triggered on Firestore writes to sensitive collections
 */
exports.logAdminAccess = functions.firestore
  .document("contact_messages/{docId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    try {
      await db.collection("audit_logs").add({
        action: "contact_message_updated",
        documentId: context.params.docId,
        before,
        after,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        changes: Object.keys(after).filter((key) => before[key] !== after[key]),
      });
    } catch (error) {
      console.error("Audit logging error:", error);
    }
  });

/**
 * FUNCTION 4: Auto-Delete Old Contact Messages
 * ============================================================
 * GDPR Compliance: Automatically deletes contact messages older than 30 days
 * Runs daily at 3 AM UTC
 * Triggered by Cloud Scheduler
 */
exports.deleteOldContactMessages = functions.pubsub
  .schedule("every day 03:00")
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("Starting auto-delete of old contact messages...");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      // Query for messages older than 30 days
      const snapshot = await db
        .collection("contact_messages")
        .where("created_at", "<", admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      console.log(`Found ${snapshot.size} messages to delete`);

      // Delete in batches
      const batch = db.batch();
      let count = 0;

      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
        count++;

        // Firestore batch operation limit is 500
        if (count % 500 === 0) {
          batch.commit();
          return (batch = db.batch());
        }
      });

      // Commit remaining deletions
      if (count > 0) {
        await batch.commit();
      }

      // Log this operation
      await db.collection("audit_logs").add({
        action: "auto_delete_old_messages",
        messagesDeleted: count,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        olderThanDate: admin.firestore.Timestamp.fromDate(thirtyDaysAgo),
      });

      console.log(`Successfully deleted ${count} old contact messages`);
      return { success: true, deleted: count };
    } catch (error) {
      console.error("Error deleting old messages:", error);
      throw error;
    }
  });

/**
 * FUNCTION 5: Send Contact Submission Confirmation Email
 * ============================================================
 * Sends confirmation email to user and notification to admin
 * Triggered when contact_messages document is created
 */
exports.sendContactConfirmation = functions.firestore
  .document("contact_messages/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    try {
      // Log the submission
      await db.collection("audit_logs").add({
        action: "contact_message_created",
        documentId: context.params.docId,
        email: data.email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Contact message received from ${data.email}`);

      // In production, you would integrate with SendGrid/Firebase Email:
      // await sendEmailNotification(data.email, 'Contact Received', confirmationTemplate);
      // await notifyAdmin(data);

      return { success: true };
    } catch (error) {
      console.error("Error processing contact submission:", error);
      throw error;
    }
  });

/**
 * FUNCTION 6: User consent tracking
 * ============================================================
 * Records user consent for GDPR compliance
 * Called when user submits contact form with consent confirmation
 */
exports.recordUserConsent = functions.https.onCall(async (data, context) => {
  const { email, consentType, consentVersion } = data;
  const ipAddress = context.rawRequest.ip;

  try {
    // Record consent
    await db.collection("user_consents").add({
      email,
      consentType, // 'data_collection', 'marketing', 'analytics'
      consentVersion,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ipAddress,
      userAgent: context.rawRequest.headers["user-agent"],
    });

    // Log this for audit trail
    await db.collection("audit_logs").add({
      action: "user_consent_recorded",
      email,
      consentType,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: "Consent recorded successfully",
    };
  } catch (error) {
    console.error("Error recording consent:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * FUNCTION 7: Cleanup Old Rate Limit Logs
 * ============================================================
 * Removes rate limit logs older than 7 days
 * Runs daily to keep database clean
 */
exports.cleanupRateLimitLogs = functions.pubsub
  .schedule("every day 04:00")
  .timeZone("UTC")
  .onRun(async (context) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const snapshot = await db
        .collection("contact_submissions_log")
        .where("timestamp", "<", admin.firestore.Timestamp.fromDate(sevenDaysAgo))
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
      console.log(`Cleaned up ${snapshot.size} old rate limit logs`);

      return { success: true, deleted: snapshot.size };
    } catch (error) {
      console.error("Error cleaning up rate limit logs:", error);
      throw error;
    }
  });

console.log("All Cloud Functions loaded successfully");
