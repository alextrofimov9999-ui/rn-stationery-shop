import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchDrugs } from '../api/mockProductsAPI';
import { Drug } from '../types/product';
import { RootStackParamList } from '../types/navigation';
import ProductListItem from '../components/ProductListItem';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

export default function ProductListScreen() {
  const navigation = useNavigation<Nav>();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDrugs();
        if (alive) setDrugs(data);
      } catch (e) {
        if (alive) setError('Не удалось загрузить лекарства');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.hint}>Загружаем аптеку…</Text>
      </View>
    );
  }

  if (error) {
    return <EmptyState title="Ошибка" subtitle={error} />;
  }

  if (drugs.length === 0) {
    return <EmptyState title="Аптека пуста" />;
  }

  return (
    <FlatList
      data={drugs}
      keyExtractor={(drug) => drug.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ProductListItem
          product={item}
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: 8, color: '#666' },
});
