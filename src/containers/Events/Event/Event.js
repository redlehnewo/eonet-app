import React, { Component } from "react";
import Page from "../../../components/UI/Page/Page";
import API from "../../../core/api";
import Loading from "../../../hoc/Loading";

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
                  <p>{this.state.eventDetails.closed}</p>
                </div>
              ) : null}
              <div className="form-group">
                <label>Categories</label>
                <p>
                  {this.state.eventDetails.categories
                    .map(category => category.title)
                    .join(", ")}
                </p>
              </div>
              <div className="form-group">
                <label>Sources</label>
                <ul>
                  {this.state.eventDetails.sources.map(source => {
                    return (
                      <li>
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
