import React from "react";
import classNames from "classnames";

const input = (props, ref) => {
  const {
    elementType,
    elementConfig,
    value,
    invalid,
    shouldValidate,
    touched,
    validation,
    validationErrorMessage,
    changed
  } = props;

  let inputElement = null;
  let isInvalid = shouldValidate && invalid && touched;

  switch (elementType) {
    case "radio":
      inputElement = elementConfig.options.map(option => (
        <div className="form-check" key={option.value}>
          <input
            className="form-check-input"
            type="radio"
            name={elementConfig.name}
            id={`${elementConfig.name}-${option.value}`}
            checked={option.value === value}
            value={option.value}
            onChange={changed}
          />
          <label
            className="form-check-label"
            htmlFor={`${elementConfig.name}-${option.value}`}
          >
            {option.label}
          </label>
        </div>
      ));
      break;

    case "select":
      inputElement = (
        <select
          className={classNames("form-control", { "is-invalid": isInvalid })}
          id={elementConfig.id}
          value={props.value}
          onChange={changed}
          ref={ref}
        >
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;

    case "date":
      inputElement = (
        <input
          type="date"
          className="form-control"
          {...elementConfig}
          ref={ref}
          value={value}
          onChange={changed}
        />
      );
      break;

    default:
      inputElement = (
        <input
          className={classNames("form-control", { "is-invalid": isInvalid })}
          {...elementConfig}
          ref={ref}
          value={value}
          onChange={changed}
        />
      );
  }

  let requiredElement = null;
  if (validation && validation.required) {
    requiredElement = <span style={{ color: "blue" }}>*</span>;
  }

  let validationError = null;
  if (touched && invalid && validationErrorMessage) {
    validationError = (
      <div className="invalid-feedback">{validationErrorMessage}</div>
    );
  }
  return (
    <div className="form-group">
      <label htmlFor={props.id}>
        {props.label} {requiredElement}
      </label>
      {inputElement}
      {validationError}
    </div>
  );
};

export default React.forwardRef(input);
