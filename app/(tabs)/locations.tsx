import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react-native';
import { locationsService } from '@/services/locationsService';
import Header from '@/components/Header';
import { LocationType } from '@/types';

export default function LocationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        location => 
          location.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  const fetchLocations = async () => {
    try {
      const data = await locationsService.getAllLocations();
      setLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros de ubicaciones');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLocations();
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await locationsService.deleteLocation(id);
              setLocations(prevLocations => prevLocations.filter(location => location.id !== id));
              Alert.alert('Éxito', 'Registro eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el registro');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: LocationType }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.locationName}>{item.nombre}</Text>
        <Text style={styles.detail}>{item.descripcion}</Text>
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateItem}>
            <Text style={styles.coordinateLabel}>Lat:</Text>
            <Text style={styles.coordinateValue}>{item.latitud}</Text>
          </View>
          <View style={styles.coordinateItem}>
            <Text style={styles.coordinateLabel}>Long:</Text>
            <Text style={styles.coordinateValue}>{item.longitud}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.mapButton]}
          onPress={() => router.push({
            pathname: '/locations/map',
            params: { id: item.id }
          })}
        >
          <MapPin size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push({
            pathname: '/locations/edit',
            params: { id: item.id }
          })}
        >
          <Edit size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Ubicaciones" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a3b72" />
        </View>
      ) : (
        <FlatList
          data={filteredLocations}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron registros</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/locations/create')}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  locationName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  coordinateItem: {
    flexDirection: 'row',
    marginRight: 16,
  },
  coordinateLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  coordinateValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    padding: 16,
    justifyContent: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: '#50c878',
  },
  editButton: {
    backgroundColor: '#4a80f0',
  },
  deleteButton: {
    backgroundColor: '#f05050',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a3b72',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#888',
  },
});