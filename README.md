# Helping Hands – Online Charity Management Platform

> *Connecting donors, NGOs, and communities through transparency and impact.*

A full-stack web application that enables NGOs to request funding, donors to contribute securely, and admins to manage operations with full visibility.

Built as a team project with a clean split between frontend and backend responsibilities.

---

##  Team & Work Distribution

| Member | Role | Key Contributions |
|-------|------|------------------|
| **Brian** | Frontend | Authentication UI, Role-based routing, JWT session persistence, Redux Auth Slice |
| **Adrian** | Frontend | Donation request forms, donor dashboard, donation history, pagination, Redux Donations Slice |
| **Cornelius** | Frontend | Admin dashboard, category management, Cloudinary image upload UI, Recharts integration |
| **George** | Backend | User models, JWT authentication, email verification (SendGrid), profile APIs, Cloudinary backend |
| **Isaac** | Backend | Donation request APIs, admin approval flow, category management, pagination, Swagger docs |

---

## Features

###  Authentication & Security
- Login & Register with JWT
- 2-step email verification (SendGrid)
- Role-based access: Donor, NGO, Admin
- Protected routes with React Router
- Session persistence

###  Donation Flow
- NGOs submit funding requests
- Admins approve/reject requests
- Donors browse approved causes
- Donation form with amount & notes
- Filter by category
- Human-readable dates & donation history
- Pagination for large lists

###  Admin Dashboard
- Create/Edit/Delete categories
- Approve or reject NGO requests
- Cloudinary drag-and-drop image upload
- Donation summary charts (Recharts)
- Responsive layout with Tailwind + AdminLTE style

### ⚙ Backend APIs (Flask + PostgreSQL)
- RESTful endpoints with Flask-RESTful
- Models: `User`, `DonationRequest`, `Donation`, `Category`
- JWT Authentication (Flask-JWT-Extended)
- Cloudinary image handling (upload, resize)
- Email verification with SendGrid
- Swagger/OpenAPI documentation
- Input validation & error handling

---

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Font Awesome

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL (with SQLAlchemy ORM)
- **Authentication**: JWT (Flask-JWT-Extended)
- **APIs**: Flask-RESTful
- **Email**: Brevo
- **Images**: Cloudinary
- **Docs**: Swagger (OpenAPI 3.0)

### Tools
- GitHub (version control)
- Postman (API testing)
- Swagger UI (API docs)
- Figma (UI planning)

---

##  Installation & Setup

### Frontend
```bash
cd cllient
npm install
npm run dev
