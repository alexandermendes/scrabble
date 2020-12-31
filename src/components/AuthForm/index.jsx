import React from 'react';
import {
  string,
  func,
  object,
  node,
} from 'prop-types';

import Form from '../Form';
import GreyBox from '../GreyBox';
import Heading from '../Heading';
import Button from '../Button';

const AuthForm = ({
  heading,
  onSubmit,
  errors,
  children,
}) => (
  <GreyBox>
    <Heading
      size={1}
      className="text-center"
    >
      {heading}
    </Heading>
    <Form
      onSubmit={onSubmit}
      errors={errors}
    >
      <Form.Group
        inputId="email"
      >
        <Form.Label>
          Email
        </Form.Label>
        <Form.Input
          name="email"
          type="email"
          required
        />
        <Form.Feedback
          name="email"
        />
      </Form.Group>
      <Form.Group
        inputId="password"
      >
        <Form.Label>
          Password
        </Form.Label>
        <Form.Input
          name="password"
          type="password"
          required
        />
        <Form.Feedback
          name="password"
        />
      </Form.Group>
      <Button
        className="d-flex ml-auto"
        type="submit"
      >
        Submit
      </Button>
    </Form>
    {children}
  </GreyBox>
);

AuthForm.defaultProps = {
  errors: {},
  children: null,
};

AuthForm.propTypes = {
  heading: string.isRequired,
  onSubmit: func.isRequired,
  errors: object,
  children: node,
};

export default AuthForm;
