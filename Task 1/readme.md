# Data Retention System

It's a simple system that automatically cleans up old data and sends notifications when it does.

## What it does

The system looks at data in our database and deletes stuff that's too old based on rules I set up. Different types of data have different lifespans:

- **Logs**: Keep for 90 days (3 months)
- **Temp files**: Delete after 1 day  
- **Analytics**: Keep for 365 days (1 year)
- **Everything else**: Keep for 30 days

When it deletes something, it sends a secure webhook notification to let other systems know what happened.

## Setup

First, install the dependencies:
```bash
npm install
```

## How to use it

After installation, run the demo:
```bash
npm start
```

This will show you:
- What data we started with
- What got deleted based on the rules
- What's left after cleanup
- The webhook that gets sent

## Running it continuously

If you want it to run automatically every minute (for testing), uncomment this line in the code:
```javascript
// startRetentionScheduler(); 
```

Then it will keep checking and cleaning up data every 60 seconds.
