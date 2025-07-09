# 🗂️ TaskManager App

A full-stack Task Management system built with **Angular** (frontend) and **ASP.NET Core** (backend), featuring user authentication, email-based password reset, and role-based task control.

---

## 🔧 Technologies Used

| Layer     | Technology              |
|-----------|--------------------------|
| Frontend  | Angular (TypeScript)     |
| Backend   | ASP.NET Core Web API     |
| Database  | SQL Server / EF Core     |
| Auth      | ASP.NET Identity          |
| Email     | SMTP via SendGrid/Gmail  |

---

## ⚙️ Features

- ✅ User Signup / Login
- 🔒 Role-based Authorization
- 🔁 Forgot Password with Email Reset Link
- 📌 Create, Update, Delete Tasks
- 📅 Task List by User
- 📬 SMTP Email Integration
- 🔐 Environment-based Config (no hardcoded secrets)

---

## 🚀 Project Structure

```
TaskManager/
├── project/               # Angular frontend
│   └── src/...
├── TaskManager.API/       # ASP.NET Core backend
│   └── Controllers/
│   └── Services/
│   └── Models/
├── README.md
├── .gitignore
└── appsettings.Development.json (local)
```

---

## 🧪 How to Run the Project

### ✅ Prerequisites
- [.NET 7+ SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js & npm](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- SQL Server (local or cloud)

---

### 🔙 Backend (ASP.NET Core)

```bash
cd TaskManager.API
dotnet restore
dotnet ef database update      # Apply migrations
dotnet run
```

> Backend runs on: https://localhost:5001/

---

### 🔜 Frontend (Angular)

```bash
cd project
npm install
ng serve
```

> Frontend runs on: http://localhost:4200/

---

## 🔐 Configuration

### 📁 Backend `appsettings.json` Example

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_sql_server_connection_string"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.sendgrid.net",
    "Port": 587,
    "SenderEmail": "your@email.com",
    "SenderName": "TaskManager",
    "Username": "apikey",
    "Password": "your_sendgrid_api_key"
  }
}
```

> Copy this into `appsettings.Development.json` and **never commit real secrets**.

---

## 📦 Deployment Options

- **Frontend**:
  - [Vercel](https://vercel.com/) or [GitHub Pages](https://pages.github.com/)
- **Backend**:
  - [Render](https://render.com/)
  - [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)

---

## 🧑‍💻 Contributors

- **Developer**: [Mehvish282](https://github.com/Mehvish282)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
