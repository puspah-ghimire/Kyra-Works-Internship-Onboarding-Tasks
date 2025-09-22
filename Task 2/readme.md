# Simple Fallback Permission System

A basic Node.js server that demonstrates a permission system with fallback mechanism.

## What it does

This server checks if users can access resources using two systems:
1. **Primary system** - Only admins get access (fails 30% of the time)
2. **Fallback system** - Both editors and admins get access (always works)

When the primary system is down, it automatically switches to the fallback system so users don't get completely blocked.

## How to run

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   node server.js
   ```

3. Test it with a POST request to `http://localhost:3000/access-resource`

## Example request

```json
{
  "userId": "john",
  "user": {
    "role": "editor"
  },
  "resourceId": "document123"
}
```