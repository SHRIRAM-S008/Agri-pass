# AgriQCert - Digital Quality Certification Platform

**A Next-Generation Web Platform for Agricultural Supply Chain Transparency**

AgriQCert is a comprehensive web application designed to digitize the agricultural quality certification process. By leveraging **MOSIP Inji Certify** and **W3C Verifiable Credentials**, it creates a tamper-proof bridge between exporters, quality assurance agencies, and importers.

## 🌟 Website Overview

AgriQCert is built as a modern, responsive Progressive Web App (PWA) that provides a seamless experience across desktop and mobile devices. The platform features role-based access control, ensuring that each stakeholder has a tailored dashboard to manage their specific tasks in the supply chain.

### 🎨 Key Website Features

- **Role-Based Dashboards**: tailored interfaces for Exporters, QA Agencies, Importers, and Administrators.
- **📱 Fully Responsive Design**: 
  - Optimized for mobile, tablet, and desktop views.
  - **Mobile-First Experience**: Touch-friendly navigation, card-based data views for smaller screens, and non-intrusive menus.
- **🌍 Multi-Language Support**: Complete localization in 8 languages:
  - English, Hindi, Tamil, French, Arabic, Spanish, Sinhala, Portuguese.
- **🔐 Secure Authentication**: Role-based login with secure session management.
- **⚡ Progressive Web App (PWA)**: Installable on devices, ensuring performance even on slow networks.

---

## � Stakeholder Portals

### 1. Exporter Portal
*Designed for ease of submission and tracking.*
- **Submit Batches**: Easy-to-use forms to submit new agricultural batches for inspection.
- **Track Status**: Real-time timeline view of batch progress (Submitted → Inspecting → Certified).
- **Manage Certificates**: View and download issued digital certificates (PDF & JSON VC).
- **Mobile Access**: Check status and show QR codes directly from a mobile device while in the field.

### 2. QA Agency Portal
*Tools for inspectors to validate quality.*
- **Inspection Managment**: Receive and process inspection requests in real-time.
- **Digital grading**: Input grading results (Moisture, Pesticides, Heavy Metals) directly into digital forms.
- **Instant Issuance**: One-click generation of cryptographically signed Verifiable Credentials via Inji Certify.

### 3. Importer / Verification Portal
*Trust but verify.*
- **Universal Scanner**: Built-in QR scanner compatible with AgriQCert certificates.
- **Offline Verification**: Verify simplified certificates even without an internet connection using PixelPass technology.
- **Detailed Reports**: View comprehensive provenance data, inspection results, and issuer details.

### 4. Admin Portal
*System oversight.*
- **User Management**: onboard and manage organization access.
- **Analytics**: System-wide statistics on batches, certifications, and revocations.

---

## 🏗️ Technology Stack

**Frontend**
- **Framework**: React 18 + Vite (High performance)
- **Styling**: Tailwind CSS + Shadcn UI (Modern, accessible design components)
- **Languages**: TypeScript (Type safety)

**Backend & Services**
- **Database**: Supabase (PostgreSQL)
- **Identity & VC**: MOSIP Inji Certify
- **Deployment**: Netlify / Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for local Inji Certify instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agri-pass.git
   cd agri-pass-main
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Update .env.local with your Supabase and Inji credentials
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   The application will launch at `http://localhost:5173`

---

## � Mobile features
The website is designed to feel like a native app on mobile devices:
- **Bottom Navigation**: Easy thumb-reach navigation on mobile.
- **Card Views**: Complex data tables automatically transform into readable cards on mobile screens.
- **No Horizontal Scroll**: Layouts adapt perfectly to any screen width.

## 📄 License
MIT License. Built for the future of sustainable trade.
