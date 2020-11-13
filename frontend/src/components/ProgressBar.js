/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
const ProgressBar = ({ answers }) => {
  // width - used for styling, based on number of questions answered
  const width = {
    width: `${(answers / process.env.TOTAL_QUESTIONS) * 100}%`,
  };

  return (
    <div className="h-1 bg-primary fixed top-0 left-0" style={width}>
      &nbsp;
    </div>
  );
};

export { ProgressBar };
