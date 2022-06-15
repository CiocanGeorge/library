import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Keywords = (props) => {
  const { label, keywords, setKeywords, ...rest } = props;
  const [value, setValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && value.length > 0) {
      setKeywords((k) => k.concat([{ name: value, description: value }]));
      setValue("");
    }
  };

  const handleRemoveKeyword = (id) =>
    setKeywords((keywords) => keywords.filter((_, index) => index !== id));

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <label>
        {label && <span>{label}</span>}
        <input
          {...rest}
          value={value}
          onChange={handleChange}
          className={`input`}
          onKeyDown={handleKeyDown}
        />
      </label>
      {keywords.length > 0 && (
        <div className="keyword-list">
          {keywords.map((keyword, index) => (
            <span key={index} onClick={() => handleRemoveKeyword(index)}>
              {keyword.name} <MdOutlineClose />
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default Keywords;
