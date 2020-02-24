import React from "react";
import classNames from "classnames";

const pagination = props => {
  const { page, pageSize, totalItems } = props;

  const totalPages = Math.ceil(totalItems / pageSize);

  let pageItems = [];

  for (let index = 0; index < totalPages; index++) {
    const pageNumber = index + 1;
    const isCurrentPage = page === pageNumber;
    const currentSpan = isCurrentPage ? (
      <span className="sr-only">(current)</span>
    ) : null;

    pageItems.push(
      <li
        className={classNames("page-item", {
          active: isCurrentPage
        })}
        key={index}
      >
        <button
          type="button"
          className="page-link"
          onClick={() => {
            props.pageChanged(pageNumber);
          }}
        >
          {pageNumber} {currentSpan}
        </button>
      </li>
    );
  }

  const prevBtn = (
    <li className={classNames("page-item", { disabled: page <= 1 })}>
      <button
        type="button"
        className="page-link"
        tabIndex="-1"
        onClick={() => props.pageChanged(page - 1)}
      >
        Previous
      </button>
    </li>
  );

  const nextBtn = (
    <li
      className={classNames("page-item", {
        disabled: page >= totalPages
      })}
    >
      <button
        type="button"
        className="page-link"
        onClick={() => props.pageChanged(page + 1)}
      >
        Next
      </button>
    </li>
  );

  return (
    <ul className="pagination justify-content-end">
      {prevBtn}
      {pageItems}
      {nextBtn}
    </ul>
  );
};

export default pagination;
