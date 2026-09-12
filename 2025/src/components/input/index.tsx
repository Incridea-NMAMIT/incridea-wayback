import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  additionalclasses?: string;
};

export const TextInput = (props: Props) => {
  return (
    <input
      type={"text"}
      className={`${props.additionalclasses} h-10 rounded-lg border-gray-500 bg-gray-600 px-4 pr-16 text-sm ring-gray-500 focus:outline-none focus:ring-2`}
      {...props}
    />
  );
};

export const NumberInput = (props: Props) => {
  return (
    <input
      type={"number"}
      className="h-10 rounded-lg border-gray-500 bg-gray-600 px-4 pr-16 text-sm ring-gray-500 focus:outline-none focus:ring-2"
      {...props}
    />
  );
};
