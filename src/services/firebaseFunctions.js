// firebase
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { nanoid } from 'nanoid';

import { firestore, storage } from './firebaseClient';

export const getCurrentUser = async (uid) => {
  const userRef = doc(firestore, 'user', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
};

export const getLocations = async () => {
  const docRef = query(collection(firestore, 'company'));
  const snapshot = await getDocs(docRef);
  const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return data;
};

export const getFeed2 = async (data) => {
  let urlTemp = '';

  [...data, ''].forEach((elem, i) => {
    const val = i === 0 ? 'company' : `subnivel${i}`;
    urlTemp += `${val}/${elem}/`;
  });

  const url = urlTemp.slice(0, -2);
  const docRef = query(collection(firestore, url));
  const snapshot = await getDocs(docRef);
  const response = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  const resUtils = response.find((elem) => elem.id === 'utils');
  const res = response.filter((elem) => elem.id !== 'utils');
  return { data: res, utils: resUtils };
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
    const docRef = query(collection(firestore, 'locations', location.id, 'area'));
    const snapshot = await getDocs(docRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  }
  if (step === 'area') {
    const docRef = query(collection(firestore, 'locations', location.id, 'area', area.id, 'workspace'));
    const snapshot = await getDocs(docRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  }
  if (step === 'workspace') {
    const docRef = query(
      collection(firestore, 'locations', location.id, 'area', area.id, 'workspace', workspace.id, 'system')
    );
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

  const refDoc = doc(
    collection(
      firestore,
      'locations',
      location.id,
      'area',
      area.id,
      'workspace',
      workspace.id,
      'system',
      system.id,
      'errors'
    )
  );

  const pathImg = `${type}-errors/${refDoc.id}`;
  const storageRef = ref(storage, pathImg);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  const dateAndTime = Timestamp.fromDate(dateAndTimeNoFirebase.toDate());

  await setDoc(refDoc, {
    location: location.title,
    area: area.title,
    workspace: workspace.title,
    system: system.title,
    dateAndTime,
    anomaly,
    description,
    image: imageUrl,
    type,
  });

  return refDoc.id;
};

export const createFromCompany = async (data) => {
  let urlTemp = '';

  const res = Object.entries(data).map(async ([key, values]) => {
    const id = nanoid(8);
    urlTemp += `${key}/${id}/`;
    const url = urlTemp.slice(0, -1);
    const urlUtils = `${url.split('/').slice(0, -1).join('/')}/utils`;
    const structure = Object.values(data).slice(0, Object.keys(data).indexOf(key));

    const docRef = doc(firestore, url);
    const docRef2 = doc(firestore, urlUtils);

    await setDoc(docRef, values);
    await setDoc(docRef2, { structure });
    return 'ok';
  });
  try {
    await Promise.all(res);
    return 'ok';
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getSubCollectionErrors = async () => {
  const querySnapshot = await getDocs(collectionGroup(firestore, 'errors'));

  const data = querySnapshot.docs.map((doc) => {
    const date = doc.data().dateAndTime.toDate().toLocaleDateString('es-ES');
    return { ...doc.data(), dateAndTime: date, id: doc.id };
  });

  return data;
};

export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(firestore, 'user'));
  const data = querySnapshot.docs.map((doc) => doc.data());

  return data;
};

export const createUser = async (values, currentUser) => {
  const docRef = doc(firestore, 'user', values.email);
  try {
    const idToken = await currentUser.getIdToken();
    await fetch('https://us-central1-project2-5eb0d.cloudfunctions.net/app/users', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      }),
    });
    await setDoc(docRef, values);
  } catch (err) {
    console.error(err);
  }
};

export const deleteUser = async (email) => {
  const docRef = doc(firestore, 'user', email);
  try {
    await deleteDoc(docRef);
    await fetch(`https://us-central1-project2-5eb0d.cloudfunctions.net/app/users/${email}`, {
      method: 'DELETE',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(email),
    });
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (email, values) => {
  const docRef = doc(firestore, 'user', email);
  try {
    await updateDoc(docRef, values);
  } catch (err) {
    console.error(err);
  }
};
