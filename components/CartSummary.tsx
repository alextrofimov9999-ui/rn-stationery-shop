import { StyleSheet, Text, View } from 'react-native';
import { selectCartCount, useCartStore } from '../stores/cartStore';

export default function CartSummary() {
  const count = useCartStore(selectCartCount);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>Препаратов</Text>
        <Text style={styles.value}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '600' },
});
