import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Drug } from '../types/product';

export default function ProductDetailsCard({ product }: { product: Drug }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>ЛС</Text>
      </View>
      <Text style={styles.manufacturer}>{product.manufacturer}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.latinName}>{product.latin_name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {product.prescription_required ? 'По рецепту' : 'Без рецепта'}
        </Text>
      </View>
      <Text style={styles.infoLine}>Действующее вещество: {product.active_substance}</Text>
      <Text style={styles.infoLine}>Форма выпуска: {product.form}</Text>
      <Text style={styles.infoLine}>Дозировка: {product.dosage}</Text>
      <Text style={styles.stock}>В наличии: {product.stock} уп.</Text>
      <Text style={styles.desc}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 40 },
  icon: { width: '100%', height: 160, borderRadius: 16, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconText: { fontSize: 40, fontWeight: '700', color: '#2e7d32' },
  manufacturer: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  name: { fontSize: 22, fontWeight: '700', marginVertical: 6 },
  latinName: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  category: { fontSize: 13, color: '#999', marginTop: 8, marginBottom: 12 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e3f2fd', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  badgeText: { color: '#1565c0', fontSize: 12, fontWeight: '600' },
  infoLine: { fontSize: 15, lineHeight: 22, color: '#333', marginBottom: 4 },
  stock: { fontSize: 13, color: '#2e7d32', marginVertical: 12 },
  desc: { fontSize: 15, lineHeight: 22, color: '#333' },
});
