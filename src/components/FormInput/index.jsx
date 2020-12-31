import React, { useContext } from 'react';
import cn from 'classnames';
import {
  string,
  node,
  number,
  bool,
} from 'prop-types';

import FormContext from '../../context/FormContext';

import styles from './styles.module.scss';

const FormInput = ({
  className,
  placeholder,
  defaultValue,
  type,
  name,
  as,
  children,
  rows,
  required,
}) => {
  const {
    inputId,
    errors,
  } = useContext(FormContext);

  const Component = as || 'input';

  return (
    <Component
      className={cn(
        styles['form-input'],
        {
          [styles['form-input--invalid']]: errors && name in errors,
          [styles['form-input--select']]: as === 'select',
        },
        className,
      )}
      id={inputId}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      name={name}
      rows={rows}
      required={required}
      as={as}
    >
      {children}
    </Component>

  );
};

FormInput.defaultProps = {
  placeholder: null,
  defaultValue: '',
  type: 'text',
  className: null,
  name: null,
  as: null,
  children: null,
  rows: null,
  required: null,
};

FormInput.propTypes = {
  className: string,
  placeholder: string,
  defaultValue: string,
  type: string,
  name: string,
  as: string,
  children: node,
  rows: number,
  required: bool,
};

export default FormInput;
