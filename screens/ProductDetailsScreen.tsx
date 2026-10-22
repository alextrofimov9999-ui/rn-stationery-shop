import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchDrugById } from '../api/mockProductsAPI';
import { Drug } from '../types/product';
import { RootStackParamList } from '../types/navigation';
import ProductDetailsCard from '../components/ProductDetailsCard';
import EmptyState from '../components/EmptyState';
import { useCartStore } from '../stores/cartStore';

type RouteT = RouteProp<RootStackParamList, 'ProductDetails'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen() {
  const { params } = useRoute<RouteT>();
  const navigation = useNavigation<Nav>();
  const add = useCartStore((s) => s.add);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const foundDrug = await fetchDrugById(params.productId);
      if (alive) {
        setDrug(foundDrug ?? null);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params.productId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!drug) {
    return <EmptyState title="Лекарство не найдено" />;
  }

  return (
    <View style={styles.container}>
      <ProductDetailsCard product={drug} />
      <View style={styles.footer}>
        <Pressable
          style={styles.buyBtn}
          onPress={() => {
            add(drug);
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.buyBtnText}>Добавить в корзину</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  buyBtn: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
