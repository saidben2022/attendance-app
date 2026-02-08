# AttendEase - Test Credentials

All accounts use **password** as the password.

## Staff Accounts

| Role        | Email                        | Password | PIN  |
| ----------- | ---------------------------- | -------- | ---- |
| Admin       | admin@attendance.local       | password | 1234 |
| Coordinator | coordinator@attendance.local | password | 5678 |
| Verifier    | verifier@attendance.local    | password | 9012 |
| Instructor  | instructor@attendance.local  | password | 3456 |

## Student Accounts

| Name           | Email                | Password | PIN  |
| -------------- | -------------------- | -------- | ---- |
| Alice Martin   | alice@example.com    | password | 1000 |
| Bob Johnson    | bob@example.com      | password | 1001 |
| Claire Dubois  | claire@example.com   | password | 1002 |
| David Chen     | david@example.com    | password | 1003 |
| Emma Wilson    | emma@example.com     | password | 1004 |
| François Petit | francois@example.com | password | 1005 |
| Grace Lee      | grace@example.com    | password | 1006 |
| Henri Moreau   | henri@example.com    | password | 1007 |

---

# How to Test QR Code Check-in

## Step 1: Login as Verifier (or Admin)

1. Go to http://localhost:8001/login
2. Login with: `verifier@attendance.local` / `password`

## Step 2: Open a Session Slot

1. Click **Sessions** in the navigation
2. Find today's session (Spring 2026 or February Intensive)
3. Click **View Panel** on an AM or PM slot
4. Click **Open Slot** button

## Step 3: Display the QR Code

1. In the slot panel, click **Fullscreen QR** button
2. The QR code will display (you would project this in a classroom)
3. Keep this tab open

## Step 4: Login as Student (in another browser/incognito)

1. Open an incognito window or different browser
2. Go to http://localhost:8001/login
3. Login with: `alice@example.com` / `password`

## Step 5: Scan the QR Code

**Option A - Use your phone:**

1. Open camera app on your phone
2. Point at the QR code on your screen
3. Tap the link that appears
4. Login on mobile if needed
5. Enter PIN: `1000`

**Option B - Copy the URL manually:**

1. In the Verifier tab, right-click the QR code → "Copy image"
2. Use a QR code reader website to decode it
3. Copy the URL and paste it in the Student browser tab
4. Enter PIN: `1000`

## Step 6: Verify Success

- Student sees green "Present" or orange "Late" confirmation
- Verifier sees the check-in appear in the slot panel attendance list

---

# Commands Reference

```powershell
# Start the server (use XAMPP PHP)
D:\xampp\php\php.exe artisan serve

# Start Vite dev server
npm run dev

# Re-seed test data
D:\xampp\php\php.exe artisan migrate:fresh --seed --seeder=TestDataSeeder
```
