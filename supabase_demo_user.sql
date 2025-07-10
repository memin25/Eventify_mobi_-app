
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'testuser123@gmail.com',
  '$2a$10$dummy.encrypted.password.hash.for.demo.user.only',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"firstName": "Test", "lastName": "User"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

