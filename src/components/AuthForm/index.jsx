import React from 'react';
import {
  string,
  func,
  object,
  node,
  shape,
} from 'prop-types';

import Form from '../Form';
import GreyBox from '../GreyBox';
import Heading from '../Heading';
import Button from '../Button';
import Message from '../Message';

const AuthForm = ({
  heading,
  onSubmit,
  message,
  errors,
  children,
}) => (
  <GreyBox>
    <Heading
      size={1}
      className="text-center mb-5"
    >
      {heading}
    </Heading>
    <p
      className="text-center mb-5"
    >
      Please sign in with a valid email address to play.
    </p>
    {message && (
      <Message
        className="mb-5"
        type={message.type}
      >
        {message.text}
      </Message>
    )}
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
        inputId="name"
      >
        <Form.Label>
          Display Name
        </Form.Label>
        <Form.Input
          name="name"
          type="name"
          required
        />
        <Form.Feedback
          name="name"
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
  message: null,
};

AuthForm.propTypes = {
  heading: string.isRequired,
  onSubmit: func.isRequired,
  errors: object,
  message: shape({
    text: string.isRequired,
    type: Message.propTypes.type,
  }),
  children: node,
};

export default AuthForm;
