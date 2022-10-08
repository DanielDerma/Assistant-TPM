import { v4 as uuidv4 } from 'uuid';

export const getRoutes = (step, values) => {
  const { location, area, workspace, id } = values;

  if (step === null) {
    return `/dashboard/manage/${id}`;
  }
  if (step === 'location') {
    return `/dashboard/manage/${location}/${id}`;
  }
  if (step === 'area') {
    return `/dashboard/manage/${location}/${area}/${id}`;
  }
  if (step === 'workspace') {
    return `/dashboard/manage/${location}/${area}/${workspace}/${id}`;
  }
  return null;
};

// array of objects to object
export const listToObject = (list) => {
  const obj = {};
  list.forEach((item) => {
    obj[item.id] = item;

  })
  return obj;
};
