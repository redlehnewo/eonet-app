import React, { Component } from "react";
import Page from "../../../components/UI/Page/Page";
import API from "../../../core/api";
import Loading from "../../../hoc/Loading";
import moment from "moment";

export class Event extends Component {
  state = {
    eventDetails: null,
    loading: false
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({ loading: true });
    API.getEvent(id)
      .then(response => {
        this.setState({
          loading: false,
          eventDetails: response
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <Loading isLoading={this.state.loading}>
        {this.state.eventDetails ? (
          <Page title={this.state.eventDetails.title}>
            <form>
              {this.state.eventDetails.closed ? (
                <div>
                  <label>Closed</label>
                  <p>{moment(this.state.eventDetails.closed).format("L")}</p>
                </div>
              ) : null}
              <div className="form-group">
                <label>Categories</label>
                <ul>
                  {this.state.eventDetails.categories.map(category => (
                    <li key={category.id}>{category.title}</li>
                  ))}
                </ul>
              </div>
              <div className="form-group">
                <label>Sources</label>
                <ul>
                  {this.state.eventDetails.sources.map(source => {
                    return (
                      <li key={source.id}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.id}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="form-group">
                <label>Event Dates</label>
                <ul>
                  {this.state.eventDetails.geometries.map(item => {
                    return (
                      <li key={item.date}>{moment(item.date).format("L")}</li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    this.props.history.push("/");
                  }}
                >
                  Back
                </button>
              </div>
            </form>
          </Page>
        ) : null}
      </Loading>
    );
  }
}

export default Event;
