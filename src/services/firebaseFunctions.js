import uniqid from 'uniqid';

// firebase
import { collection, doc, getDocs, query, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { firestore, storage } from './firebaseClient';

export const getLocations = async () => {
  const docRef = query(collection(firestore, 'locations'));
  const snapshot = await getDocs(docRef);
  const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return data;
};

export const getFeed = async (step, values) => {
  const { location, area, workspace } = values;

  if (step === null) {
    const docRef = query(collection(firestore, 'locations'));
    const snapshot = await getDocs(docRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  }

  if (step === 'location') {
    const docRef = query(collection(firestore, 'locations', location, 'area'));
    const snapshot = await getDocs(docRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  }
  if (step === 'area') {
    const docRef = query(collection(firestore, 'locations', location, 'area', area, 'workspace'));
    const snapshot = await getDocs(docRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  }
  if (step === 'workspace') {
    const docRef = query(collection(firestore, 'locations', location, 'area', area, 'workspace', workspace, 'system'));
    const snapshot = await getDocs(docRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  }

  return [];
};

export const createError = async (values) => {
  const {
    stepper: { location, area, workspace, system },
    dateAndTime: dateAndTimeNoFirebase,
    anomaly,
    description,
    image,
    type,
  } = values;

  const uid = uniqid();

  const pathImg = `${type}-errors/${uid}`;
  const storageRef = ref(storage, pathImg);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  const dateAndTime = Timestamp.fromDate(dateAndTimeNoFirebase.toDate());

  const refDoc = doc(
    firestore,
    'locations',
    location,
    'area',
    area,
    'workspace',
    workspace,
    'system',
    system,
    'errors',
    uid
  );

  const docRef = await setDoc(refDoc, {
    dateAndTime,
    anomaly,
    description,
    imageUrl,
    type,
  });

  return docRef;
};
