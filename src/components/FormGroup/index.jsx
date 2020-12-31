import React, { useContext } from 'react';
import cn from 'classnames';
import {
  number,
  string,
  node,
  oneOfType,
} from 'prop-types';

import FormContext from '../../context/FormContext';

import styles from './styles.module.scss';

const FormGroup = ({
  inputId,
  children,
  className,
}) => (
  <FormContext.Provider
    value={Object.assign(useContext(FormContext), {
      inputId,
    })}
  >
    <div
      className={cn(
        styles['form-group'],
        'pb-4',
        className,
      )}
    >
      {children}
    </div>
  </FormContext.Provider>
);

FormGroup.defaultProps = {
  className: null,
  inputId: null,
  children: null,
};

FormGroup.propTypes = {
  inputId: oneOfType([number, string]),
  className: string,
  children: node,
};

export default FormGroup;
