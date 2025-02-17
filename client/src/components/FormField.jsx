import React from "react";

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) => {
  console.log(placeholder);
  return (
    <div>
      <div className="block items-center gap-2 mb-2">
      <div className="flex justify-start gap-3">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-50"
        >
          {labelName}
        </label>
    
        {isSurpriseMe && (
          <button
            type="button"
            onClick={() => {handleSurpriseMe()}}
            className="font-semibold text-xs bg-[#8B38D7] py-1 px-2 rounded-[5px] text-black"
          >
            Surprise Me
          </button>
          
        )}
        </div>
      </div>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        className="bg-gray-50 border border-gray-300 text-gray-950 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none w-full p-5"
      />
    </div>
  );
};

export default FormField;
