import React, { useState } from "react";

import classNames from "classnames";
import { Link } from "react-router-dom";
import NavigationItems from "../NavigationItems/NavigationItems";

const Toolbar = props => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <Link to="/" className="navbar-brand">
          EONET
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={classNames("navbar-toggler", {
            collapsed: !isOpen
          })}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={classNames("collapse", "navbar-collapse", {
            show: isOpen
          })}
        >
          <NavigationItems />
        </div>
      </nav>
    </header>
  );
};

export default Toolbar;
