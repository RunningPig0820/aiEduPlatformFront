# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI教育平台前端 (AI Education Platform Frontend) - A multi-page web application supporting both SPA and SSR deployment modes. The platform serves three user roles: students, teachers, and parents.

## Tech Stack

- **Build Tool**: Vite 5
- **CSS Framework**: Tailwind CSS 3 + daisyUI component library
- **JavaScript Framework**: Alpine.js 3 (lightweight reactive framework)
- **Language**: Vanilla JavaScript (ES modules)

## Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production (output to dist/)
npm run build

# Build and copy to backend for SSR deployment
npm run build:ssr
```

## Architecture

### Multi-Page Application Structure

The app uses Vite's multi-page build configuration. Each HTML file is an independent entry point:

- `index.html` - Landing page
- `pages/auth/login.html` - Login/registration page
- `pages/student/home.html` - Student dashboard
- `pages/teacher/home.html` - Teacher dashboard
- `pages/parent/home.html` - Parent dashboard

### Role-Based Routing

After login, users are redirected based on their role:
- `STUDENT` → `/pages/student/home.html`
- `TEACHER` → `/pages/teacher/home.html`
- `PARENT` → `/pages/parent/home.html`

### JavaScript Modules

- `src/js/api.js` - API wrapper with `authApi` and `userApi` exports, initializes Alpine.js
- `src/js/auth.js` - Authentication page logic (login, register, demo login)

### API Integration

All API calls use `/api` prefix. In development mode, Vite proxies requests to `http://localhost:8080`.

Key endpoints:
- `POST /api/auth/login` - Login
- `POST /api/auth/demo-login` - Demo login with role parameter
- `POST /api/auth/register` - Registration
- `POST /api/auth/send-code` - Send verification code
- `POST /api/auth/logout` - Logout
- `GET /api/auth/current-user` - Get current user info

API responses follow the format: `{ code: '00000', data: {...}, message: '...' }`

### SSR Integration

The `build:ssr` command copies built files to a sibling backend project:
- HTML files → `../ai-edu-backend/ai-edu-interface/src/main/resources/templates/`
- Assets → `../ai-edu-backend/ai-edu-interface/src/main/resources/static/assets/`

This enables Thymeleaf server-side rendering with the same templates.

## Development Notes

- Pages use CDN links for daisyUI, Tailwind, and Alpine.js in development
- Custom styles are in `src/css/main.css`
- Each role-specific page contains its own inline Alpine.js component (e.g., `studentApp()`)
- The auth page uses the external `authApp()` function from `src/js/auth.js`