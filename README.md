# Fluke front-end developer recruitment task

The provided app is built using [create-react-app](https://github.com/facebook/create-react-app). See its documentation for more details.

Useful npm scripts:

```bash
npm install   # download the dependencies
npm start     # run the app using webpack-dev-server
```

## Running the Project

1. run `npm install`
2. run `npm start`
3. On the browser, go to `localhost:3000`

## Tasks

### Events List

- As a user, I want to be able to see the list of EONET (Earth Observatory Natural Events Tracker) events
  - The returned list of events should contain the Open and Closed events and be styled according to the status (Open or Closed)
  - The returned list displays the date, title, category and status of the event
  - The returned list initially contains all the events 1 year from now.

### Filter

- As a user, I want to be able to filter the list of events by date, status, and/or category
  - The user can filter the start date of the events
  - The user can filter the end date of the events
  - The user can filter the status of the events
  - The user can filter the category of the events

### Sorting

- As a user, I want to be able to sort the list of events by date, status, and/or category.

### Event Details

- As a user, I want to be able to select a specific event and see its details.
