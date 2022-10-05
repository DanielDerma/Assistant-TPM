// firebase
import {
  addDoc,
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
import { listToObject } from '../utils';
import { firestore, storage } from './firebaseClient';

export const getCurrentUser = async (uid) => {
  const userRef = doc(firestore, 'user', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
};

export const getLocations = async () => {
  const docRef = query(collection(firestore, 'companies'));
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

export const createLocationRefs = async (values) => {
  const locationRef = doc(collection(firestore, 'locationRefs'));
  const valuesObj = listToObject(values);

  await setDoc(locationRef, valuesObj);

  return locationRef.id;
};

export const createLocation = async (values) => {
  const { stepper, ...rest } = values;
  const companyRef = doc(collection(firestore, 'companies'));

  const areaPathImg = `companies/${companyRef.id}`;
  const areaStorageRef = ref(storage, areaPathImg);
  await uploadBytes(areaStorageRef, rest.image);
  const image = await getDownloadURL(areaStorageRef);

  await setDoc(companyRef, { ...rest, image });

  const locationRef = doc(firestore, 'locations', companyRef.id);
  const valuesObj = listToObject(stepper);

  await setDoc(locationRef, valuesObj);

  return { locationRef: locationRef.id, companyRef: companyRef.id };
};

export const createFromArea = async (values) => {
  const { area, workspace, system, locationId } = values;

  const areaRef = doc(collection(firestore, 'locations', locationId, 'area'));

  const areaPathImg = `area/${areaRef}`;
  const areaStorageRef = ref(storage, areaPathImg);
  await uploadBytes(areaStorageRef, area.image);
  const areaImage = await getDownloadURL(areaStorageRef);

  await setDoc(areaRef, { ...area, image: areaImage });

  const workspaceRef = doc(collection(firestore, 'locations', locationId, 'area', areaRef.id, 'workspace'));

  const workspacePathImg = `workspace/${workspaceRef}`;
  const workspaceStorageRef = ref(storage, workspacePathImg);
  await uploadBytes(workspaceStorageRef, workspace.image);
  const workspaceImage = await getDownloadURL(workspaceStorageRef);

  await setDoc(workspaceRef, { ...workspace, image: workspaceImage });

  const systemRef = doc(
    collection(firestore, 'locations', locationId, 'area', areaRef.id, 'workspace', workspaceRef.id, 'system')
  );

  const systemPathImg = `system/${systemRef}`;
  const systemStorageRef = ref(storage, systemPathImg);
  await uploadBytes(systemStorageRef, system.image);
  const systemImage = await getDownloadURL(systemStorageRef);

  await setDoc(systemRef, { ...system, image: systemImage });

  return {
    location: locationId,
    area: areaRef.id,
    workspace: workspaceRef.id,
    system: systemRef.id,
  };
};

export const createFromWorkspace = async (values) => {
  const { workspace, system, locationId, areaId } = values;

  const workspaceRef = doc(collection(firestore, 'locations', locationId, 'area', areaId, 'workspace'));

  const workspacePathImg = `workspace/${workspaceRef.id}`;
  const workspaceStorageRef = ref(storage, workspacePathImg);
  await uploadBytes(workspaceStorageRef, workspace.image);
  const workspaceImage = await getDownloadURL(workspaceStorageRef);

  await setDoc(workspaceRef, { ...workspace, image: workspaceImage });

  const systemRef = doc(
    collection(firestore, 'locations', locationId, 'area', areaId, 'workspace', workspaceRef.id, 'system')
  );

  const systemPathImg = `system/${systemRef.id}`;
  const systemStorageRef = ref(storage, systemPathImg);
  await uploadBytes(systemStorageRef, system.image);
  const systemImage = await getDownloadURL(systemStorageRef);

  await setDoc(systemRef, { ...system, image: systemImage });

  return {
    location: locationId,
    area: areaId,
    workspace: workspaceRef.id,
    system: systemRef.id,
  };
};

export const createFromSystem = async (values) => {
  const { system, locationId, areaId, workspaceId } = values;

  const systemRef = doc(
    collection(firestore, 'locations', locationId, 'area', areaId, 'workspace', workspaceId, 'system')
  );

  const systemPathImg = `system/${systemRef.id}`;
  const systemStorageRef = ref(storage, systemPathImg);
  await uploadBytes(systemStorageRef, system.image);
  const systemImage = await getDownloadURL(systemStorageRef);

  await setDoc(systemRef, { ...system, image: systemImage });

  return {
    location: locationId,
    area: areaId,
    workspace: workspaceId,
    system: systemRef.id,
  };
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

export const updateUser = async (email, values) => {
  const docRef = doc(firestore, 'user', email);
  try {
    await updateDoc(docRef, values);
  } catch (err) {
    console.error(err);
  }
};

export const deleteUser = async (email) => {
  const docRef = doc(firestore, 'user', email);
  try {
    await deleteDoc(docRef);
    await fetch('http://127.0.0.1:5001/project2-5eb0d/us-central1/app/users/cesar@gmail.com', {
      method: 'DELETE',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(email),
    });
  } catch (err) {
    console.error(err);
  }
};
