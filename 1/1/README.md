Co Chocolat eCommerce – Environment Configuration

This project is built using Next.js 15 and React 19, tailored for an eCommerce platform.

UPLOAD TO GITHUB

Initialize a Git repository (if not already):
git init

Add your files and commit:
git add .
git commit -m "Initial commit"

Create a repository on GitHub: https://github.com/new

Add the GitHub remote:
git remote add origin https://github.com/your-username/your-repo-name.git

Push your code:
git push -u origin main


create .env file and Paste the following environment variables:
check .env.example file to get fill details
ENVIRONMENT VARIABLES

Application:
NEXT_PUBLIC_BASE_URL="http://localhost:3000
"

NEXT_PUBLIC_LOCATION_LABEL="KADI Building, Yathreb Street, Dabouq"
NEXT_PUBLIC_LOCATION_LINK="https://www.google.com/maps/place/Co+Chocolat+Jordan/@32.0082705,35.8326355,17z/data=!3m1!4b1!4m6!3m5!1s0x151ca1721b391b2d:0xba1266d1e6c270f6!8m2!3d32.0082705!4d35.8326355!16s%2Fg%2F11xrfcx75y?entry=ttu&g_ep=EgoyMDI1MDgxMS4wIKXMDSoASAFQAw==
"
NEXT_PUBLIC_PHONE_NUMBER="+962 7 9330 8808"
NEXT_PUBLIC_EMAIL="info@cochocolatjo.com
"
NEXT_PUBLIC_OPENING_HOURS="Sat-Thu: 10 AM - 10 PM | Friday: 2 PM - 10 PM"


NEXT_PUBLIC_FACEBOOK_URL="https://web.facebook.com/cochocolat.jordan
"
NEXT_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/cochocolat.jo
"

DATABASE_URL="postgresql://postgres:example@localhost:5432/co-chocolat-db"

BETTER_AUTH_SECRET="your_better_auth_secret_here"
BETTER_AUTH_URL="http://localhost:3000
"
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
FACEBOOK_CLIENT_ID="your_facebook_client_id_here"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret_here"
INSTAGRAM_CLIENT_ID="your_instagram_client_id"
INSTAGRAM_CLIENT_SECRET="your_instagram_client_secret"
ADMIN_EMAIL="your_admin_email_here"

UPLOADTHING_TOKEN="your_uploadthing_token_here"
UPLOADTHING_SECRET_KEY="your_uploadthing_secret_key_here"
NEXT_PUBLIC_UPLOADTHING_APP_ID="your_uploadthing_app_id_here"

RESEND_API_KEY="your_resend_api_key_here"

CRON_SECRET="your_cron_secret_here"

RUNNING THE PROJECT LOCALLY

Install dependencies:
npm install

Start the development server:
npm run dev

Open your browser at: http://localhost:3000

DEPLOYING TO VERCEL

Push your project to GitHub if you haven't already.

Go to https://vercel.com
and log in.

Click “New Project” and import your GitHub repository.

Set the framework preset to Next.js (Vercel auto-detects this).

Add all environment variables from .env.local using Vercel’s dashboard. Do not commit the .env.local file.

Click “Deploy”. Your site will be live at a URL like: https://your-project-name.vercel.app

CUSTOM DOMAIN (OPTIONAL)

You can add a custom domain in the Vercel project settings under the "Domains" tab.

FINAL NOTES

Never commit .env.local to your repository.

Use strong secrets in production.

Replace all placeholder values like "your_google_client_id_here" with real credentials.

Use Vercel’s environment settings or a .env.production file for production deployments.

CONTACT

Email: info@cochocolatjo.com

Phone: +962 7 9330 8808
Address: KADI Building, Yathreb Street, Dabouq
Instagram: https://www.instagram.com/cochocolat.jo

Facebook: https://web.facebook.com/cochocolat.jordan
