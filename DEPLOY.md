# 🚀 Deploy Mayel Shift Tracker to Vercel

## Step 1: Setup Supabase Database

1. **Go to https://supabase.com** and create a free account
2. **Create new project** (choose a region close to you)
3. **Wait for setup to complete** (2-3 minutes)
4. **Go to SQL Editor** and run this code:

```sql
-- Create Staff Table
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Shifts Table  
CREATE TABLE shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  shift_type VARCHAR(10) CHECK (shift_type IN ('morning', 'evening')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Sample Staff (your 9 team members)
INSERT INTO staff (name, phone, position) VALUES
('Ahmed Hassan', '+961 70 123 456', 'Waiter'),
('Fatima Ali', '+961 71 234 567', 'Chef'),
('Omar Khaled', '+961 76 345 678', 'Kitchen Staff'),
('Layla Mahmoud', '+961 70 456 789', 'Waitress'),
('Youssef Nasser', '+961 71 567 890', 'Bartender'),
('Zeinab Salim', '+961 76 678 901', 'Host'),
('Khalil Fares', '+961 70 789 012', 'Cleaner'),
('Mona Saad', '+961 71 890 123', 'Cashier'),
('Rami Taha', '+961 76 901 234', 'Manager');

-- Set Permissions
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on staff" ON staff FOR ALL USING (true);
CREATE POLICY "Allow all on shifts" ON shifts FOR ALL USING (true);
```

5. **Get your credentials:**
   - Go to **Project Settings** → **API**
   - Copy **Project URL** and **anon public** key

## Step 2: Deploy to Vercel

1. **Go to https://vercel.com** and create account
2. **Click "New Project"**
3. **Upload this folder** (drag and drop the mayel-shift-tracker folder)
4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
   - Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
5. **Click "Deploy"**

## Step 3: Your Links

After deployment, you'll get:
- **Main Site:** `https://your-site-name.vercel.app`
- **📱 Mobile Admin:** `https://your-site-name.vercel.app/mobile`
- **🔔 Notifications:** `https://your-site-name.vercel.app/notifications` 
- **📱 QR Generator:** `https://your-site-name.vercel.app/qr-generator`

## Step 4: Test Everything

1. **Generate QR Codes:** Go to `/qr-generator` and print them
2. **Test Staff:** Go to `/staff` and add/edit your real team
3. **Test Scanning:** Scan QR with phone camera
4. **Mobile Dashboard:** Bookmark `/mobile` on your phone
5. **Enable Notifications:** Go to `/notifications` and enable alerts

---

## 📱 Your Mobile Admin URL:
`https://your-site-name.vercel.app/mobile`

**Bookmark this on your phone for instant access!**