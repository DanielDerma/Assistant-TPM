import { PDFViewer } from '@react-pdf/renderer';
import Table from './Table';

const data = {
  id: '5df3180a09ea16dc4b95f910',
  items: [
    {
      sr: 1,
      desc: 'desc1',
      xyz: 5,
    },
    {
      sr: 2,
      desc: 'desc2',
      xyz: 6,
    },
  ],
};

const index = () => (
  <PDFViewer width="1000" height="600">
    <Table data={data} />
  </PDFViewer>
);

export default index;
