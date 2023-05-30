import PropTypes from 'prop-types';

function FormInput({ type = 'input', defaultValue = '', ...rest }) {
  switch (type) {
    case 'textarea':
      return <textarea defaultValue={defaultValue} {...rest} />;
    case 'side':
      return (
        <select defaultValue={defaultValue} {...rest}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      );
    default:
      return <input type='text' defaultValue={defaultValue} {...rest} />;
  }
}

FormInput.propTypes = {
  type: PropTypes.oneOf(['input', 'textarea', 'number', 'side']),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FormInput;
