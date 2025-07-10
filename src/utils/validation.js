import * as yup from 'yup';

// Giriş formu validasyon şeması
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi gereklidir'),
  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

// Kayıt formu validasyon şeması
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .required('Ad gereklidir'),
  lastName: yup
    .string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .required('Soyad gereklidir'),
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi gereklidir'),
  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı gereklidir'),
});

// Etkinlik oluşturma validasyon şeması
export const eventSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(100, 'Başlık en fazla 100 karakter olabilir')
    .required('Başlık gereklidir'),
  description: yup
    .string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir')
    .required('Açıklama gereklidir'),
  date: yup
    .date()
    .min(new Date(), 'Etkinlik tarihi gelecekte olmalıdır')
    .required('Tarih gereklidir'),
  time: yup
    .string()
    .required('Saat gereklidir'),
  location: yup
    .string()
    .min(3, 'Konum en az 3 karakter olmalıdır')
    .max(200, 'Konum en fazla 200 karakter olabilir')
    .required('Konum gereklidir'),
  category: yup
    .string()
    .required('Kategori seçimi gereklidir'),
  maxParticipants: yup
    .number()
    .min(1, 'En az 1 katılımcı olmalıdır')
    .max(1000, 'En fazla 1000 katılımcı olabilir')
    .integer('Katılımcı sayısı tam sayı olmalıdır')
    .required('Maksimum katılımcı sayısı gereklidir'),
  price: yup
    .number()
    .min(0, 'Fiyat negatif olamaz')
    .nullable(),
});

// Profil güncelleme validasyon şeması
export const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .required('Ad gereklidir'),
  lastName: yup
    .string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .required('Soyad gereklidir'),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, 'Geçerli bir telefon numarası giriniz')
    .nullable(),
  bio: yup
    .string()
    .max(500, 'Biyografi en fazla 500 karakter olabilir')
    .nullable(),
});

// Şifre değiştirme validasyon şeması
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Mevcut şifre gereklidir'),
  newPassword: yup
    .string()
    .min(6, 'Yeni şifre en az 6 karakter olmalıdır')
    .required('Yeni şifre gereklidir'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Şifreler eşleşmiyor')
    .required('Yeni şifre tekrarı gereklidir'),
});

// Etkinlik kategorileri
export const eventCategories = [
  { label: 'Konser', value: 'concert' },
  { label: 'Konferans', value: 'conference' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Spor', value: 'sports' },
  { label: 'Sanat', value: 'art' },
  { label: 'Teknoloji', value: 'technology' },
  { label: 'Eğitim', value: 'education' },
  { label: 'Sosyal', value: 'social' },
  { label: 'İş', value: 'business' },
  { label: 'Diğer', value: 'other' },
];

// Tarih formatı yardımcı fonksiyonları
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  if (!time) return '';
  
  return time.slice(0, 5); // HH:MM formatında döndür
};

export const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  
  const dateStr = formatDate(date);
  const timeStr = formatTime(time);
  
  return `${dateStr} - ${timeStr}`;
};

// Form hata mesajlarını göstermek için yardımcı fonksiyon
export const getErrorMessage = (errors, fieldName) => {
  return errors[fieldName]?.message || '';
};

// Form alanının hata durumunu kontrol etmek için yardımcı fonksiyon
export const hasError = (errors, fieldName) => {
  return !!errors[fieldName];
};
