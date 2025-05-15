import React, { useState } from "react";

type ToggleProps = {
  options: string[];
  onToggle: (value: string) => void;
};
const Toggle = ({ options, onToggle }: ToggleProps) => {
  const [selected, setSelected] = useState<string>(options[0]);
  return (
    <div className="w-full flex items-center justify-between bg-bg-alt rounded-full p-1">
      {options.map((option) => {
        return (
          <div
            key={option}
            className={`${
              selected === option
                ? "bg-matchita-400 text-white"
                : "bg-transparent text-matchita-900"
            } w-full rounded-full text-center p-2`}
            onClick={() => {
              setSelected(option);
              onToggle(option);
            }}
          >
            {option}
          </div>
        );
      })}
      {/* <div className={`${selected === "option 1" ? "bg-matchita-400 text-white": "bg-transparent text-matchita-900"} w-full rounded-full text-center p-2`}  onClick={() => setSelected("option 1")}>Option 1</div>
      <div className={`${selected === "option 2" ? "bg-matchita-400 text-white": "bg-transparent text-matchita-900"} w-full rounded-full text-center p-2 `} onClick={() => setSelected("option 2")}>Option 2</div> */}
    </div>
  );
};

export default Toggle;
