import restClient from "./axios-client";
import axios from "axios";

const service = {
  getEvents: async params => {
    const { days } = params;

    let queryParam = [];

    if (typeof days !== "undefined") {
      queryParam.push(`days=${days}`);
    }

    const _getEvents = status => {
      return restClient
        .get(`/events?${[...queryParam, `status=${status}`].join("&")}`)
        .then(response => {
          return response.data.events;
        });
    };

    return axios
      .all([_getEvents("open"), _getEvents("closed")])
      .then(
        axios.spread((openEvents, closedEvents) => {
          return [...openEvents, ...closedEvents];
        })
      )
      .then(results => {
        return results.map(result => {
          //-- Get Recent Date
          let recentDate = result.geometries.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })[0].date; // Sort it in DESC order then get the recent date

          //-- Get Categories As String
          let categoriesAsString = result.categories
            ? result.categories.map(category => category.title).join(", ")
            : "";

          return {
            ...result,
            status: result.closed ? "closed" : "open",
            date: result.closed ? result.closed : recentDate,
            categoriesAsString: categoriesAsString
          };
        });
      });
  },
  getEvent: async id => {
    return restClient.get(`events/${id}`).then(response => {
      return response.data;
    });
  },
  getCategories: async () => {
    return restClient
      .get(`categories`)
      .then(response => response.data.categories);
  }
};

export default service;
