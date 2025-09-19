# Insecure Library Application

## Overview

This is some insane vibe coded garbage I prompted for experimenting. Don't use

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Approve `better-sqlite3`:
```bash
pnpm approve-builds
```

3. Start the application:
```bash
pnpm start
```

4. Access the application:
```
http://localhost:4167
```

## Test Accounts

### Admin Account (User ID: 1)
- **Username**: admin
- **Password**: admin123

### Regular Users
- john_doe / password123
- jane_smith / mypassword
- bob_wilson / 123456
- alice_brown / secret
- charlie_davis / qwerty
- diana_miller / letmein
- frank_jones / password
- grace_taylor / welcome
- henry_clark / admin

## Database Schema

### Users Table
- id (PRIMARY KEY, INTEGER)
- username (TEXT)
- password (TEXT)
- role (TEXT, default: 'user')

### Books Table
- id (PRIMARY KEY, INTEGER)
- title (TEXT)
- author (TEXT)
- isbn (TEXT)
- year (INTEGER)
- description (TEXT)

## API Endpoints

- `POST /api/login` - Vulnerable login endpoint
- `GET /api/search?q=query` - Vulnerable book search with UNION injection
- `POST /api/books` - Add book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

## License

ISC License - Use at your own risk for educational purposes only.
