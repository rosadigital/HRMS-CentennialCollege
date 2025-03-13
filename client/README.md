# HRMS Client

Frontend application for the Human Resource Management System (HRMS). Built with React, Tailwind CSS, Nivo charts, and Lucide icons.

## Features

- Employee Management
- Department Management
- Job Position Management
- Dashboard with Analytics
- User Authentication
- Responsive Design

## Tech Stack

- React 18.2.0
- React Router DOM 6.22.1
- Tailwind CSS 3.4.1
- Nivo Charts 0.84.0
- Lucide React 0.335.0
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```
   cd client
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Create a `.env` file in the root of the client directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

To start the development server:

```
npm start
```

or

```
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Folder Structure

```
client/
├── public/                # Static files
├── src/
│   ├── assets/            # Images, icons and other assets
│   ├── components/        # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components
│   │   ├── dashboard/     # Dashboard specific components
│   │   ├── employee/      # Employee related components
│   │   ├── department/    # Department related components
│   │   ├── job/           # Job related components
│   │   └── profile/       # User profile components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── styles/            # CSS and style configurations
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   └── index.js           # Entry point
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Build for Production

To build the application for production:

```
npm run build
```

or

```
yarn build
```

The build artifacts will be located in the `build` folder.

## Demo Credentials

- Email: admin@example.com
- Password: password 