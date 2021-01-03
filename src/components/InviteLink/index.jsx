import React from 'react';
import { string } from 'prop-types';
import { FaShare } from 'react-icons/fa';
import cn from 'classnames';
import SweetAlert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import copy from 'copy-to-clipboard';

import Button from '../Button';

import styles from './styles.module.scss';

const Swal = withReactContent(SweetAlert);

const InviteLink = ({
  className,
}) => {
  const showInviteLink = async () => {
    const { href } = window.location;

    await Swal.fire({
      text: 'Copy the link below to the clipboard or use one of the social share buttons.',
      html: (
        <>
          <p
            className="mb-2"
          >
            Share the link below to invite someone to the game.
          </p>
          <p
            className={cn(
              styles['invite-link__url'],
            )}
          >
            {window.location.href}
          </p>
        </>
      ),
      confirmButtonText: 'Copy to clipboard',
    });

    copy(href);
  };

  return (
    <Button
      variant="inverted"
      className={cn(
        styles['invite-link'],
        className,
      )}
      onClick={showInviteLink}
    >
      <p
        className="mr-2"
      >
        Invite link
      </p>
      <FaShare />
    </Button>
  );
};

InviteLink.defaultProps = {
  className: null,
};

InviteLink.propTypes = {
  className: string,
};

export default InviteLink;
