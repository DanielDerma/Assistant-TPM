/* eslint-disable */
import * as Yup from 'yup';

export const createCourseInitialValues = (obj) => {
  const newObj = {};
  for (let value of obj) {
    newObj[value.type] = {
      title: '',
      description: '',
      image: '',
    };
  }
  return newObj;
};
export const createCourseValidationSchema = (obj) => {
  let newObj = {};
  for (let value of obj) {
    newObj[value.type] = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      image: Yup.string().required(),
    });
  }
  return Yup.object().shape(newObj);
};
