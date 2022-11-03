import { View, StyleSheet } from '@react-pdf/renderer';
import TableRow from './TableRow';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const ItemsTable = ({ data }) => (
  <View style={styles.tableContainer}>
    <TableRow items={data.items} />
  </View>
);

export default ItemsTable;
