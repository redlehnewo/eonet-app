import React from "react";

const loading = props => {
  return props.isLoading ? <p>Loading ...</p> : props.children;
};

export default loading;
