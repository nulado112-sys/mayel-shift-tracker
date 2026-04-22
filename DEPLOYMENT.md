# Deploy Mayel Shift Tracker

## Quick Deployment Steps

### 1. Database Setup (Supabase)
1. Go to https://supabase.com and create free account
2. Create new project
3. Go to SQL Editor and run this code:

```sql
-- Create tables for Mayel Shift Tracker

-- Staff table
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shifts table
CREATE TABLE shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  shift_type VARCHAR(10) CHECK (shift_type IN ('morning', 'evening')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_shifts_staff_id ON shifts(staff_id);
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shifts_staff_date ON shifts(staff_id, date);

-- Sample staff data for testing
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

-- Enable Row Level Security (RLS)
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Allow all on staff" ON staff FOR ALL USING (true);
CREATE POLICY "Allow all on shifts" ON shifts FOR ALL USING (true);
```

4. Go to Project Settings → API
5. Copy your Project URL and anon public key

### 2. Deploy to Vercel
1. Go to https://vercel.com and sign up
2. Click "New Project"
3. Import from Git (connect GitHub if needed)
4. Upload this folder or connect GitHub repo
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
6. Click Deploy

### 3. Alternative: Deploy to Netlify
1. Go to https://netlify.com
2. Drag and drop this folder to deploy
3. Go to Site Settings → Environment Variables
4. Add the same Supabase variables
5. Redeploy

## Your Links After Deployment

Once deployed, you'll get:
- **Main Site:** `https://your-site.vercel.app`
- **Mobile Admin:** `https://your-site.vercel.app/mobile`
- **QR Generator:** `https://your-site.vercel.app/qr-generator`

## Test the System

1. Go to `/qr-generator` and print QR codes
2. Scan QR code with phone camera
3. Select staff name and test start/end shift
4. Check mobile dashboard for live updates
5. Enable notifications for real-time alerts

---

🎯 **Your mobile admin will be at:** `https://your-site-name.vercel.app/mobile`