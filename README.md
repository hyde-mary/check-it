# **Check It - AI Powered Food Delivery Mobile Application**

## Prerequisites
- Android Studio (Virtual Device Manager)
- Expo
- Node.js
- Supabase Account

## Setup

### 1. Clone the Repository
```sh
git clone http://hyde-mary/check-it
cd check-it
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Supabase
1. Create a Supabase account at [supabase.com](https://supabase.com/).
2. Go to the dashboard and create a new project.
3. Name your project and **store your database password**.
4. Click **Connect** on the top navbar.
5. Select **ORMs** and copy the connection details.

### 4. Configure Environment Variables
1. Create a `.env` file in the root directory:

```sh
touch .env
```

2. Open `.env` and paste the following:

```sh
# Supabase Database URLs
DATABASE_URL=
DIRECT_URL=

# Authentication Secret
JWT_SECRET=

# Google Gemini API Key
GEMINI_API_KEY=
```

- **Paste the copied ORM configuration** into `DATABASE_URL` and `DIRECT_URL`.
- Replace `[YOUR_PASSWORD]` in the connection strings with your **actual database password**.
- Generate a JWT secret:

```sh
openssl rand -base64 16
```

- Copy the generated key and set it as `JWT_SECRET`.
- Get a **Gemini API Key** from [aistudio.google.com](https://aistudio.google.com/) and set it as `GEMINI_API_KEY`.

### 5. Run Database Migrations
```sh
npx prisma migrate dev
```

### 6. Seed the Database
```sh
npm run seed
```

### 7. Generate Prisma Client
```sh
npx prisma generate
```

### 8. Start the Application
Open **two terminals**:

- **Terminal 1:** Start Expo
  ```sh
  npx expo start
  ```

- **Terminal 2:** Start the backend server
  ```sh
  npm run dev
  ```
