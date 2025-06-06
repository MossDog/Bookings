# Bookings

A modern web application for managing bookings, tailored for sprouting businesses and service providers. This project includes a web client built with React, TypeScript, Vite, and Tailwind CSS, and a NestJS backend (server setup in progress).

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Scripts](#scripts)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Features
- User authentication (sign up, login, protected routes)
- Seller account creation and management
- Image upload and gallery widgets
- Service listing widgets
- Responsive UI with Tailwind CSS and DaisyUI
- Supabase integration for authentication and storage

## Project Structure
```
Bookings/
├── LICENSE
├── package.json
├── README.md
├── start-app.bat / start-app.sh
├── server/                # NestJS backend (WIP)
│   ├── app.js
│   └── package.json
└── web-client/            # React frontend
    ├── public/            # Static assets
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── types/         # TypeScript types
    │   ├── utils/         # Utility functions
    │   └── index.css      # Tailwind CSS
    ├── package.json
    └── ...
```

## Contributing

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Bookings
```

### 2. Install dependencies
#### For the web client:
```sh
cd web-client
npm install
```
#### For the server (if used):
```sh
cd ../server
npm install
```

### 3. Set up environment variables
- Copy `.env.example` to `.env` in both `web-client/` and `server/` (if present).
- Fill in the required values (e.g., Supabase keys, API URLs).
- If `.env.example` does not exist, create one with placeholder values for all required environment variables.

### 4. Start the development servers
#### Web client:
```sh
cd web-client
npm run dev
```
#### Server (Not yet in development):
```sh
cd ../server
npm start
```

Or use the provided batch/shell scripts from the root directory:
```sh
./start-app.sh   # Linux/Mac
start-app.bat    # Windows
```

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Scripts
- `npm run dev` – Start the frontend in development mode
- `npm run build` – Build the frontend for production
- `npm start` – Start the backend server (if implemented)
- `npm run lint` – Run ESLint to check code style
- `npm test` – Run tests (not yet implemented)

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, DaisyUI
- **Backend:** NestJS (WIP)
- **Auth/Storage:** Supabase
- **Other:** ESLint, Prettier

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.