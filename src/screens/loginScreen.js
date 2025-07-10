import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validation';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    setIsLoading(true);
    
    try {
      let result;
      if (isRegisterMode) {
        console.log('Attempting to register with:', data.email);
        result = await signUp(data.email, data.password, {
          firstName: 'Test',
          lastName: 'User'
        });
        console.log('Register result:', result);
        if (result.success) {
          Alert.alert('Başarılı', 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          setIsRegisterMode(false);
        } else {
          console.error('Register failed:', result.error);
          Alert.alert('Kayıt Hatası', result.error);
        }
      } else {
        result = await signIn(data.email, data.password);
        if (!result.success) {
          Alert.alert('Giriş Hatası', result.error);
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Eventify</Text>
          <Text style={styles.subtitle}>Etkinliklere katılın, yeni insanlarla tanışın</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="E-posta"
                placeholder="ornek@email.com"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Şifre"
                placeholder="Şifrenizi giriniz"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title={isRegisterMode ? "Kayıt Ol" : "Giriş Yap"}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.loginButton}
          />

          <Button
            title="Demo Giriş (Email Confirmation Bypass)"
            variant="secondary"
            onPress={() => {
              Alert.alert(
                'Demo Giriş',
                'Email confirmation sorunu nedeniyle demo için auth bypass yapılıyor...',
                [
                  {
                    text: 'Tamam',
                    onPress: () => {
                      // Önce auth store'u temizle
                      useAuthStore.setState({
                        user: null,
                        session: null,
                        loading: false
                      });
                      
                      // Sonra demo kullanıcıyı set et
                      const demoUser = {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        email: 'testuser123@gmail.com',
                        user_metadata: {
                          firstName: 'Test',
                          lastName: 'User'
                        }
                      };
                      
                      const demoSession = {
                        user: demoUser,
                        access_token: 'demo-token'
                      };
                      
                      console.log('Setting demo user with ID:', demoUser.id);
                      
                      // Auth store'u manuel güncelle
                      useAuthStore.setState({
                        user: demoUser,
                        session: demoSession,
                        loading: false
                      });
                    }
                  }
                ]
              );
            }}
            style={styles.testButton}
          />

          <Button
            title={isRegisterMode ? "Zaten hesabınız var mı? Giriş yapın" : "Hesabınız yok mu? Kayıt olun"}
            variant="ghost"
            onPress={() => setIsRegisterMode(!isRegisterMode)}
            style={styles.registerButton}
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
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  testButton: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
  },
});
