# Task Management System - Laravel API

## Overview

Laravel backend API for the Task Management System.

Provides:

- JWT Authentication
- User Management
- Team Management
- Task Management
- Role-Based Authorization

---

## Deployment

### Platform Used

Railway

### Why Railway?

Railway was selected because it provides:

- Easy Laravel deployment
- Managed MySQL database
- Environment variable management
- Automatic GitHub deployments

---

## Live URLs

### Laravel API

https://task-management-laravel-api-production.up.railway.app/

### React Frontend

https://task-management-laravel-h332l9xd8.vercel.app/

### Node.js Services

https://task-management-node-services-bcuw.onrender.com/

---

## Local Setup

### Clone Repository



Install Dependencies
composer install
Configure Environment
cp .env.example .env

Generate Application Key:

php artisan key:generate

Generate JWT Secret:

php artisan jwt:secret
Configure Database

Update the .env file:

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=
Run Migrations
php artisan migrate
Seed Database
php artisan db:seed
Start Laravel Locally
php artisan serve

Default URL:

http://localhost:8000
Test Credentials
Admin

Email:

admin@test.com

Password:

password
Manager

Email:

manager@test.com

Password:

password
Member

Email:

member@test.com

Password:

password

Update these credentials if your seeders use different accounts.

git clone <repository-url>
cd task-management-laravel-api

```bash
