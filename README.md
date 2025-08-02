![alt text](https://img.shields.io/badge/Angular-18.x-DD0031?logo=angular)
![alt text](https://img.shields.io/badge/Django-5.x-092E20?logo=django) ![alt text](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python) ![alt text](https://img.shields.io/badge/License-MIT-yellow.svg) ![alt text](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

![Rhythmics](README%20files/README.png)
# Rhythmics: Discover Your Music Like Never Before.

Welcome to the Rhythmics project! This is a full-stack web application designed to give you deep insights into your Spotify listening habits. Built from the ground up with a powerful Angular frontend and a robust Django (Python) backend, Rhythmics connects directly to your Spotify account to visualize the music that defines you.

(GIF COMING SOON)
# ✨ Features

Rhythmics provides a rich, interactive, and personalized dashboard with a suite of analytical tools:

📊 **Dynamic Top Charts**: View your top tracks and artists, with interactive filters for different time ranges:

- Last Month (short_term)
- Last 6 Months (medium_term)
- All Time (long_term)

📈 **Genre Analysis**: Discover your most listened-to genres with a beautiful, interactive doughnut chart. Get custom, data-driven "Music Insights" that describe your unique taste profile.

🎧 **Recently Played History**: See a list of your last 50 listened tracks, complete with timestamps. 

🚀 **High-Performance Caching**: The frontend features a sophisticated caching system that provides a lightning-fast experience on subsequent visits, reducing load times and API calls.

🔐 **Privacy & Data Control**: A dedicated privacy settings panel allows you to control what data is displayed and stored. Includes a secure Logout and a Delete My Data function that completely removes your user and token information from our database.

🔒 **Secure Authentication**: Full, secure OAuth 2.0 authentication flow with Spotify, including automatic token refresh logic on the backend to ensure you stay logged in.

📱 **Responsive Design**: A sleek, modern interface that looks great on both desktop and mobile devices.

# 🚀 Live Demo & Deployment

A live version of Rhythmics is available for you to try!
https://rhythmics.netlify.app/home

Live version details:
    
- Frontend(Angular): Deployed on Netlify.com

- Backend (Django): Deployed on Render.com

Feel free to connect your Spotify account and explore your stats.
# ⚠️ Live Demo Access & User Slots
**IMPORTANT**

Due to recent changes in the Spotify API Developer Policy (as of May 2025), new applications created by individual developers(thanks Spotify) are restricted to a limited number of users in "Development Mode". This application currently has a hard limit of 25 authorized users.

What this means:
- Public access is limited. When you click "Connect with Spotify", the login will only succeed if your Spotify account has been manually added to the app's allowlist. Otherwise, you will likely see a 403 Forbidden or Failed to retrieve user info error after logging into Spotify.
- Want to **test it**? If you are a recruiter, a potential employer, or just a developer who is genuinely interested in testing the full functionality of Rhythmics, please open a new [GitHub Issue](https://github.com/Pabblusansky/rhythmics/issues/new?title=Live%20Demo%20Access%20Request) requesting access. I will gladly add you to one of the available user slots.
# ⚠️Deployment Status & Known Limitations

    Server Spin-Down (Cold Start): The backend is hosted on Render's free tier. If the server is inactive for 15 minutes, it will "spin down". The first request to an inactive server (e.g., login or fetching data) may experience a delay of 30-50 seconds while the instance wakes up. Subsequent requests will be fast. This is a characteristic of the free hosting plan.

# 🛠️ Tech Stack

Frontend:

    Angular (v18+) & TypeScript

    SCSS for styling

    Angular Material for UI components

    Chart.js with ng2-charts for data visualization

    RxJS for reactive state management

Backend:

    Django & Python

    Django REST Framework for building the API

    SQLite for local development (PostgreSQL recommended for production)

Development Tools:

    npm & pip

    concurrently for unified server startup

    VS Code

    Git

# 🏃‍♂️ Getting Started

Ready to run Rhythmics on your local machine? Here’s how to get set up.
Prerequisites

    Node.js: v18.x or higher

    npm: v8 or higher (comes with Node.js)

    Python: v3.8 or higher

    Git

1. Clone the Repository

First, clone the project to your local machine.

 ```bash  
git clone https://github.com/Pabblusansky/rhythmics.git
cd rhythmics
 ```
    
# ✨ Spotify Developer Setup (Required for Local Development)

To run Rhythmics locally, you must register your own application in the Spotify Developer Dashboard. This is required to get the API keys that allow the application to connect to Spotify.

    Go to the Dashboard:

        Navigate to the Spotify Developer Dashboard and log in with your Spotify account.

    Create a New App:

        Click the "Create app" button.

        Give it a name (e.g., "Rhythmics Local") and a description.

        Agree to the terms.

    Get Your Credentials:

        Once your app is created, you will see your Client ID.

        Click on "Settings" to view your Client Secret.

        You will need these two keys for the .env file in the next step.

    Configure the Redirect URI (CRITICAL STEP):

        In your app's "Settings", find the "Redirect URIs" section.

        Add the following URI exactly as written:
```bash
http://127.0.0.1:8000/api/auth/spotify/callback
```
        Click "Add" and then "Save" at the bottom of the page. This URI must match the one in the backend code to handle the login callback correctly.

Now you have everything you need to set up your local environment.

2. Setup Environment Variables (Backend)

The backend requires a .env file in the root directory for secret keys.

    Create a new file named .env in the root of the rhythmics/ folder.

    Open .env and add the following. You can get your Spotify keys from the Spotify Developer Dashboard:
```bash  
# A long, random string for Django's security
SECRET_KEY=your_very_long_and_super_secret_text_here

# Your credentials from the Spotify Developer Dashboard
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
# Very important to set the DEBUG flag for local development
DEBUG=True
```

3. Install All Dependencies

This project is a monorepo. You'll need to install dependencies for both the Node.js environment and the Python environment.

A) Install Node.js Dependencies:
From the root directory (rhythmics/), run the install-all script. This will install dependencies for the root and for the Angular client.

```bash  
npm run install-all
```

    

B) Install Python Dependencies:
Navigate into the backend directory, create a virtual environment, activate it, and install the required packages.


```bash       
cd backend
python -m venv .venv
 ```

```bash  
Activate the environment:

    On Windows (CMD): .\.venv\Scripts\activate.bat

    On Windows (PowerShell): .\.venv\Scripts\activate.ps1

    On macOS/Linux: source .venv/bin/activate
```

Install packages:


```bash  
pip install -r requirements.txt
```
Return to the root directory:
```bash
cd ..
```
    
4. Run Everything!

That's it! Run the dev script! This will start both the Django backend and the Angular frontend simultaneously.

```bash    
# Make sure you are in the root rhythmics/ directory
npm run dev
```

- The backend server will start on http://127.0.0.1:8000
- The frontend application will be available at http://127.0.0.1:4200

Open your browser and navigate to http://127.0.0.1:4200 to start using Rhythmics!
# 📜 License

This project is licensed under the MIT License - see the LICENSE.md file for details.