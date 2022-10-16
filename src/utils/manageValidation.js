import * as Yup from 'yup';

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
      title: Yup.string().required(),
      description: Yup.string(),
      image: Yup.string(),
      label: Yup.string(),
    });
  });
  return Yup.object().shape(newObj);
};
