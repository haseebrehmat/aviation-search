# ✈️ Aviation Search App

Welcome to the **Aviation Search App**! This project allows users to search for flights, filter results, and view flight details in an intuitive interface.

## 🚀 Features

- Search for flights with filters
- Interactive flight map
- State management with React hooks

## 📋 Pre-requisites

Ensure you have the following installed before running the project:
- Node.js (v14 or later)
- npm or yarn package manager

## 📦 Libraries Used

- React
- React Router
- Axios (for API calls)
- Zustand (for state management)
- Material-UI (for UI components)
- ESLint & Prettier (for code formatting)

## 📂 Project Overview

| Folder                | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `src/`                | Main source folder containing the application entry point.           |
| `components/`         | Contains reusable UI components like Flight Search and Flight Cards. |
| `components/Filters/` | Includes filter-related subcomponents.                               |
| `lib/`                | Utility functions and constants for the app.                         |
| `api/`                | Handles API calls related to flight data.                            |
| `store/`              | Manages state with React hooks for flights and filters.              |

## 🧩 Components Breakdown

| Component      | File                                    | Description                                              |
| -------------- | --------------------------------------- | -------------------------------------------------------- |
| FlightMap      | `components/FlightMap.js`               | Displays an interactive map with flight routes.          |
| FlightCard     | `components/FlightCard.js`              | Shows individual flight details in a card format.        |
| SearchForm     | `components/SearchForm.js`              | Allows users to input search criteria for flights.       |
| FlightSearch   | `components/FlightSearch.js`            | Manages the search functionality and integrates filters. |
| PassengerCount | `components/Filters/PassengerCount.jsx` | Handles passenger count filter.                          |
| Advanced       | `components/Filters/Advanced.jsx`       | Contains advanced filtering options.                     |
| Basic          | `components/Filters/Basic.jsx`          | Provides basic filtering options.                        |

## 📂 Folder Breakdown

### `components/Filters/`
This folder includes subcomponents related to filtering flight search results.

| Component        | File                          | Description                                      |
| ---------------- | ----------------------------- | ------------------------------------------------ |
| PassengerCount   | `PassengerCount.jsx`          | Handles passenger count filter.                  |
| Advanced         | `Advanced.jsx`                | Contains advanced filtering options.             |
| Basic            | `Basic.jsx`                   | Provides basic filtering options.                |

### `lib/`
This folder contains utility functions and constants used throughout the app.

| File             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `constants.js`   | Defines constants used across the application.   |
| `utils.js`       | Contains utility functions for various purposes. |

### `api/`
This folder handles API calls related to flight data.

| File             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `api.js`         | Contains functions to make API calls for flights.|

### `store/`
This folder manages state with React hooks for flights and filters.

| File             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `useFilters.js`  | Custom hook for managing filter state.           |
| `useFlights.js`  | Custom hook for managing flight data state.      |

## 📦 Installation

```sh
npm install◊
```

## ▶️ Running the App

```sh
npm start
```

## 🛠️ Code Quality

This project uses ESLint and Prettier for code formatting and linting.

```sh
npm run lint
npm run format
```

Happy coding! 🚀