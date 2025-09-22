// Task: Implement Retention Logic Problem: A system to automatically delete data based on the policy.

const crypto = require('crypto');
const cron = require('node-cron');

// Dummy database
let database = [
    { id: 1, type: 'logs', data: 'User login', createdAt: new Date('2025-09-01') },
    { id: 2, type: 'temp', data: 'Upload file', createdAt: new Date('2025-09-19') },
    { id: 3, type: 'analytics', data: 'Page view', createdAt: new Date('2025-01-01') },
    { id: 4, type: 'logs', data: 'User logout', createdAt: new Date('2024-09-18') }
];

// Retention policies (days)
const RETENTION_POLICY = {
    logs: 90,
    temp: 1,
    analytics: 365,
    default: 30
};

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'my-secret-key';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://api.example.com/retention-webhook';

const auditLog = [];

// Function to apply retention policy
function applyRetentionPolicy() {
    console.log('Applying retention policy in the database');

    const now = new Date();
    const deleted = [];

    // data filtering based on retention policy
    database = database.filter(item => {
        const retentionDays = RETENTION_POLICY[item.type] ?? 30;

        const ageInMs = now - new Date(item.createdAt);
        const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24))

        if (ageInDays > retentionDays) {
            deleted.push({ ...item, ageInDays });
            return false; // Remove the item from database
        }
        return true; // keep in database
    });

    // Logging audit trail
    const auditEntry = {
        timestamp: now.toISOString(),
        action: 'retention_cleanup',
        deleted: deleted.length,
        retained: database.length
    };
    auditLog.push(auditEntry);

    console.log(`${deleted.length} deleted, ${database.length} retained`);

    // Send webhook if data is deleted
    if (deleted.length > 0) {
        sendWebhook(deleted, auditEntry)
    }

    return { deleted, retained: database.length, audit: auditEntry };
}

// We use async function with real requests using fetch or axios but here I am just simulating the webhook sending process as HTTP request
function sendWebhook(deletedData) {

    const payload = {
        event: 'data_retention_completed',
        timestamp: new Date().toISOString(),
        summary: {
            deleted_count:deletedData.length,
            retained_count: database.length
        },
        deleted_items: deletedData.map(item => ({ id: item.id, type: item.type, age_days:item.ageInDays}))
    };

    // generating HMAC signature 
    const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');

    // webhook HTTP request
    const webhookRequest = {
        url: WEBHOOK_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': `sha256=${signature}`,
            'X-Event-Type': 'data_retention_completed'
        },

        body: JSON.stringify(payload)
    };

    console.log('Webhook sent with signature:', `sha256=${signature}`);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    return webhookRequest;
}

// Verifying webhook signature for receiving webhooks
function verifyWebhookSignature(payload, receivedSignature) {
    const expectedSignature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');
    return `sha256=${expectedSignature}` === receivedSignature;
}

// scheduling
function startRetentionScheduler() {
    console.log('Starting cron-based retention scheduler (runs every minute for demo)');
    
    // Cron: Every minute
    cron.schedule('* * * * *', () => {
        console.log('[Cron] Running retention check at', new Date().toISOString());
        applyRetentionPolicy();
    });
}

function runDemo() {
    console.log('Starting data retention demo\n');

    console.log('Initial database');
    console.table(database);

    console.log('\n Retention policy');
    console.table(RETENTION_POLICY);

    //  run retention once
    const result = applyRetentionPolicy();


    console.log('\nFinal database state');
    console.table(database);

    console.log('\nLog:');
    console.table(auditLog);

    //  for webhook signature verification demo
    console.log('\nWebhook security:');
    const testPayload = { test: 'data' };
    const testSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(testPayload)).digest('hex');
    const isValid = verifyWebhookSignature(testPayload, `sha256=${testSig}`);
    console.log('Signature:', isValid ? 'Valid' : 'Invalid');
}

if (require.main === module) {
    // We run demo for testing our logic one time. It simulates the retention process.
    runDemo();

    // By calling startRetentionScheduler() we can run the retention policy every 60 seconds.
    // startRetentionScheduler(); 
}