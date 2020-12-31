import React from 'react';
import cn from 'classnames';
import {
  string,
  node,
  object,
  func,
} from 'prop-types';

import FormInput from '../FormInput';
import FormLabel from '../FormLabel';
import FormGroup from '../FormGroup';
import FormFeedback from '../FormFeedback';
import FormContext from '../../context/FormContext';

import styles from './styles.module.scss';

const Form = ({
  children,
  className,
  action,
  method,
  errors,
  onSubmit,
}) => (
  <FormContext.Provider
    value={{
      errors,
    }}
  >
    <form
      className={cn(
        styles.form,
        className,
      )}
      action={action}
      method={method}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  </FormContext.Provider>
);

Form.defaultProps = {
  children: null,
  className: null,
  action: null,
  method: null,
  errors: null,
  onSubmit: null,
};

Form.propTypes = {
  children: node,
  className: string,
  action: string,
  method: string,
  errors: object,
  onSubmit: func,
};

Form.Input = FormInput;
Form.Label = FormLabel;
Form.Group = FormGroup;
Form.Feedback = FormFeedback;

export default Form;
