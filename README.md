# Job Portal - React with Django

This README provides:
Project overview
Installation instructions
Environment setup
Running instructions
API documentation
Contributing guidelines
Support information
Let me know if you need any clarification or additions!


A full-stack job portal application built with React (frontend) and Django (backend). This application allows employers to post jobs and employees to apply for positions.

## Features

- User Authentication (Email & Google Sign-in)
- Role-based Authorization (Employer/Employee)
- Job Posting and Application Management
- Company Profile Management
- Employee Profile Management
- Job Search and Filtering
- Real-time Application Status Updates
- File Upload (Resume, Profile Pictures)

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- React Router v6
- Axios
- Vite
- Day.js

### Backend
- Django 4.2
- Django REST Framework
- MySQL
- JWT Authentication
- Google OAuth2

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- Git

## Installation and Setup

### 1. Clone the Repository
git clone https://github.com/SuriyaPasupathi/Job_Portal_react-with-django.git


cd Job_Portal_react-with-django

##create virtual environment

Create and activate virtual environment
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

Navigate to backend directory

cd backend
Install dependencies
pip install -r requirements.txt
Create .env file
cp .env.example .env
Update .env with your configurations
Setup database
mysql -u root -p
CREATE DATABASE jobportal;
exit
Run migrations
python manage.py makemigrations
python manage.py migrate
Create superuser
python manage.py createsuperuser
Start backend server
python manage.py runserver


### 3. Frontend Setup

Open new terminal and navigate to frontend directory
cd frontend
Install dependencies
npm install
Create .env file
cp .env.example .env
Update .env with your configurations
Start frontend development server
npm run dev



## Environment Variables

### Backend (.env)

DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_NAME=jobportal
DATABASE_USER=root
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=3306
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

### Frontend (.env)


## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:5173
7. Add authorized redirect URIs:
   - http://localhost:3000/login
   - http://localhost:5173/login

## Running the Application

1. Start MySQL server
2. Start Backend server:


4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Interface: http://localhost:8000/admin

## API Endpoints

### Authentication
- POST /api/accounts/register/ - User registration
- POST /api/accounts/token/ - Get JWT tokens
- POST /api/accounts/token/refresh/ - Refresh JWT token
- POST /api/accounts/google/login/ - Google OAuth login

### Jobs
- GET /api/jobs/ - List all jobs
- POST /api/jobs/ - Create new job
- GET /api/jobs/{id}/ - Get job details
- PUT /api/jobs/{id}/ - Update job
- DELETE /api/jobs/{id}/ - Delete job
- POST /api/jobs/{id}/apply/ - Apply for job

### Profiles
- GET /api/accounts/employee-profiles/ - Get employee profile
- POST /api/accounts/employee-profiles/ - Create employee profile
- GET /api/accounts/company-profiles/ - Get company profile
- POST /api/accounts/company-profiles/ - Create company profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, email suriyapasupathi.06@gmail.com or open an issue in the repository.