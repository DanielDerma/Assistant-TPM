import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    width: '60%',
  },
  xyz: {
    width: '40%',
  },
});

const TableRow = ({ items }) => (
  <>
    {items.map((item) => (
      <View style={styles.row} key={item.sr.toString()}>
        <Text style={styles.description}>{item.desc}</Text>
        <Text style={styles.xyz}>{item.xyz}</Text>
      </View>
    ))}
  </>
);

export default TableRow;
