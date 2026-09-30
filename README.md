# LaptopHub PH — Simple GitHub Repository

This is a **plain HTML/CSS/JavaScript** starter website. It does NOT require React, Vite, Node.js, Supabase, or GitHub Actions.

## How to start on GitHub

1. Create a new GitHub repository, for example `laptophub-booking`.
2. Keep the repository empty when creating it (do not add README).
3. Upload these files and folders:
   - `index.html`
   - `style.css`
   - `script.js`
   - `assets/`
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch `main` and folder `/ (root)`.
7. Save and wait for GitHub Pages to publish.

## What this starter does

- 10 laptops
- Hourly rentals from 8:00 AM–5:00 PM
- Customer chooses start time and number of hours
- Overnight option from 5:00 PM–8:00 AM
- Overnight reminder: 18+ and valid ID
- Cash or GCash option
- Shows READY / RESERVED laptops
- Saves test reservations in the browser using localStorage
- Includes the supplied LaptopHub promotional images

## Important before real business use

This version is a **front-end demo**. Reservations are saved only in the browser where the booking was made. It is not yet a shared online database.

For the real system, the next version should add:
- Supabase/Firebase database
- Shared live availability for all customers
- Admin login/dashboard
- GCash payment/reference number
- Booking confirmation
- Customer records
- Double-booking protection on the server
- ID verification workflow for overnight rentals
