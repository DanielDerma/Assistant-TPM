import uniqid from 'uniqid';

// firebase
import { collection, collectionGroup, doc, getDocs, query, setDoc, Timestamp } from 'firebase/firestore';
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

  const refDoc = doc(
    collection(firestore, 'locations', location, 'area', area, 'workspace', workspace, 'system', system, 'errors')
  );

  const pathImg = `${type}-errors/${refDoc.id}`;
  const storageRef = ref(storage, pathImg);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  const dateAndTime = Timestamp.fromDate(dateAndTimeNoFirebase.toDate());

  await setDoc(refDoc, {
    dateAndTime,
    anomaly,
    description,
    imageUrl,
    type,
  });

  return refDoc.id;
};

export const getErrors = async (values) => {
  const { location, area, workspace, system } = values;
  const docRef = query(
    collection(firestore, 'locations', location, 'area', area, 'workspace', workspace, 'system', system, 'errors')
  );
  const snapshot = await getDocs(docRef);
  const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return data;
};

export const createFromLocation = async (values) => {
  const { location, area, workspace, system } = values;

  const locationRef = doc(collection(firestore, 'locations'));

  const locationPathImg = `location/${locationRef}`;
  const locationStorageRef = ref(storage, locationPathImg);
  await uploadBytes(locationStorageRef, location.image);
  const locationImage = await getDownloadURL(locationStorageRef);

  await setDoc(locationRef, { ...location, image: locationImage });

  const areaRef = doc(collection(firestore, 'locations', locationRef.id, 'area'));

  const areaPathImg = `area/${areaRef}`;
  const areaStorageRef = ref(storage, areaPathImg);
  await uploadBytes(areaStorageRef, area.image);
  const areaImage = await getDownloadURL(areaStorageRef);

  await setDoc(areaRef, { ...area, image: areaImage });

  const workspaceRef = doc(collection(firestore, 'locations', locationRef.id, 'area', areaRef.id, 'workspace'));

  const workspacePathImg = `workspace/${workspaceRef}`;
  const workspaceStorageRef = ref(storage, workspacePathImg);
  await uploadBytes(workspaceStorageRef, workspace.image);
  const workspaceImage = await getDownloadURL(workspaceStorageRef);

  await setDoc(workspaceRef, { ...workspace, image: workspaceImage });

  const systemRef = doc(
    collection(firestore, 'locations', locationRef.id, 'area', areaRef.id, 'workspace', workspaceRef.id, 'system')
  );

  const systemPathImg = `system/${systemRef}`;
  const systemStorageRef = ref(storage, systemPathImg);
  await uploadBytes(systemStorageRef, system.image);
  const systemImage = await getDownloadURL(systemStorageRef);

  await setDoc(systemRef, { ...system, image: systemImage });

  return {
    location: locationRef.id,
    area: areaRef.id,
    workspace: workspaceRef.id,
    system: systemRef.id,
  };
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

  const workspacePathImg = `workspace/${workspaceRef}`;
  const workspaceStorageRef = ref(storage, workspacePathImg);
  await uploadBytes(workspaceStorageRef, workspace.image);
  const workspaceImage = await getDownloadURL(workspaceStorageRef);

  await setDoc(workspaceRef, { ...workspace, image: workspaceImage });

  const systemRef = doc(
    collection(firestore, 'locations', locationId, 'area', areaId, 'workspace', workspaceRef.id, 'system')
  );

  const systemPathImg = `system/${systemRef}`;
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

  const systemPathImg = `system/${systemRef}`;
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

export const getSubCollectionErrors = async (location) => {
  // collecion group erros if parent is 'location'
  const locationErrors = await getDocs(collectionGroup(firestore, 'errors', where('parent', '==', location)));

  const querySnapshot = await getDocs(collectionGroup(firestore, 'errors'));
  const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return data;
};
