import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from './firebaseClient';

export const getLocations = async () => {
  const docRef = query(collection(firestore, 'locations'));
  const snapshot = await getDocs(docRef);
  const data = snapshot.docs.map((doc) => doc.data());
  return data;
};
