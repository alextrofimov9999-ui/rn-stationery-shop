import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartLine } from '../types/product';
import { useCartStore } from '../stores/cartStore';

export default function CartItem({ line }: { line: CartLine }) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>ЛС</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {line.drug.name}, {line.drug.dosage}
        </Text>
        <Text style={styles.details}>
          {line.drug.form} • {line.drug.manufacturer}
        </Text>
        <View style={styles.controls}>
          <Pressable style={styles.qtyBtn} onPress={() => decrement(line.drug.id)}>
            <Text style={styles.qtyText}>-</Text>
          </Pressable>
          <Text style={styles.qty}>{line.quantity}</Text>
          <Pressable style={styles.qtyBtn} onPress={() => increment(line.drug.id)}>
            <Text style={styles.qtyText}>+</Text>
          </Pressable>
          <Pressable onPress={() => remove(line.drug.id)} style={styles.remove}>
            <Text style={styles.removeText}>Удалить</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 12, marginHorizontal: 12, marginVertical: 6, backgroundColor: '#fff', borderRadius: 12 },
  icon: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 18, fontWeight: '700', color: '#2e7d32' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  details: { fontSize: 12, color: '#666', marginBottom: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 18, fontWeight: '700', color: '#2e7d32' },
  qty: { fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  remove: { marginLeft: 'auto' },
  removeText: { color: '#e53935', fontSize: 13 },
});
