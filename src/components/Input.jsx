import React, { forwardRef } from "react";

/* forwardRef to this component to pass ref -- because I don't use input directly with register from react hook form */
const Input = forwardRef((props, ref) => {
  const { label, icon, ...rest } = props;
  return (
    <label>
      {label && <span>{label}</span>}
      {icon}
      <input className={`input`} {...rest} ref={ref} />
    </label>
  );
});

export default Input;
