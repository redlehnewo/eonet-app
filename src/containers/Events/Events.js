import React, { Component } from "react";
import moment from "moment";

import Page from "../../components/UI/Page/Page";
import API from "../../core/api";
import Loading from "../../hoc/Loading";
import Input from "../../components/UI/Input/Input";

import DataTable from "../../components/UI/DataTable/DataTable";

export class Events extends Component {
  state = {
    loading: true,
    events: [],
    displayedEvents: [],
    days: 365,
    headerConfigs: {
      date: {
        label: "Date",
        canSort: true,
        isAsc: false,
        touched: false,
        renderCell: row => {
          return moment(row.date).format("L");
        }
      },
      title: {
        label: "Title",
        canSort: true,
        isAsc: false,
        touched: false,
        renderCell: row => {
          return row.title;
        }
      },
      categories: {
        label: "Category",
        canSort: true,
        isAsc: false,
        touched: false,
        renderCell: row => row.categoriesAsString,
        sortValue: row => row.categoriesAsString
      },
      status: {
        label: "Status",
        canSort: true,
        isAsc: false,
        touched: false,
        renderCell: row => (
          <span
            className={`badge ${
              row.status.toLowerCase() === "open"
                ? "badge-success"
                : "badge-secondary"
            }`}
          >
            {row.status}
          </span>
        ),
        cellStyle: { textTransform: "capitalize" }
      },
      actions: {
        label: "",
        canSort: false,
        isAsc: false,
        touched: false,
        renderCell: row => null
      }
    },
    filterConfigs: {
      startDate: {
        label: "Start from",
        elementType: "date",
        elementConfig: {
          id: "filterFrom",
          placeholder: "Start from"
        },
        value: moment()
          .subtract(365, "days")
          .format("YYYY-MM-DD")
      },
      endDate: {
        label: "End to",
        elementType: "date",
        elementConfig: {
          id: "filterTo",
          placeholder: "End to"
        },
        value: moment().format("YYYY-MM-DD")
      },
      status: {
        label: "Status",
        elementType: "select",
        elementConfig: {
          id: "filterStatus",
          options: [
            { value: "", label: "All status" },
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" }
          ]
        },
        value: ""
      },
      categories: {
        label: "Category",
        elementType: "select",
        elementConfig: {
          id: "filterCategories",
          options: [{ value: "", label: "All Categories" }]
        },
        value: ""
      }
    }
  };

  componentDidMount() {
    API.getCategories().then(response => {
      const categories = response.map(res => {
        return { value: res.id, label: res.title };
      });
      this.setState(prevState => {
        const updatedState = { ...prevState };
        const updatedFilterConfigs = { ...updatedState.filterConfigs };
        const updatedFilterConfig = { ...updatedFilterConfigs["categories"] };
        const updatedElemConfig = { ...updatedFilterConfig.elementConfig };
        updatedElemConfig.options = [
          ...updatedElemConfig.options,
          ...categories
        ];
        updatedFilterConfig.elementConfig = updatedElemConfig;
        updatedFilterConfigs["categories"] = updatedFilterConfig;
        updatedState.filterConfigs = updatedFilterConfigs;

        return updatedState;
      });
    });

    this.getEvents();
  }

  getEvents = (params = {}) => {
    const { days } = params;

    const apiParams = {
      days: days || this.state.days
    };

    this.setState({ loading: true });
    API.getEvents(apiParams)
      .then(response => {
        this.setState({
          events: [...response],
          displayedEvents: [
            ...this.filterEvents(response, this.state.filterConfigs)
          ],
          loading: false
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  filterEvents = (events, filterConfigs) => {
    const copyEvents = [...events];
    const filters = Object.keys(filterConfigs).map(filterConfigId => {
      return { ...filterConfigs[filterConfigId], id: filterConfigId };
    });

    const filterBy = (filterConfigId, value, event) => {
      switch (filterConfigId) {
        case "status":
          return (
            !value.length || value.toLowerCase() === event.status.toLowerCase()
          );
        case "categories":
          return (
            !value.length ||
            event.categories.some(
              category =>
                parseInt(category.id) === parseInt(value.length ? value : 0)
            )
          );
        case "startDate":
          return moment(event.date) >= moment(value);
        case "endDate":
          return moment(event.date) <= moment(value);
        default:
          return true;
      }
    };

    const updatedDisplayedEvents = copyEvents.filter(event => {
      return filters.every(filter => filterBy(filter.id, filter.value, event));
    });

    return updatedDisplayedEvents;
  };

  onRowClickHandler = row => {
    this.props.history.push(`/${row.id}`);
  };

  onHeaderClickHandler = headerId => {
    const updatedHeaderConfigs = { ...this.state.headerConfigs };
    const updatedHeaderConfig = { ...updatedHeaderConfigs[headerId] };
    updatedHeaderConfig.touched = true;
    updatedHeaderConfig.isAsc = !updatedHeaderConfig.isAsc;
    updatedHeaderConfigs[headerId] = updatedHeaderConfig;

    const updatedDisplayedEvents = [...this.state.displayedEvents];
    const isAsc = updatedHeaderConfig.isAsc;

    updatedDisplayedEvents.sort((eventA, eventB) => {
      const valueA = updatedHeaderConfig.sortValue
        ? updatedHeaderConfig.sortValue(eventA)
        : eventA[headerId];
      const valueB = updatedHeaderConfig.sortValue
        ? updatedHeaderConfig.sortValue(eventB)
        : eventB[headerId];

      if (valueA > valueB) return 1 * (isAsc ? 1 : -1);
      else if (valueA < valueB) return -1 * (isAsc ? 1 : -1);
      else return 0;
    });

    this.setState({
      displayedEvents: updatedDisplayedEvents,
      headerConfigs: updatedHeaderConfigs
    });
  };

  onFilterChangeHandler = (event, filterConfigId) => {
    const updatedFilterConfigs = { ...this.state.filterConfigs };
    const updatedFilterConfig = { ...updatedFilterConfigs[filterConfigId] };
    updatedFilterConfig.value = event.target.value;
    updatedFilterConfigs[filterConfigId] = updatedFilterConfig;

    //-- Filter Start Date is special since this also controls when to fetch new date
    //--  in the API.
    if (filterConfigId === "startDate") {
      const daysDiff = Math.floor(
        (new Date() - new Date(event.target.value)) / (1000 * 3600 * 24)
      );

      if (daysDiff > this.state.days) {
        this.setState({
          filterConfigs: updatedFilterConfigs, //-- Update Filters
          days: daysDiff //-- Update new start days
        });
        this.getEvents({ days: daysDiff });
        return;
      }
    }

    this.setState({
      filterConfigs: updatedFilterConfigs,
      displayedEvents: this.filterEvents(
        this.state.events,
        updatedFilterConfigs
      )
    });
  };

  render() {
    const renderFilter = Object.keys(this.state.filterConfigs).map(configId => {
      const filterConfig = this.state.filterConfigs[configId];
      return (
        <div className="mr-3" key={configId}>
          <Input
            label={filterConfig.label}
            elementType={filterConfig.elementType}
            elementConfig={filterConfig.elementConfig}
            changed={event => this.onFilterChangeHandler(event, configId)}
            value={filterConfig.value}
          />
        </div>
      );
    });

    let headers = Object.keys(this.state.headerConfigs).map(headerConfigId => {
      return {
        ...this.state.headerConfigs[headerConfigId],
        id: headerConfigId
      };
    });

    return (
      <Page title="Events">
        <div className="container">
          <div className="d-lg-flex flex-lg-row mb-3">{renderFilter}</div>
          <Loading isLoading={this.state.loading}>
            <div className="table-responsive">
              <DataTable
                headings={headers}
                rows={this.state.displayedEvents}
                headerClicked={this.onHeaderClickHandler}
                viewClicked={this.onRowClickHandler}
              />
            </div>
          </Loading>
        </div>
      </Page>
    );
  }
}

export default Events;
