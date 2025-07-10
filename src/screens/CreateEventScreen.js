import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';
import { eventSchema, eventCategories } from '../utils/validation';
import { useCreateEvent } from '../hooks/useEvents';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function CreateEventScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user } = useAuthStore();
  const createEventMutation = useCreateEvent();

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      maxParticipants: '',
      price: '',
    },
  });

  const watchedCategory = watch('category');

  const onSubmit = async (data) => {
    if (!user) {
      Alert.alert('Hata', 'Giriş yapmanız gerekiyor.');
      return;
    }

    console.log('Creating event with user:', user);
    console.log('Form data:', data);
    
    setIsLoading(true);
    
    try {
      const validUserId = user.id === 'demo-user-123' ? '971a5720-c13e-4267-8ff1-6ab3cc9021d3' : user.id;
      
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
        max_participants: parseInt(data.maxParticipants),
        price: data.price ? parseFloat(data.price) : 0,
        user_id: validUserId,
      };

      console.log('Event data to be sent:', eventData);
      console.log('Using user_id:', validUserId);
      
      await createEventMutation.mutateAsync(eventData);
      
      Alert.alert('Başarılı', 'Etkinlik başarıyla oluşturuldu!', [
        {
          text: 'Tamam',
          onPress: () => {
            // Form'u temizle
            setValue('title', '');
            setValue('description', '');
            setValue('date', '');
            setValue('time', '');
            setValue('location', '');
            setValue('category', '');
            setValue('maxParticipants', '');
            setValue('price', '');
            setSelectedCategory('');
          }
        }
      ]);
    } catch (error) {
      console.error('Create event error:', error);
      Alert.alert('Hata', `Etkinlik oluşturulurken bir hata oluştu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const CategorySelector = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryLabel}>Kategori *</Text>
      <View style={styles.categoryGrid}>
        {eventCategories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryItem,
              watchedCategory === category.value && styles.categoryItemSelected
            ]}
            onPress={() => {
              setValue('category', category.value);
              setSelectedCategory(category.value);
            }}
          >
            <Text style={[
              styles.categoryText,
              watchedCategory === category.value && styles.categoryTextSelected
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category && (
        <Text style={styles.errorText}>{errors.category.message}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="add-circle" size={32} color="#007AFF" />
          <Text style={styles.title}>Yeni Etkinlik Oluştur</Text>
          <Text style={styles.subtitle}>Etkinlik detaylarını doldurun</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Etkinlik Başlığı"
                placeholder="Örn: React Native Workshop"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Açıklama"
                placeholder="Etkinlik hakkında detaylı bilgi verin..."
                value={value}
                onChangeText={onChange}
                error={errors.description?.message}
                multiline
                numberOfLines={4}
              />
            )}
          />

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Tarih"
                    placeholder="YYYY-MM-DD"
                    value={value}
                    onChangeText={onChange}
                    error={errors.date?.message}
                  />
                )}
              />
            </View>
            
            <View style={styles.dateTimeItem}>
              <Controller
                control={control}
                name="time"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Saat"
                    placeholder="HH:MM"
                    value={value}
                    onChangeText={onChange}
                    error={errors.time?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Konum"
                placeholder="Örn: İstanbul Teknik Üniversitesi"
                value={value}
                onChangeText={onChange}
                error={errors.location?.message}
              />
            )}
          />

          <CategorySelector />

          <View style={styles.participantsRow}>
            <View style={styles.participantsItem}>
              <Controller
                control={control}
                name="maxParticipants"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Maksimum Katılımcı"
                    placeholder="50"
                    value={value}
                    onChangeText={onChange}
                    error={errors.maxParticipants?.message}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            
            <View style={styles.participantsItem}>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Fiyat (₺)"
                    placeholder="0 (Ücretsiz)"
                    value={value}
                    onChangeText={onChange}
                    error={errors.price?.message}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </View>

          <Button
            title="Etkinlik Oluştur"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading || createEventMutation.isPending}
            style={styles.createButton}
            icon="add-circle"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeItem: {
    flex: 1,
  },
  participantsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  participantsItem: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  categoryItemSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
    marginTop: 4,
  },
  createButton: {
    marginTop: 20,
  },
});
