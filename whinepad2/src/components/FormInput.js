import PropTypes from 'prop-types';

function FormInput({type = "input", defaultValue = '', options = [], ...rest}) {
  switch (type) {
    case 'year':
      return (
        <input
          {...rest}
          type="number"
          defaultValue={
            (defaultValue && parseInt(defaultValue, 10)) ||
            new Date().getFullYear()
          }
        />
      );
    case 'textarea':
      return <textarea defaultValue={defaultValue} {...rest} />;
    case 'side':
      return (
        <select defaultValue={defaultValue} {...rest} >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      );
    default:
      return <input defaultValue={defaultValue} type="text" {...rest} />;
  }
}

FormInput.propTypes = {
  type: PropTypes.oneOf(['textarea', 'input', 'year', 'number', 'side']),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array,
}

export default FormInput;
