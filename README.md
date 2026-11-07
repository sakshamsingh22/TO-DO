# FocusList

A lightweight, browser-based to-do app for capturing tasks, staying focused, and tracking what is still pending.

## Features

- Add tasks with a 120-character limit and duplicate-title validation
- Mark tasks as complete or active
- Filter the list by **All**, **Active**, and **Completed**
- Edit tasks and delete them with a confirmation dialog
- Clear all completed tasks
- Switch between light and dark themes
- View total and pending task counts
- Persist tasks and theme preferences in browser `localStorage`

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Web Storage API

No framework, package installation, build step, or backend service is required.

## Run locally

Clone the repository:

```bash
git clone https://github.com/sakshamsingh22/TO-DO.git
cd TO-DO
```

Open `index.html` directly in a browser, or start a local static server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Project structure

```text
TO-DO/
├── index.html   # App structure and accessible controls
├── style.css    # Layout, themes, and responsive styling
├── script.js    # Task state, filters, persistence, and interactions
└── README.md
```

## Data and privacy

Tasks and theme preferences are stored locally in the current browser using `localStorage`. There is no account system or cloud synchronization. Clearing browser site data can remove saved tasks.

## Current scope and possible next steps

This is a small frontend project. Potential extensions include task due dates, keyboard shortcuts, export/import, automated browser tests, and optional cloud sync.

## Author

**Saksham Singh** · [GitHub](https://github.com/sakshamsingh22)
