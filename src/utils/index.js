export const getRoutes = (step, values) => {
  const { location, area, workspace, id } = values;

  if (step === null) {
    return;
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

export const stepperToLocations = (stepper) => {
  const newObj = {};
  stepper.forEach((elem) => {
    newObj[elem.id] = elem.label;
  });
  return newObj;
};
