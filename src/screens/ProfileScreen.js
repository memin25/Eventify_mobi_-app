import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';
import { useUserEvents } from '../hooks/useEvents';
import Button from '../components/common/Button';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { data: userEvents, isLoading } = useUserEvents(user?.id);

  const handleSignOut = () => {
    Alert.alert(
      'çıkış yaap',
      'hesabınızdan çıkmak istediğinizden emin misiniz',
      [
        {
          text: 'iptal',
          style: 'cancel',
        },
        {
          text: 'cıkış yap',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={48} color="#007AFF" />
      </View>
      <Text style={styles.userName}>
        {user?.user_metadata?.firstName || 'Test'} {user?.user_metadata?.lastName || 'User'}
      </Text>
      <Text style={styles.userEmail}>{user?.email}</Text>
    </View>
  );

  const StatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{userEvents?.length || 0}</Text>
        <Text style={styles.statLabel}>Oluşturulan Etkinlik</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Katılınan Etkinlik</Text>
      </View>
    </View>
  );

  const EventItem = ({ event }) => (
    <TouchableOpacity style={styles.eventItem}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.eventDate}>
          {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
        </Text>
        <Text style={styles.eventLocation} numberOfLines={1}>
          📍 {event.location}
        </Text>
      </View>
      <View style={styles.eventStats}>
        <Text style={styles.eventParticipants}>
          {event.current_participants}/{event.max_participants}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const MyEvents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Oluşturduğum Etkinlikler</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : userEvents && userEvents.length > 0 ? (
        userEvents.map((event) => (
          <EventItem key={event.id} event={event} />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Henüz etkinlik oluşturmadınız</Text>
          <Text style={styles.emptySubtext}>
            İlk etkinliğinizi oluşturmak için "Oluştur" sekmesine gidin
          </Text>
        </View>
      )}
    </View>
  );

  const MenuItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ayarlar</Text>
      
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="person-outline" size={24} color="#007AFF" />
        <Text style={styles.menuText}>Profili Düzenle</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="notifications-outline" size={24} color="#007AFF" />
        <Text style={styles.menuText}>Bildirimler</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.menuText}>Yardım</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.menuText}>Hakkında</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader />
      <StatsCard />
      <MyEvents />
      <MenuItems />
      
      <View style={styles.signOutContainer}>
        <Button
          title="Çıkış Yap"
          variant="danger"
          onPress={handleSignOut}
          icon="log-out-outline"
          style={styles.signOutButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  eventStats: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  eventParticipants: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  signOutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signOutButton: {
    marginTop: 10,
  },
});
