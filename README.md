# Inventory System

A simple, state-driven inventory management application built with **vanilla JavaScript** and deployed using **GitHub Pages**.

This project focuses on **core software engineering fundamentals**: state management, derived state, persistence, and clean UI rendering — without relying on frameworks.

🔗 **Live Demo:**  
https://beardednerd92.github.io/Inventory-System/

---

## Features

- Add inventory items with validation
- Delete items from inventory
- Persistent data using `localStorage`
- Low-stock warnings based on quantity thresholds
- Empty-state messaging when no inventory exists
- Fully client-side, framework-free implementation

---

## Why This Project Exists

The goal of this project is to **understand how systems work under the hood**, rather than abstracting behavior away behind frameworks.

This app was intentionally built with:
- No frameworks
- No libraries
- Explicit state management
- Clear separation between application state and derived UI state

The result is a small but realistic system that mirrors how larger applications behave.

---

## Technical Highlights

### Application State
The inventory array is the **single source of truth** for the application.  
All UI rendering is derived from this state.

### Derived State
Low-stock warnings are **computed at render time**, not stored.  
This avoids stale data and state divergence.

### Persistence
Inventory data is persisted using `localStorage` and restored on page load.

### Validation
- Product names are trimmed and required
- Quantity must be a positive integer
- Invalid input is safely rejected
- qty is a non-negative integer

---

## Tech Stack

- HTML
- Vanilla JavaScript
- Git & GitHub
- python server (no framework)
- GitHub Pages (deployment)

---

## Project Structure

```
Inventory-System/
├── index.html
├── style.css
├── js/app.js
└── README.md
```

---

## Future Improvements

Planned enhancements (intentionally deferred to keep scope focused):

- Visual styling and UX polish
- Item IDs instead of array indexes
- Client–server architecture (Node.js + database)
- Data persistence via API instead of `localStorage`
- Improved accessibility and feedback messages

---

## What This Project Demonstrates

- State-driven UI design
- Clean event handling
- Derived state vs stored state
- Safe persistence patterns
- Professional Git workflow (feature branches, clean merges, tags)

---

## Author

**Nick**  
Aspiring Software Engineer  
Focused on fundamentals, systems thinking, and long-term growth
