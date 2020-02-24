import React from "react";

/**
 * This is just a simple data table.
 *
 *
 * @param {} props
 */
const dataTable = props => {
  const renderHeadingRow = heading => {
    let sort = null;
    if (heading.canSort && heading.touched) {
      sort = (
        <i
          className={`ml-1 fa ${
            heading.isAsc ? "fa-chevron-up" : "fa-chevron-down"
          }`}
        ></i>
      );
    }

    return (
      <th
        key={heading.id}
        scope="col"
        onClick={() => heading.canSort && props.headerClicked(heading.id)}
      >
        {heading.label} {sort}
      </th>
    );
  };

  const renderRow = row => {
    const entityData = props.headings.map((heading, index) => {
      let cellStyle = heading.cellStyle;

      let cell = null;
      if (heading.id === "actions") {
        const viewBtn = props.viewClicked ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              props.viewClicked(row);
            }}
          >
            <i className="fa fa-eye" aria-hidden="true" /> View
          </button>
        ) : null;

        const editBtn = props.editClicked ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              props.editClicked(row);
            }}
          >
            <i className="fa fa-pencil" aria-hidden="true" /> Edit
          </button>
        ) : null;

        const deleteBtn = props.deleteClicked ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              props.deleteClicked(row);
            }}
          >
            <i className="fa fa-trash-o" aria-hidden="true" /> Remove
          </button>
        ) : null;

        cell = (
          <td key={`${heading.id}-${index}`}>
            <div
              className="btn-group btn-group-sm"
              role="group"
              aria-label="Actions"
            >
              {viewBtn}
              {editBtn}
              {deleteBtn}
            </div>
          </td>
        );
      } else {
        const cellValue =
          typeof heading.renderCell === "function"
            ? heading.renderCell(row)
            : row[heading.renderCell];
        cell = (
          <td key={`${heading.id}-${index}`} style={cellStyle}>
            {cellValue}
          </td>
        );
      }
      return cell;
    });

    return <tr key={row.id}>{entityData}</tr>;
  };

  const tableHead = <tr>{props.headings.map(renderHeadingRow)}</tr>;
  const tableBody = props.rows.map(renderRow);

  return (
    <table className="table table-bordered table-hover">
      <thead className="thead-light">{tableHead}</thead>
      <tbody>{tableBody}</tbody>
    </table>
  );
};

export default dataTable;
