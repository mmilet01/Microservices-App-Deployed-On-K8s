import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";

const override = css`
  display: block;
  margin: 10% auto;
  border-color: red;
`;

const LoadingComponent = (props: any) => {
  return <ClipLoader css={override} size={props.size} color={props.color} />;
};

export default LoadingComponent;
