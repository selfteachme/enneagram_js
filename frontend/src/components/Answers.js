import React from "react";

const Answers = ({ className, disabled, handleClick }) => {
  return (
    <div className="flex my-2 md:my-8  justify-center {className}">
      <button
        className={`answer ${disabled && `disabled`}`}
        onClick={() => handleClick(1)}
      >
        Never
      </button>
      <button
        className={`answer ${disabled && `disabled`}`}
        onClick={() => handleClick(2)}
      >
        Meh
      </button>
      <button
        className={`answer ${disabled && `disabled`}`}
        onClick={() => handleClick(3)}
      >
        50/50
      </button>
      <button
        className={`answer ${disabled && `disabled`}`}
        onClick={() => handleClick(4)}
      >
        Sure
      </button>
      <button
        className={`answer ${disabled && `disabled`}`}
        onClick={() => handleClick(5)}
      >
        100%
      </button>
    </div>
  );
};

export { Answers };
