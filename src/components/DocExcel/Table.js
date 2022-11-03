import { Page, Document, StyleSheet, View, Text, Image } from '@react-pdf/renderer';
import ItemsTable from './ItemsTable';

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: 'column',
  },
});

const Table = ({ data }) => (
  <Document>
    <Page
      size="A4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 10,
        }}
      >
        <Text style={{ color: '#3388af', fontSize: '42px' }}>asdf</Text>
        <Text>Por asdf</Text>
        <Image src="https://picsum.photos/600/400" alt="random image" style={{ maxWidth: '600px', maxHeight: '400' }} />
        <Text
          style={{
            color: 'gray',
            fontStyle: 'italic',
            fontSize: '10px',
          }}
        >
          asdf
        </Text>

        <Text style={{ textAlign: 'justify', marginTop: '22px' }}>asdf</Text>
      </View>
    </Page>
  </Document>
);

export default Table;
