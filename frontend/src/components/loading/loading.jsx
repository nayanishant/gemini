import React from "react";
import ReactLoading from "react-loading";

const Loading = ({
  type = "bars",
  color = "White",
  height = 667,
  width = 375,
}) => {
  return (
    <div className="loading">
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
};

export default Loading;
