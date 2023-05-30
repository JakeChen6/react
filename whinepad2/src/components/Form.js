import { forwardRef } from "react";
import PropTypes from 'prop-types';
import FormInput from "./FormInput";
import "./Form.css"

const Form = forwardRef(({type = 'new', fields, initialData = {}, readonly = false}, ref) => {
  const formType = type;
  return (
    <form className="Form" ref={ref}>
      {Object.keys(fields).map((id) => {
        const prefilled = initialData[id];
        const {label, type, initByUser, editable, options} = fields[id];

        if (readonly) {
          if (!prefilled) {
            return null;
          }
          return (
            <div className="FormRow" key={id}>
              <span className="FormLabel">{label}</span>
                <div>{prefilled}</div>
            </div>
          );
        }
        
        return (
          <div className="FormRow" key={id}>
            <label className="FormLabel" htmlFor={id}>
              {label}
            </label>
            {(formType === 'new' && !initByUser) || (formType !== 'new' && !editable)
              ? <div>{prefilled}</div>
              : (
                <FormInput
                  id={id}
                  type={type}
                  options={options}
                  defaultValue={prefilled}
                />
              )}
          </div>
        );
      })}
    </form>
  );
});

Form.propTypes = {
  fields: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['textarea', 'input', 'year', 'number', 'side']),
      options: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  initialData: PropTypes.object,
  readonly: PropTypes.bool,
};

export default Form;
