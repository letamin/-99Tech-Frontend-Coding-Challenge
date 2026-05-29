# 99Tech Code Challenge

This repository contains my solutions for the 99Tech coding challenge. The project is organized into three separate problem sets, covering algorithmic logic, frontend form development, and React architecture/refactoring.

---

## 📂 Repository Structure
```text
.
└── src/
    ├── problem1/
    │   └── solution.js             # Three distinct ways to sum to n
    ├── problem2/
    │   ├── public/                 # React static assets
    │   ├── src/                    # React application source (Fancy Form)
    │   ├── package.json
    │   └── ...                     # Vite/React boilerplate configurations
    └── problem3/
        ├── explain.md              # Detailed breakdown of bugs and inefficiencies
        └── refactored-version.tsx  # Clean, optimized, and type-safe React code
```

🚀 Getting Started & Execution

* **Problem 1: Three ways to sum to n**
This contains three JavaScript functions implementing different computational approaches to solve the summation problem.

How to run/test:
You can run this file directly using Node.js to verify the logic.

---

* **Problem 2: Fancy Form**
A fully interactive currency switcher/converter application built using React and TypeScript (bundled with Vite). It features real-time exchange rate calculations, token selection, and form validation.

How to run:

## 1. Navigate to the project directory:
cd src/problem2

## 2. Install the dependencies:
npm install (or yarn install / pnpm install)

## 3. Start the local development server:
npm run dev

## 4. Open the local address (usually http://localhost:5173) in your browser.

---

* **Problem 3: Messy React**
An analysis and refactoring exercise of a production-level React component handling cryptocurrency wallet balances.

Reviewing the code:

Read src/problem3/explain.md for a comprehensive code review detailing identified anti-patterns, TypeScript errors, and computational inefficiencies in the original code.

Open src/problem3/refactored-version.tsx to view the optimized, type-safe, and clean implementation of the component.
