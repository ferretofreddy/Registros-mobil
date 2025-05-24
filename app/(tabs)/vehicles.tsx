import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Edit, Trash2 } from 'lucide-react-native';
import { vehiclesService } from '@/services/vehiclesService';
import Header from '@/components/Header';
import { VehicleType } from '@/types';

export default function VehiclesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(
        vehicle => 
          vehicle.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.modelo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesService.getAllVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros de vehículos');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVehicles();
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
              await vehiclesService.deleteVehicle(id);
              setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
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

  const renderItem = ({ item }: { item: VehicleType }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.plate}>{item.placa}</Text>
        <Text style={styles.detail}>{`${item.marca} ${item.modelo}`}</Text>
        <Text style={styles.detail}>Color: {item.color}</Text>
        <Text style={styles.detail}>Año: {item.anno}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push({
            pathname: '/vehicles/edit',
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
      <Header title="Vehículos" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por placa, marca o modelo..."
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
          data={filteredVehicles}
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
        onPress={() => router.push('/vehicles/create')}
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
  plate: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
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