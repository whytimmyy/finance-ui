# Finance Dashboard UI

A simple and interactive finance dashboard built with React to track income, expenses, and spending insights.

## Features

* Dashboard summary (Balance, Income, Expenses)
* Transactions list with filtering
* Add transactions (Admin role)
* Role-based UI (Viewer/Admin)
* Insights (highest spending, monthly comparison)
* Pie chart for spending breakdown
* Dark mode support
* Mock API using JSON Server

## Tech Stack

* React (Vite)
* JavaScript
* CSS
* Recharts
* JSON Server

## Setup

```bash
npm install
npm run dev
npx json-server --watch db.json --port 3001
```

## Usage

* Frontend: http://localhost:5173
* API: http://localhost:3001/transactions

## Approach

* Used React hooks for state management
* Separated logic into `logic.js`
* Used mock API for data handling
* Focused on clean UI and simple UX

## Future Improvements

* Edit/Delete transactions
* Better filtering/search
* More charts

