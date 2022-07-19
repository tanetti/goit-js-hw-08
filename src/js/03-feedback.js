import throtle from 'lodash.throttle';

const formRef = document.querySelector('.feedback-form');

const FORM_LS_DATA_KEY = 'feedback-form-state';

let formStateData = JSON.parse(localStorage.getItem(FORM_LS_DATA_KEY)) ?? {};

const setFormStateFromLocalStorage = () => {
  if (Object.keys(formStateData).length === 0) return;

  for (const [key, value] of Object.entries(formStateData)) {
    formRef[key].value = value;
  }
};

setFormStateFromLocalStorage();

const resetForm = () => {
  formRef.reset();
  formStateData = {};
  localStorage.removeItem(FORM_LS_DATA_KEY);
};

const onFormInput = ({ target }) => {
  formStateData[target.name] = target.value;
  localStorage.setItem(FORM_LS_DATA_KEY, JSON.stringify(formStateData));
};

const onFormSubmit = event => {
  event.preventDefault();

  console.log(formStateData);

  resetForm();
};

formRef.addEventListener('input', throtle(onFormInput, 500));
formRef.addEventListener('submit', onFormSubmit);
