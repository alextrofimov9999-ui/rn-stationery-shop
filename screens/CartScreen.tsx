import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCartLines, useCartStore } from '../stores/cartStore';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<Nav>();
  const lines = useCartLines();
  const clear = useCartStore((s) => s.clear);

  if (lines.length === 0) {
    return <EmptyState title="Корзина пуста" subtitle="Добавьте лекарства из каталога" />;
  }

  const handleBuy = () => {
    const state = useCartStore.getState().lines;
    const drugsCount = Object.values(state).reduce((s, l) => s + l.quantity, 0);

    Alert.alert(
      'Заказ оформлен',
      `Вы заказали ${drugsCount} преп.`,
      [{ text: 'OK', onPress: () => { clear(); navigation.popToTop(); } }],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lines}
        keyExtractor={(line) => line.drug.id}
        renderItem={({ item }) => <CartItem line={item} />}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <CartSummary />
        <Pressable style={styles.buyBtn} onPress={handleBuy}>
          <Text style={styles.buyBtnText}>Оформить заказ</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6f8' },
  list: { paddingVertical: 6 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  buyBtn: { backgroundColor: '#2e7d32', marginHorizontal: 16, marginBottom: 20, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
