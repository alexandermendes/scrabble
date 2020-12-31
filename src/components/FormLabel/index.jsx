import React, { useContext } from 'react';
import cn from 'classnames';
import { string, node } from 'prop-types';

import FormContext from '../../context/FormContext';

import styles from './styles.module.scss';

const FormLabel = ({
  children,
  className,
}) => {
  const { inputId } = useContext(FormContext);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label
      className={cn(
        styles['form-label'],
        'mb-1',
        className,
      )}
      htmlFor={inputId}
    >
      {children}
    </label>
  );
};

FormLabel.defaultProps = {
  children: null,
  className: null,
};

FormLabel.propTypes = {
  children: node,
  className: string,
};

export default FormLabel;
