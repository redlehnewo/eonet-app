import React from "react";

import { Link } from "react-router-dom";

const navigationItem = props => {
  return (
    <li className="nav-item active">
      <Link to={props.link} className="nav-link">
        {props.children}
      </Link>
    </li>
  );
};

export default navigationItem;
