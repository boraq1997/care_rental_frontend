🚗 Vehicle Booking Management System – Frontend

This repository contains the Frontend of the Vehicle Booking Management System for managing vehicles, centers, customers, bookings, and financial accounts.
	•	Framework: Vue.js 3
	•	Bundler: Vite
	•	UI Library: PrimeVue
	•	Layout & Responsiveness: PrimeFlex
	•	Icons: FontAwesome
	•	State Management: Pinia (or Vuex)
	•	API Communication: Axios

The frontend communicates with the Laravel 12 backend via RESTful API.

🔹 Features
	•	User Management: Add, edit, delete users, assign roles and permissions.
	•	Customer Management: Maintain customer profiles and booking history.
	•	Vehicle Management: Manage vehicles, track status (available, booked, maintenance), and movements.
	•	Centers Management: Handle multiple branches, assign vehicles and staff.
	•	Booking System: Create and manage bookings, track status (active, completed, canceled).
	•	Financial Accounts: Track payments, refunds, balances, and generate reports.
	•	Responsive Design: Works on desktop, tablet, and mobile devices.
	•	UI Components: Uses PrimeVue components for tables, forms, buttons, dialogs, etc.
	•	Icons: FontAwesome for visual clarity and action buttons.


🔹 Installation & Running Locally
  # Clone the repository
git clone https://github.com/<username>/vehicle-booking-frontend.git
cd vehicle-booking-frontend

# Install dependencies
npm install

# Run development server
npm run dev

The application will be available at: http://localhost:5173/

⸻

🔹 Notes
	•	The frontend communicates with the backend API for all CRUD operations.
	•	Ensure the backend API is running and accessible. Update the API base URL in services/*.js files or in an environment file.
	•	Use Pinia or Vuex to manage global state for users, vehicles, bookings, and accounts.

⸻

🔹 Contribution Guidelines
	1.	Open an issue for new features or bugs.
	2.	Fork the repository.
	3.	Create a feature branch: git checkout -b feature/your-feature.
	4.	Submit a Pull Request for review.

  
