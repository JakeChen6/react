import { useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from './Button';
import './Dialog.css';

function Dialog(props) {
  const {
    header,
    modal = false,
    extendedDismiss = true,
    confirmLabel = 'ok',
    onConfirm = () => {},
    onDismiss = () => {},
    hasCancel = true,
  } = props;

  useEffect(
    () => {
      function dismissClick(e) {
        if (e.target.classList.contains('DialogModal')) {
          onDismiss();
        }
      }

      function dismissKey(e) {
        if (e.key === 'Escape') {
          onDismiss();
        }
      }

      if (modal) {
        document.body.classList.add('DialogModalOpen');
        if (extendedDismiss) {
          document.body.addEventListener('click', dismissClick);
          document.addEventListener('keydown', dismissKey);
        }
      }
      return () => {
        document.body.classList.remove('DialogModalOpen');
        document.body.removeEventListener('click', dismissClick);
        document.removeEventListener('keydown', dismissKey);
      };
    },
    [modal, onDismiss, extendedDismiss]
  );

  return (
    <div className={classNames({
      'Dialog': true,
      'DialogModal': modal,
    })}>
      <div className={modal ? 'DialogModalWrap' : null}>
        <div className='DialogHeader'>{header}</div>
        <div className="DialogBody">{props.children}</div>
        <div className='DialogFooter'>
          {hasCancel ? (
            <Button className='DialogDismiss' onClick={() => onDismiss()}>
              Cancel
            </Button>
          ) : null}
          <Button onClick={() => hasCancel ? onConfirm() : onDismiss()}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

Dialog.propTypes = {
  header: PropTypes.string.isRequired,
  modal: PropTypes.bool,
  extendedDismiss: PropTypes.bool,
  confirmLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
  hasCancel: PropTypes.bool,
};

export default Dialog;
