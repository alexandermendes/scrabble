import React, { useContext } from 'react';
import cn from 'classnames';
import { string } from 'prop-types';

import FormContext from '../../context/FormContext';

import styles from './styles.module.scss';

const FormFeedback = ({
  className,
  name,
}) => {
  const { errors } = useContext(FormContext);

  return (errors && name in errors) ? (
    <div
      className={cn(
        styles['form-feedback'],
        {
          [styles['form-feedback--invalid']]: name in errors,
        },
        'mt-2',
        className,
      )}
    >
      {errors[name]}
    </div>
  ) : null;
};

FormFeedback.defaultProps = {
  className: null,
};

FormFeedback.propTypes = {
  className: string,
  name: string.isRequired,
};

export default FormFeedback;
