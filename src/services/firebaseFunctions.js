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
  where,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { nanoid } from 'nanoid';

import { firestore, storage } from './firebaseClient';

export const getCurrentUser = async (uid) => {
  const userRef = doc(firestore, 'user', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
};

export const getCompanies = async () => {
  const docRef = query(collection(firestore, 'company'));
  const snapshot = await getDocs(docRef);
  const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return data;
};

export const getLocation = async (id) => {
  const querySnapshotLocation = await getDoc(doc(firestore, 'locations', id));
  const location = querySnapshotLocation.data();
  return location.locationDoc;
};

export const getFromLocation = async (id) => {
  const docRef = query(doc(firestore, 'company', id));
  const collectionRef2 = query(collection(firestore, 'company', id, 'subnivel1'));
  const userSnap = await getDoc(docRef);
  const userData = userSnap.data();
  const collectionSnapshot = await getDocs(collectionRef2);
  const collectionData = collectionSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return {
    userData,
    collectionData,
  };
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

  if (response.length === 0) throw new Error('No data');

  const resUtils = response.find((elem) => elem.id === 'utils');
  const res = response.filter((elem) => elem.id !== 'utils');

  return { data: res, utils: resUtils };
};

export const getFeed = async (data) => {
  let urlTemp = '';

  [...data, ''].forEach(({ id }, i) => {
    const val = i === 0 ? 'company' : `subnivel${i}`;
    const idTemp = id || '';
    urlTemp += `${val}/${idTemp}/`;
  });

  const url = urlTemp.slice(0, -2);
  console.log({ data, url });
  const docRef = query(collection(firestore, url));
  const snapshot = await getDocs(docRef);

  const response = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  if (response.length === 0) throw new Error('No data');

  const res = response.filter((elem) => elem.id !== 'utils');
  return res;
};

const getCurrentCounterError = async (idCompany) => {
  const docRef = doc(firestore, 'utils', 'counterErrors');
  const snapshot = await getDoc(docRef);
  const counter = snapshot.data()?.[idCompany];
  // check if counter is undefined
  const newCounter = Number.isInteger(counter) ? counter + 1 : 1;

  await updateDoc(docRef, {
    [idCompany]: newCounter,
  });

  return newCounter;
};

export const createError = async (values) => {
  const { structure, dateAndTime: dateAndTimeNoFirebase, risk, description, image, type } = values;

  const structureTitles = structure.map((elem) => elem.title);

  const idCompany = structureTitles[0].id;

  const counter = await getCurrentCounterError(idCompany);

  let url = '';
  structure.forEach(({ id }, i) => {
    const val = i === 0 ? 'company' : `subnivel${i}`;
    url += `${val}/${id}/`;
  });
  url += 'errors';

  const refDoc = doc(firestore, url, counter.toString());
  const pathImg = `${type}-errors/${counter}`;
  const storageRef = ref(storage, pathImg);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  const dateAndTime = Timestamp.fromDate(dateAndTimeNoFirebase.toDate());

  await setDoc(refDoc, {
    structure: structureTitles,
    dateAndTime,
    risk,
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
    if (key !== 'company') {
      const urlUtils = `${url.split('/').slice(0, -1).join('/')}/utils`;
      const structure = Object.values(data).slice(0, Object.keys(data).indexOf(key));
      const docRefUtils = doc(firestore, urlUtils);
      await setDoc(docRefUtils, { structure });
    }

    const docRef = doc(firestore, url);
    await setDoc(docRef, values);

    return {
      id,
      label: values.label,
    };
  });

  try {
    const response = await Promise.all(res);
    const locationDoc = response.map((elem) => elem.label);

    const docRef = doc(firestore, 'locations', response[0].id);
    await setDoc(docRef, { locationDoc });

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteError = async (path) => {
  const docRef = doc(firestore, path);
  await deleteDoc(docRef);
};

export const deleteAllError = (paths) => {
  const res = paths.map((path) => deleteDoc(doc(firestore, path)));
  return Promise.all(res);
};

export const getSubCollectionErrors = async (title) => {
  const querySnapshot = await getDocs(
    query(collectionGroup(firestore, 'errors'), where('structure', 'array-contains', title))
  );

  const data = querySnapshot.docs.map((doc) => {
    const date = doc.data().dateAndTime.toDate().toLocaleDateString('es-ES');
    const time = doc.data().dateAndTime.toDate().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { ...doc.data(), date, time, id: doc.id, path: doc.ref.path };
  });

  return data;
};

export const getSubCollectionErrorsWithParams = async (params) => {
  const { dateI, dateF, risk, structure } = params;

  let url = '';
  structure.forEach(({ id }, i) => {
    const val = i === 0 ? 'company' : `subnivel${i}`;
    url += `${val}/${id}/`;
  });
  url += 'errors';

  const dateITimestamp = Timestamp.fromDate(dateI.toDate());
  const dateFTimestamp = Timestamp.fromDate(dateF.toDate());

  const queryConstraints = [where('dateAndTime', '>=', dateITimestamp), where('dateAndTime', '<=', dateFTimestamp)];

  if (risk !== 0) queryConstraints.push(where('risk', '==', risk));

  const querySnapshot = await getDocs(query(collection(firestore, url), ...queryConstraints));

  const data = querySnapshot.docs.map((doc) => {
    const date = doc.data().dateAndTime.toDate().toLocaleDateString('es-ES');
    const time = doc.data().dateAndTime.toDate().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return { id: doc.id, ...doc.data(), date, time };
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
