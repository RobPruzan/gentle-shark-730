# PlanetScale Prediction Market Chat Setup

## Step 1: Create PlanetScale Database

1. Visit https://planetscale.com and sign in (or create an account)
2. Click "Create a new database"
3. Name it something like `prediction-chat`
4. Select a region close to you
5. Click "Create database"

## Step 2: Get Connection String

1. In your database dashboard, click on the "main" branch
2. Click "Connect" button
3. Click "Create password" (give it a name like "app-password")
4. Copy the connection string that looks like:
   ```
   mysql://xxxxxxxx:pscale_pw_xxxxxxxx@xxxxxx.us-east-2.psdb.cloud/prediction-chat?sslaccept=strict
   ```

## Step 3: Configure Environment Variable

1. Open the `.env.local` file in your project
2. Replace the `DATABASE_URL` value with your connection string:
   ```
   DATABASE_URL=mysql://xxxxxxxx:pscale_pw_xxxxxxxx@xxxxxx.us-east-2.psdb.cloud/prediction-chat?sslaccept=strict
   ```

## Step 4: Start the Application

```bash
pnpm dev
```

Visit http://localhost:3002

## Features

### Chat Room
- Real-time chat with other users
- Messages update every 2 seconds via polling
- Simple and clean interface

### Prediction Market
- Users can create predictions with an initial confidence percentage
- Other users can vote up or down on predictions
- Confidence scores adjust based on voting
- Real-time updates as votes come in

### Analytics Dashboard
- Live charts showing confidence levels
- Voting activity visualization
- Recent predictions list
- Updates every 2 seconds

## How It Works

1. **Database**: PlanetScale MySQL database stores messages, predictions, and votes
2. **React Query**: Polls the API every 2 seconds for real-time updates
3. **API Routes**: Next.js API routes handle data fetching and mutations
4. **Charts**: Recharts library visualizes prediction data

## Database Schema

- **messages**: id, username, content, created_at
- **predictions**: id, username, question, prediction_value, created_at, resolved
- **votes**: id, prediction_id, username, vote_type, created_at

Enjoy your prediction market chat room! 🚀
