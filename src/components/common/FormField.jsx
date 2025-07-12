// components/common/FormField.jsx
import React from 'react';

const FormField = ({ label, type, value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormField;