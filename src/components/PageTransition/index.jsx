import React, { useState } from 'react';
import { node, bool } from 'prop-types';
import { Transition, SwitchTransition } from 'react-transition-group';
import Router from 'next/router';

const duration = 200;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const PageTransition = ({
  children,
  loaded,
}) => {
  const [routeChanging, setRouteChanging] = useState(false);

  Router.events.on('routeChangeStart', () => {
    setRouteChanging(true);
  });

  return (
    <SwitchTransition
      mode="out-in"
    >
      <Transition
        in
        appear
        key={loaded && !routeChanging ? 'component' : 'spinner'}
        timeout={duration}
        unmountOnExit
        mountOnEnter
      >
        {(state) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {!loaded ? null : children}
          </div>
        )}
      </Transition>
    </SwitchTransition>
  );
};

PageTransition.propTypes = {
  children: node.isRequired,
  loaded: bool.isRequired,
};

export default PageTransition;
