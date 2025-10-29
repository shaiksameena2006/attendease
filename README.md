# Attendease - Campus Management System

A comprehensive Progressive Web App (PWA) designed to revolutionize campus management for colleges and universities.

## 🎓 Project Overview

Attendease is an all-in-one digital ecosystem that automates traditional campus operations while fostering seamless communication between students, faculty, and administrators. Built with modern web technologies, it provides a native app-like experience with powerful features for campus management.

**Project URL**: https://lovable.dev/projects/a73c470b-1af5-473b-8a2b-8553885d4e3c

## 🚀 Key Features

### For Students
- **Automated Attendance**: Face recognition and Bluetooth proximity-based check-in
- **Interactive Timetable**: Real-time schedule with automatic updates
- **Events Hub**: Browse, register, and participate in campus events
- **Clubs & Houses**: Join clubs and compete in house competitions
- **Digital Certificates**: Access certificates with QR verification
- **Messaging**: Real-time peer-to-peer and group messaging
- **Transport**: Bus tracking and digital pass management

### For Faculty
- **Class Management**: Manage students and track attendance
- **Timetable Creator**: Drag-and-drop scheduling with conflict detection
- **Certificate Issuance**: Generate and approve certificates
- **CO-PO Management**: Track course and program outcomes
- **Event Management**: Create and manage campus events
- **AI Analytics**: Get insights on attendance patterns

### For Administrators
- **User Management**: Approve registrations and manage roles
- **System Dashboard**: Comprehensive analytics and metrics
- **Academic Setup**: Configure courses, semesters, examinations
- **Transport Admin**: Manage routes, buses, and passes
- **Security**: Audit logs and access control

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (Auth, Database, Storage, Real-time)
- **AI**: Lovable AI with Google Gemini 2.5
- **APIs**: Web Bluetooth, WebRTC, Push Notifications, Geolocation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Quick Start

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```sh
npm run build
# or
bun build
```

## 🔐 Security Features

- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Protection against abuse
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based prevention
- **RLS Policies**: Database-level access control
- **Audit Logging**: Track all sensitive operations

## 📱 PWA Capabilities

- **Offline Mode**: Core features work without internet
- **Background Sync**: Data syncs when connection restored
- **Push Notifications**: AI-powered smart notifications
- **App Shortcuts**: Quick access to key features
- **Native Experience**: Installable as a mobile app

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Screen reader optimized
- Keyboard navigation support
- High contrast themes
- 44x44px touch targets
- Reduced motion support

## 🚄 Performance

- Code splitting & lazy loading
- Image optimization
- Service worker caching
- Debounced event handlers
- Memoized computations
- < 200KB initial bundle

## 📊 Database Schema

Key tables:
- `profiles` - User information
- `user_roles` - Role-based access
- `attendance_records` - Attendance tracking
- `timetable_entries` - Schedules
- `events` - Campus events
- `clubs` & `houses` - Organizations
- `certificates` - Digital certificates
- `messages` - Chat system
- `buses`, `bus_routes` - Transport

## 🔧 Edge Functions

1. **ai-notifications**: AI-powered notifications
2. **ai-analytics**: Analytics with AI insights
3. **initialize-user-data**: Auto-setup for new users

## 📝 Development

### Using Lovable Editor
Visit [Lovable Project](https://lovable.dev/projects/a73c470b-1af5-473b-8a2b-8553885d4e3c) and start prompting. Changes commit automatically.

### Using Your IDE
Make changes locally and push. They'll sync to Lovable automatically.

### Using GitHub Codespaces
1. Click "Code" button
2. Select "Codespaces" tab
3. Click "New codespace"
4. Edit and commit directly

## 🚀 Deployment

1. Open [Lovable](https://lovable.dev/projects/a73c470b-1af5-473b-8a2b-8553885d4e3c)
2. Click Share → Publish
3. Optionally connect custom domain in Project > Settings > Domains

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 📖 Documentation

- [Phase 1-8 Implementation Docs](./docs/)
- [API Documentation](./docs/api.md)
- [Security Guidelines](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

Copyright © 2025 Attendease. All rights reserved.

## 🙏 Acknowledgments

Built with [Lovable](https://lovable.app) • Powered by [Supabase](https://supabase.com) • AI by [Google Gemini](https://deepmind.google/technologies/gemini/)

## 📞 Support

Email: support@attendease.edu  
Help: Available in-app Help & Support section
