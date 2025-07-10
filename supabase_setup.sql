CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi etkinliklerini güncelleyebilir
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi etkinliklerini silebilir
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- Updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE
    ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO events (title, description, date, time, location, category, max_participants, price, user_id) VALUES
('React Native Workshop', 'React Native ile mobil uygulama geliştirme workshop''u', '2025-01-15', '14:00', 'İstanbul Teknik Üniversitesi', 'workshop', 50, 0, (SELECT id FROM auth.users LIMIT 1)),
('Teknoloji Konferansı', 'Yapay zeka ve gelecek teknolojileri üzerine konferans', '2025-01-20', '10:00', 'Boğaziçi Üniversitesi', 'conference', 200, 45, (SELECT id FROM auth.users LIMIT 1)),
('Startup Networking', 'Girişimciler için networking etkinliği', '2025-01-25', '18:00', 'Maslak İş Merkezi', 'business', 100, 50, (SELECT id FROM auth.users LIMIT 1)),
('Yoga Dersi', 'Açık havada yoga ve meditasyon', '2025-01-18', '08:00', 'Emirgan Korusu', 'sports', 30, 25, (SELECT id FROM auth.users LIMIT 1)),
('Sanat Sergisi Açılışı', 'Genç sanatçılar karma sergisi açılışı', '2025-01-22', '19:00', 'Pera Müzesi', 'art', 80, 0, (SELECT id FROM auth.users LIMIT 1));
