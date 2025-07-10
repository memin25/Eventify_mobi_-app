
DROP POLICY IF EXISTS "Users can create events" ON events;

CREATE POLICY "Anyone can create events" ON events
  FOR INSERT WITH CHECK (true);

