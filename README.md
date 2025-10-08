# FoodApp - Recipe Sharing Platform

This is a full-stack recipe sharing application built with React and Manifest.

## Features

- **User Authentication**: Secure user sign-up and login.
- **Recipe Management**: Create, read, update, and delete recipes.
- **Image Uploads**: Attach a photo to each recipe.
- **Ownership**: Users can only edit or delete their own recipes.
- **Public Viewing**: All published recipes are visible to everyone.
- **Responsive Design**: Works on all devices, from mobile to desktop.

## Backend (Manifest)

The backend is powered by Manifest, which automatically generates a REST API, database, and admin panel based on a simple YAML schema.

- **Entities**: `User`, `Recipe`
- **Authentication**: The `User` entity is `authenticable`.
- **Relationships**: A `Recipe` `belongsTo` a `User` (as `author`).
- **File Storage**: The `photo` property on `Recipe` uses `type: image` for handling uploads.
- **Access Control**: Policies are defined to control who can perform which actions (e.g., only the author can update a recipe).

## Frontend (React)

The frontend is a single-page application built with React and Vite, styled with Tailwind CSS.

- **SDK Integration**: All backend communication is handled through the `@mnfst/sdk`.
- **No Redux/Context**: State management is handled with React's built-in hooks (`useState`, `useEffect`).
- **Component Structure**: The app is divided into `screens` for main pages and `components` for reusable UI elements like the `ImageUploader`.
- **Feature-Aware UI**: The frontend dynamically renders components based on backend features, such as the image uploader for the `image` type and ownership-based controls.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Running Locally

1.  **Start the Backend**: Follow the Manifest documentation to deploy the backend service.
2.  **Configure Frontend**: Create a `.env.local` file in the root of the frontend project and add your backend URL:
    ```
    VITE_BACKEND_URL=your-manifest-backend-url
    ```
3.  **Install Dependencies**: `npm install`
4.  **Run Development Server**: `npm run dev`
5.  Open your browser to `http://localhost:5173`.

### Admin Panel

Access the auto-generated admin panel at `your-manifest-backend-url/admin`.

- **Default Admin**: `admin@manifest.build`
- **Default Password**: `admin`
