
-- Table: shop_owners
CREATE TABLE public.shop_owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: debts
CREATE TABLE public.debts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shop_owners(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT,
  amount NUMERIC NOT NULL,
  remaining_amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shop_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Shop owners: allow anon to read for login verification
CREATE POLICY "Anyone can read shop_owners for login" ON public.shop_owners
  FOR SELECT USING (true);

-- Debts: allow anon full access (auth is handled via app-level shop_id filtering)
CREATE POLICY "Anyone can read debts" ON public.debts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert debts" ON public.debts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update debts" ON public.debts
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete debts" ON public.debts
  FOR DELETE USING (true);

-- Insert a sample shop owner (PIN: 1234)
INSERT INTO public.shop_owners (name, phone, pin) VALUES ('Cabdi Maxamed', '0612345678', '1234');

-- Insert sample debts
INSERT INTO public.debts (shop_id, customer_name, phone, amount, remaining_amount, date, time, status)
SELECT id, 'Faadumo Cali', '0615551234', 250.00, 250.00, CURRENT_DATE, '10:30:00', 'unpaid' FROM public.shop_owners WHERE phone = '0612345678';

INSERT INTO public.debts (shop_id, customer_name, phone, amount, remaining_amount, date, time, status)
SELECT id, 'Faadumo Cali', '0615551234', 100.00, 0.00, CURRENT_DATE - INTERVAL '3 days', '14:00:00', 'paid' FROM public.shop_owners WHERE phone = '0612345678';

INSERT INTO public.debts (shop_id, customer_name, phone, amount, remaining_amount, date, time, status)
SELECT id, 'Maxamed Xasan', '0617778899', 500.00, 500.00, CURRENT_DATE - INTERVAL '5 days', '09:00:00', 'unpaid' FROM public.shop_owners WHERE phone = '0612345678';

INSERT INTO public.debts (shop_id, customer_name, phone, amount, remaining_amount, date, time, status)
SELECT id, 'Halimo Nuur', '0619990011', 75.00, 0.00, CURRENT_DATE - INTERVAL '1 day', '16:45:00', 'paid' FROM public.shop_owners WHERE phone = '0612345678';

INSERT INTO public.debts (shop_id, customer_name, phone, amount, remaining_amount, date, time, status)
SELECT id, 'Cabdirashiid Yusuf', '0613334455', 320.00, 320.00, CURRENT_DATE + INTERVAL '2 days', '11:15:00', 'unpaid' FROM public.shop_owners WHERE phone = '0612345678';
