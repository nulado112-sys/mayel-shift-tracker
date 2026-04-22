-- Run this in Supabase SQL Editor after deployment

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

-- Create indexes for performance
CREATE INDEX idx_shifts_staff_id ON shifts(staff_id);
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shifts_staff_date ON shifts(staff_id, date);

-- Add your 9 staff members
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

-- Enable Row Level Security and set policies
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Allow all operations (you can restrict these later if needed)
CREATE POLICY "Allow all on staff" ON staff FOR ALL USING (true);
CREATE POLICY "Allow all on shifts" ON shifts FOR ALL USING (true);