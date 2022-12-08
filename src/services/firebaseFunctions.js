// firebase
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
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
  const docRef = query(collection(firestore, url));
  const snapshot = await getDocs(docRef);

  const response = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  console.log(response);
  if (response.length === 0) throw new Error('No data');

  const res = response.filter((elem) => elem.id !== 'utils');
  return res;
};

const getCurrentCounterError = async (idCompany) => {
  console.log({ idCompany });
  const docRef = doc(firestore, 'utils', 'counterErrors');
  // check if exists
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      [idCompany]: 1,
    });
    const snapshot = await getDoc(docRef);
    const counterError = snapshot.data()[idCompany];
    return counterError;
  }
  const snapshot = await getDoc(docRef);
  const counter = Number(snapshot.data()?.[idCompany]);
  console.log({ counter });
  // check if counter is undefined
  const newCounter = Number.isInteger(counter) ? counter + 1 : 1;

  await updateDoc(docRef, {
    [idCompany]: newCounter,
  });

  return newCounter;
};

const updateCounterError = async (idCompany, type, year, month, isPlus) => {
  const docRef = doc(firestore, 'utilsDashboard', idCompany);
  const snapshot = await getDoc(docRef);
  const counterArrayErrorYear = snapshot.data()?.[year];
  const counterArrayErrorType = counterArrayErrorYear?.[type];
  counterArrayErrorType[month] += isPlus ? 1 : -1;
  await updateDoc(docRef, {
    [year]: {
      ...counterArrayErrorYear,
      [type]: counterArrayErrorType,
    },
  });
};

export const createError = async (values) => {
  const { structure, dateAndTime: dateAndTimeNoFirebase, risk, description, image, type } = values;

  const structureTitles = structure.map((elem) => elem.title);
  const idCompany = structure[0].id;

  const counter = await getCurrentCounterError(idCompany);
  await updateCounterError(idCompany, type, dateAndTimeNoFirebase.year(), dateAndTimeNoFirebase.month(), true);

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
  try {
    let urlTemp = '';

    const res = Object.entries(data).map(async ([key, values]) => {
      const id = nanoid(8);
      urlTemp += `${key}/${id}/`;
      const url = urlTemp.slice(0, -1);

      if (key !== 'company') {
        const urlUtils = `${url.split('/').slice(0, -1).join('/')}/utils`;
        const structure = Object.values(data).slice(0, Object.keys(data).indexOf(key));
        const structureWithOutImage = structure.map((elem) => ({
          title: elem.title,
          description: elem.description,
          label: elem.label,
        }));
        const docRefUtils = doc(firestore, urlUtils);
        await setDoc(docRefUtils, { structure: structureWithOutImage });
      }

      const pathImg = `company/${id}-${values.title}`;
      const storageRef = ref(storage, pathImg);
      await uploadBytes(storageRef, values.image);
      const image = await getDownloadURL(storageRef);

      const docRef = doc(firestore, url);
      await setDoc(docRef, { ...values, image });

      return {
        id,
        label: values.label,
      };
    });

    // collection company
    const response = await Promise.all(res);
    const locationDoc = response.map((elem) => elem.label);

    // collection locations
    const docRef = doc(firestore, 'locations', response[0].id);
    await setDoc(docRef, { locationDoc });

    // collection utilsDashboard
    const docRef2 = doc(firestore, 'utilsDashboard', response[0].id);
    await setDoc(docRef2, {
      [new Date().getFullYear()]: {
        maintenance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        operation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        security: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    });

    return response;
  } catch (error) {
    console.error(error);
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
    query(
      collectionGroup(firestore, 'errors'),
      where('structure', 'array-contains', title),
      orderBy('dateAndTime', 'asc')
    )
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

export const getErrorsCount = async (id, year) => {
  const querySnapshot = await getDoc(doc(firestore, 'utilsDashboard', id));

  const data = querySnapshot.data()[year];

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
  const { profileImg } = values;

  const pathImg = `userProfileImg/${values.email}`;
  const storageRef = ref(storage, pathImg);
  await uploadBytes(storageRef, profileImg);
  const imageUrl = await getDownloadURL(storageRef);

  const docRef = doc(firestore, 'user', values.email);
  await setDoc(docRef, { ...values, profileImg: imageUrl });
  const idToken = await currentUser.getIdToken();
  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    }),
  });
  return response;
};

export const deleteUser = async (email, currentUser) => {
  try {
    const docRef = doc(firestore, 'user', email);
    const idToken = await currentUser.getIdToken();
    await deleteDoc(docRef);
    await fetch(`${URL}/users/${email}`, {
      method: 'DELETE',
      headers: new Headers({ 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }),
      body: JSON.stringify(email),
    });
  } catch (err) {
    console.error(err);
  }
};

export const deleteUsers = async (listId, currentUser) => {
  try {
    const res = listId.map((email) => deleteDoc(doc(firestore, 'user', email)));
    const idToken = await currentUser.getIdToken();
    console.log(res);
    await Promise.all(res);
    await fetch(`${URL}/users`, {
      method: 'DELETE',
      headers: new Headers({ 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }),
      body: JSON.stringify(listId),
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
