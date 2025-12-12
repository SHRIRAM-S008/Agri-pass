# AgriQCert - Agricultural Quality Certification Platform

**Digital Product Passports powered by MOSIP Inji & W3C Verifiable Credentials**

## 🌾 Overview

AgriQCert is a blockchain-based quality certification platform for agricultural exports. It enables exporters, QA agencies, and importers to issue, manage, and verify tamper-proof Digital Product Passports using **MOSIP Inji Certify** and **W3C Verifiable Credentials**.

### Key Features

- ✅ **Inji Certify Integration** - Issue cryptographically signed VCs
- 📱 **Mobile Wallet Support** - Compatible with Inji Wallet & Inji Verify apps
- 🔒 **Tamper Detection** - SHA-256 hashing for integrity verification
- 📄 **PDF Export** - Professional certificates with embedded QR codes
- 🌐 **Multi-language** - Support for English, Hindi, Tamil, French, Arabic, Spanish, Sinhala, Portuguese
- 📊 **Real-time Analytics** - Dashboard for all stakeholders
- 🔍 **Offline Verification** - PixelPass encoding for QR codes

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd agri-pass-main

# Run quick-start script (starts Inji Certify + app)
./quick-start.sh
```

### Option 2: Manual Setup

```bash
# 1. Start Inji Certify
docker-compose up -d inji-certify

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run the app
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📚 Documentation

- **[INJI_INTEGRATION.md](./INJI_INTEGRATION.md)** - Complete Inji integration guide
- **[DEMO_CHECKLIST.md](./DEMO_CHECKLIST.md)** - Hackathon demo script & checklist
- **[supabase_schema.sql](./supabase_schema.sql)** - Database schema

---

## 🏗️ Tech Stack

- **Frontend:** Vite + React + TypeScript
- **UI:** shadcn-ui + Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **VC Issuance:** MOSIP Inji Certify
- **VC Verification:** Inji Verify API
- **QR Encoding:** PixelPass (CBOR + Zlib + Base45)
- **PDF Generation:** jsPDF
- **Deployment:** Netlify

---

## 🎯 User Flows

### Exporter
1. Submit batch for inspection
2. View inspection results
3. Download certificate with QR code
4. Share with importers

### QA Officer
1. Review inspection requests
2. Conduct quality inspection
3. **Issue Digital Product Passport via Inji Certify**
4. Manage certificates

### Importer
1. Scan QR code with Inji Wallet/Verify
2. Verify certificate authenticity
3. View product details & inspection results
4. Download verification report

---

## 🔧 Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Inji Integration
VITE_INJI_CERTIFY_URL=http://localhost:8080
VITE_INJI_VERIFY_URL=https://verify.inji.io/verify
```

---

## 📱 Mobile Apps

- **Inji Wallet** - Store VCs: [iOS](https://apps.apple.com/in/app/inji/id6448640428) | [Android](https://play.google.com/store/apps/details?id=io.mosip.residentapp)
- **Inji Verify** - Verify VCs: [iOS](https://apps.apple.com/in/app/inji-verify/id6475072371) | [Android](https://play.google.com/store/apps/details?id=inji.verify)

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🚢 Deployment

### Netlify (Recommended)

1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy!

Or use the Lovable platform:

Simply open [Lovable](https://lovable.dev/projects/213a2d91-cf52-425e-b34f-49e3b68586a4) and click on Share → Publish.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

## 📞 Support

For issues or questions:
- Check [INJI_INTEGRATION.md](./INJI_INTEGRATION.md) troubleshooting section
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for sustainable agriculture and global trade**

