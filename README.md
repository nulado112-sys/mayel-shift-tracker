# Mayel Shift Tracker

A professional shift tracking system for Mayel Restaurant with QR code scanning functionality.

## Features

🎯 **Core Features:**
- 9 staff members with different positions
- 2 shift types (Morning & Evening)  
- QR code generation for each shift
- Simple green "START SHIFT" and red "END SHIFT" buttons
- Real-time shift tracking and notifications
- Admin dashboard with live updates

📱 **QR Code System:**
- Generate QR codes for morning and evening shifts
- Print-ready QR codes with clear instructions
- Staff scan QR code → Select name → Choose action
- Works with any smartphone camera

⏰ **Shift Management:**
- Track exact start and end times
- View active staff in real-time
- Calculate total hours worked
- Historical shift data

🔔 **Notifications:**
- Real-time browser notifications
- See who's currently working
- Shift start/end alerts
- Admin dashboard updates live

## Quick Setup

1. **Clone and Install:**
```bash
cd /Users/habib/mayel-shift-tracker
npm install
```

2. **Setup Database:**
   - Create a Supabase account at https://supabase.com
   - Create a new project
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and key to `.env.local`
   - Run the SQL commands from `setup.sql` in Supabase SQL editor

3. **Start the App:**
```bash
npm run dev
```

4. **Setup QR Codes:**
   - Go to http://localhost:3000/qr-generator
   - Print both morning and evening QR codes
   - Laminate and place at restaurant entrance

## How It Works

### For Staff:
1. Scan the QR code with phone camera
2. Select your name from the dropdown
3. Press **GREEN button** to start shift
4. Press **RED button** to end shift

### For Management:
1. **Admin Dashboard** - View all shifts and active staff
2. **Staff Management** - Add/remove staff members  
3. **QR Generator** - Create printable QR codes
4. **Notifications** - Get real-time updates

## Project Structure

```
mayel-shift-tracker/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── scan/[qrId]/    # QR code scanning page
│   ├── qr-generator/   # Generate QR codes
│   ├── staff/          # Staff management
│   ├── notifications/  # Real-time notifications
│   └── page.tsx        # Home page
├── lib/
│   └── supabase.ts     # Database connection
├── setup.sql           # Database setup
└── README.md
```

## Database Schema

### Staff Table
- `id` - Unique identifier
- `name` - Staff member name
- `phone` - Contact number
- `position` - Job role
- `created_at` - Registration date

### Shifts Table
- `id` - Unique identifier
- `staff_id` - Reference to staff member
- `shift_type` - 'morning' or 'evening'
- `start_time` - When shift started
- `end_time` - When shift ended
- `date` - Shift date
- `created_at` - Record creation time

## Customization

### Adding More Staff:
1. Go to `/staff` page
2. Click "Add New Staff"
3. Fill in details and save

### Adding New Positions:
Edit the `positions` array in `app/staff/page.tsx`

### Changing Shift Times:
Modify shift types in `lib/supabase.ts` Database type definitions

## Production Deployment

1. **Deploy to Vercel:**
   - Connect GitHub repository
   - Add environment variables
   - Deploy

2. **Mobile Access:**
   - QR codes work with any smartphone
   - Responsive design for all devices
   - PWA-ready for home screen installation

## Support

For issues or questions:
1. Check the admin dashboard for shift status
2. Verify QR codes are working by scanning
3. Ensure staff names are in the system
4. Check browser notification permissions

---

**Built for Mayel Restaurant** 🍽️  
Professional shift tracking made simple.