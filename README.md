# Human Resource Management System (HRMS)

A full-stack Human Resource Management System featuring a React frontend and Flask backend.

## Project Structure

The project is organized into two main directories:

- `client/`: Frontend application built with React, Tailwind CSS, Nivo Charts, and Lucide icons
- `server/`: Backend API built with Flask, SQLAlchemy, and JWT authentication

## Features

- **Employee Management**: Add, view, update, and remove employee records
- **Department Management**: Manage company departments
- **Job Position Management**: Handle job titles, descriptions, and salary ranges
- **Dashboard**: Visualize HR data with interactive charts
- **Authentication**: Secure user authentication and authorization
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend (client)
- React 18.2.0
- Tailwind CSS 3.4.1
- Nivo Charts 0.84.0
- Lucide React Icons 0.335.0
- React Router DOM 6.22.1
- Axios for API communication

### Backend (server)
- Flask 2.3.3
- SQLAlchemy 2.0.25
- Flask-JWT-Extended 4.5.3
- Marshmallow 3.20.1
- SQLite (default)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Python 3.8 or higher
- npm or yarn package manager
- pip (Python package installer)

### Running the Frontend

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

The frontend will be available at http://localhost:3000

### Running the Backend

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with configuration:
   ```
   FLASK_APP=run.py
   FLASK_ENV=development
   FLASK_DEBUG=1
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   ```

5. Initialize and seed the database:
   ```
   flask init-db
   flask seed-db
   ```

6. Start the Flask server:
   ```
   flask run
   ```

The backend API will be available at http://localhost:5000/api

## Demo Credentials

- Email: admin@example.com
- Password: password

## License

This project is licensed under the MIT License - see the LICENSE file for details. 