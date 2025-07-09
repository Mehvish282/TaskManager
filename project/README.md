# Task Manager - Full Stack Application

A modern task management application built with Angular frontend and .NET Core Web API backend.

## Features

- **Authentication**: JWT-based authentication with secure login/logout
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status and priority
- **Dashboard**: Overview with statistics and recent tasks
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Automatic refresh of task lists after operations

## Technology Stack

### Frontend (Angular)
- Angular 20
- TypeScript
- RxJS for reactive programming
- Modern CSS with gradients and animations
- Responsive design

### Backend (.NET Core)
- .NET 8.0 Web API
- Entity Framework Core
- SQL Server (LocalDB for development)
- JWT Authentication
- Swagger/OpenAPI documentation
- Identity Framework

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- .NET 8.0 SDK
- SQL Server or SQL Server Express LocalDB

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd TaskManager.API
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Update the database:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7001` and `http://localhost:5001`.

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The Angular app will be available at `http://localhost:4200`.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/statistics` - Get task statistics

## Default Login Credentials

- **Email**: admin@taskmanager.com
- **Password**: password

## Database Schema

The application uses Entity Framework Code First with the following main entities:

- **User**: Extends IdentityUser with additional properties
- **TaskItem**: Main task entity with relationships
- **Category**: Task categorization (optional)

## Development Notes

- The API uses JWT tokens for authentication
- CORS is configured to allow requests from the Angular development server
- The database is seeded with sample data on first run
- Swagger UI is available at `/swagger` when running in development mode

## Production Deployment

1. Update connection strings in `appsettings.Production.json`
2. Update API URL in Angular environment files
3. Build Angular app: `ng build --prod`
4. Publish .NET API: `dotnet publish -c Release`
5. Deploy both applications to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.