import * as Yup from 'yup';

export const createForLocations = (obj) => {
  const newObj = {};
  obj.forEach((elem) => {
    newObj[elem.id] = {
      title: '',
      description: '',
      image: '',
      label: '',
    };
  });
  return newObj;
};

export const createCourseInitialValues = (obj) => {
  const newObj = {};
  obj.forEach((elem) => {
    newObj[elem.id] = {
      title: '',
      description: '',
      image: '',
      label: '',
    };
  });
  return newObj;
};

export const createCourseValidationSchema = (obj) => {
  const newObj = {};
  obj.forEach((elem) => {
    newObj[elem.id] = Yup.object().shape({
      title: Yup.string().required('Campo requerido'),
      description: Yup.string().required('Campo requerido'),
      image: Yup.string().required('Campo requerido'),
      label: Yup.string().required('Campo requerido'),
    });
  });
  return Yup.object().shape(newObj);
};
