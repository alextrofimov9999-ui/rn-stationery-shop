import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Drug } from '../types/product';
import { useCartStore } from '../stores/cartStore';

interface Props {
  product: Drug;
  onPress: () => void;
}

export default function ProductListItem({ product, onPress }: Props) {
  const add = useCartStore((s) => s.add);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>ЛС</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.manufacturer}>{product.manufacturer}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}, {product.dosage}
        </Text>
        <Text style={styles.form}>{product.form}</Text>
      </View>
      <Pressable
        style={styles.addBtn}
        onPress={(e) => {
          e.stopPropagation();
          add(product);
        }}
      >
        <Text style={styles.addBtnText}>+</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 18, fontWeight: '700', color: '#2e7d32' },
  info: { flex: 1, marginLeft: 12 },
  manufacturer: { fontSize: 11, color: '#888', textTransform: 'uppercase' },
  name: { fontSize: 14, fontWeight: '600', marginVertical: 2 },
  form: { fontSize: 12, color: '#666' },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2e7d32', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 22, lineHeight: 24, fontWeight: '700' },
});
