import { createContext } from 'react';

const FormContext = createContext({
  inputId: undefined,
  errors: {},
});

export default FormContext;
