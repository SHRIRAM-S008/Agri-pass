// Multi-language support for English, Hindi, and Tamil

export type Language = 'en' | 'hi' | 'ta';

export const translations = {
  en: {
    // Common
    dashboard: 'Dashboard',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    download: 'Download',
    verify: 'Verify',
    back: 'Back',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
    actions: 'Actions',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    noData: 'No data available',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    
    // Navigation
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    verifyCertificate: 'Verify Certificate',
    
    // Roles
    exporter: 'Exporter',
    qaAgency: 'QA Agency',
    importer: 'Importer',
    admin: 'Admin',
    
    // Dashboard Titles
    exporterDashboard: 'Exporter Dashboard',
    qaDashboard: 'QA Dashboard',
    importerDashboard: 'Importer Dashboard',
    adminDashboard: 'Admin Dashboard',
    welcomeBack: 'Welcome back! Here\'s your overview.',
    
    // Batch Related
    batches: 'Batches',
    batch: 'Batch',
    batchId: 'Batch ID',
    submitBatch: 'Submit Batch',
    submitNewBatch: 'Submit New Batch',
    myBatches: 'My Batches',
    allBatches: 'All Batches',
    recentBatches: 'Recent Batches',
    totalBatches: 'Total Batches',
    pendingBatches: 'Pending',
    viewAll: 'View all',
    
    // Statuses
    submitted: 'Submitted',
    underReview: 'Under Review',
    inInspection: 'In Inspection',
    inspected: 'Inspected',
    certified: 'Certified',
    rejected: 'Rejected',
    verified: 'Verified',
    valid: 'Valid',
    invalid: 'Invalid',
    revoked: 'Revoked',
    expired: 'Expired',
    pending: 'Pending',
    completed: 'Completed',
    
    // Certificates
    certificates: 'Certificates',
    certificate: 'Certificate',
    certificateId: 'Certificate ID',
    issuedCertificates: 'Issued Certificates',
    certificatesIssued: 'Certificates Issued',
    recentCertificates: 'Recent Certificates',
    downloadCertificate: 'Download Certificate',
    viewCertificate: 'View Certificate',
    
    // Digital Passport
    digitalProductPassport: 'Digital Product Passport',
    verifiedCertificate: 'Verified Certificate',
    productDetails: 'Product Details',
    inspectionResults: 'Inspection Results',
    issuerInformation: 'Issuer Information',
    qualityScore: 'Quality Score',
    certificateStamp: 'Certificate Stamp',
    scanToVerify: 'Scan to verify certificate authenticity',
    downloadVC: 'Download VC (JSON)',
    downloadPDF: 'Download PDF',
    addToWallet: 'Add to Inji Wallet',
    offlineVerification: 'Offline Verification Available',
    
    // Product Fields
    productType: 'Product Type',
    product: 'Product',
    quantity: 'Quantity',
    origin: 'Origin',
    destination: 'Destination',
    farmLocation: 'Farm Location',
    harvestDate: 'Harvest Date',
    packagingDate: 'Packaging Date',
    
    // Inspection Fields
    inspection: 'Inspection',
    inspections: 'Inspections',
    inspectionRequests: 'Inspection Requests',
    pendingInspections: 'Pending Inspections',
    recentInspections: 'Recent Inspections',
    newRequests: 'New Requests',
    inProgress: 'In Progress',
    inspect: 'Inspect',
    grade: 'Grade',
    moistureLevel: 'Moisture Level',
    pesticideTest: 'Pesticide Test',
    heavyMetals: 'Heavy Metals',
    isoStandard: 'ISO Standard',
    passedAllTests: 'Passed All Tests',
    
    // Certificate Fields
    issuingAuthority: 'Issuing Authority',
    issueDate: 'Issue Date',
    issuedDate: 'Issued Date',
    validUntil: 'Valid Until',
    certificateHash: 'Certificate Hash',
    integrityHash: 'Integrity Hash',
    
    // Timeline
    batchTimeline: 'Batch Timeline',
    batchJourney: 'Batch Journey',
    batchSubmitted: 'Batch Submitted',
    inspectionStarted: 'Inspection Started',
    inspectionCompleted: 'Inspection Completed',
    certificateIssued: 'Certificate Issued',
    certificateVerified: 'Certificate Verified',
    
    // Verification
    verificationSuccess: 'Verification Successful',
    verificationFailed: 'Verification Failed',
    tamperDetected: 'Tamper Detected',
    dataMismatch: 'Data mismatch with stored hash. Certificate invalid.',
    integrityVerified: 'Data integrity verified',
    verifyCertificateDesc: 'Instantly verify the authenticity of quality certificates.',
    enterCertificateId: 'Enter Certificate ID',
    scanQR: 'Scan QR',
    scanQRCode: 'Scan QR Code',
    uploadQRImage: 'Upload QR Image',
    uploadVCFile: 'Upload VC File',
    cameraScanner: 'Camera Scanner',
    startCameraScan: 'Start Camera Scan',
    scanning: 'Scanning...',
    scanAnother: 'Scan Another',
    
    // Security
    securityShield: 'Security Shield',
    tamperAlert: 'Tamper Alert',
    certificateValid: 'Certificate Valid',
    certificateIntact: 'Certificate integrity intact',
    simulateTamper: 'Simulate Tamper',
    resetTamper: 'Reset',
    
    // Offline
    offlineMode: 'Offline Mode',
    offlineVerifyDesc: 'Basic verification available without internet',
    offlineReady: 'Offline Ready',
    
    // Users
    users: 'Users',
    manageUsers: 'Manage Users',
    totalExporters: 'Total Exporters',
    qaAgencies: 'QA Agencies',
    
    // Admin
    revocations: 'Revocations',
    viewRevocations: 'View Revocations',
    auditLogs: 'Audit Logs',
    systemSettings: 'System Settings',
    quickActions: 'Quick Actions',
    
    // History
    history: 'History',
    verificationHistory: 'Verification History',
    viewHistory: 'View History',
    
    // Form
    selectProduct: 'Select product type',
    enterQuantity: 'Enter quantity',
    selectOrigin: 'Select origin state',
    enterDestination: 'Enter destination',
    uploadImages: 'Upload Images',
    uploadDocuments: 'Upload Documents',
    dragAndDrop: 'Drag and drop or click to upload',
    submitting: 'Submitting...',
    batchSubmittedSuccess: 'Batch submitted successfully!',
    
    // Misc
    downloadReport: 'Download Report',
    awaitingInspection: 'Awaiting inspection',
    awaitingReview: 'Awaiting review',
    date: 'Date',
    role: 'Role',
    email: 'Email',
    name: 'Name',
  },
  hi: {
    // Common
    dashboard: 'डैशबोर्ड',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    download: 'डाउनलोड',
    verify: 'सत्यापित करें',
    back: 'वापस',
    view: 'देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    status: 'स्थिति',
    actions: 'कार्रवाई',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    loading: 'लोड हो रहा है...',
    noData: 'कोई डेटा उपलब्ध नहीं',
    success: 'सफल',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी',
    
    // Navigation
    home: 'होम',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    verifyCertificate: 'प्रमाणपत्र सत्यापित करें',
    
    // Roles
    exporter: 'निर्यातक',
    qaAgency: 'QA एजेंसी',
    importer: 'आयातक',
    admin: 'व्यवस्थापक',
    
    // Dashboard Titles
    exporterDashboard: 'निर्यातक डैशबोर्ड',
    qaDashboard: 'QA डैशबोर्ड',
    importerDashboard: 'आयातक डैशबोर्ड',
    adminDashboard: 'व्यवस्थापक डैशबोर्ड',
    welcomeBack: 'वापसी पर स्वागत है! यहाँ आपका अवलोकन है।',
    
    // Batch Related
    batches: 'बैच',
    batch: 'बैच',
    batchId: 'बैच आईडी',
    submitBatch: 'बैच जमा करें',
    submitNewBatch: 'नया बैच जमा करें',
    myBatches: 'मेरे बैच',
    allBatches: 'सभी बैच',
    recentBatches: 'हाल के बैच',
    totalBatches: 'कुल बैच',
    pendingBatches: 'लंबित',
    viewAll: 'सभी देखें',
    
    // Statuses
    submitted: 'जमा किया गया',
    underReview: 'समीक्षाधीन',
    inInspection: 'निरीक्षण में',
    inspected: 'निरीक्षित',
    certified: 'प्रमाणित',
    rejected: 'अस्वीकृत',
    verified: 'सत्यापित',
    valid: 'वैध',
    invalid: 'अमान्य',
    revoked: 'रद्द',
    expired: 'समाप्त',
    pending: 'लंबित',
    completed: 'पूर्ण',
    
    // Certificates
    certificates: 'प्रमाणपत्र',
    certificate: 'प्रमाणपत्र',
    certificateId: 'प्रमाणपत्र आईडी',
    issuedCertificates: 'जारी प्रमाणपत्र',
    certificatesIssued: 'जारी प्रमाणपत्र',
    recentCertificates: 'हाल के प्रमाणपत्र',
    downloadCertificate: 'प्रमाणपत्र डाउनलोड करें',
    viewCertificate: 'प्रमाणपत्र देखें',
    
    // Digital Passport
    digitalProductPassport: 'डिजिटल उत्पाद पासपोर्ट',
    verifiedCertificate: 'सत्यापित प्रमाणपत्र',
    productDetails: 'उत्पाद विवरण',
    inspectionResults: 'निरीक्षण परिणाम',
    issuerInformation: 'जारीकर्ता जानकारी',
    qualityScore: 'गुणवत्ता स्कोर',
    certificateStamp: 'प्रमाणपत्र मुहर',
    scanToVerify: 'प्रमाणपत्र प्रामाणिकता सत्यापित करने के लिए स्कैन करें',
    downloadVC: 'VC डाउनलोड करें (JSON)',
    downloadPDF: 'PDF डाउनलोड करें',
    addToWallet: 'Inji वॉलेट में जोड़ें',
    offlineVerification: 'ऑफ़लाइन सत्यापन उपलब्ध',
    
    // Product Fields
    productType: 'उत्पाद प्रकार',
    product: 'उत्पाद',
    quantity: 'मात्रा',
    origin: 'मूल स्थान',
    destination: 'गंतव्य',
    farmLocation: 'खेत का स्थान',
    harvestDate: 'फसल की तारीख',
    packagingDate: 'पैकेजिंग तारीख',
    
    // Inspection Fields
    inspection: 'निरीक्षण',
    inspections: 'निरीक्षण',
    inspectionRequests: 'निरीक्षण अनुरोध',
    pendingInspections: 'लंबित निरीक्षण',
    recentInspections: 'हाल के निरीक्षण',
    newRequests: 'नए अनुरोध',
    inProgress: 'प्रगति में',
    inspect: 'निरीक्षण करें',
    grade: 'ग्रेड',
    moistureLevel: 'नमी स्तर',
    pesticideTest: 'कीटनाशक परीक्षण',
    heavyMetals: 'भारी धातु',
    isoStandard: 'ISO मानक',
    passedAllTests: 'सभी परीक्षण पास',
    
    // Certificate Fields
    issuingAuthority: 'जारी करने वाला प्राधिकरण',
    issueDate: 'जारी करने की तारीख',
    issuedDate: 'जारी तारीख',
    validUntil: 'वैध तक',
    certificateHash: 'प्रमाणपत्र हैश',
    integrityHash: 'अखंडता हैश',
    
    // Timeline
    batchTimeline: 'बैच समयरेखा',
    batchJourney: 'बैच यात्रा',
    batchSubmitted: 'बैच जमा किया गया',
    inspectionStarted: 'निरीक्षण शुरू',
    inspectionCompleted: 'निरीक्षण पूर्ण',
    certificateIssued: 'प्रमाणपत्र जारी',
    certificateVerified: 'प्रमाणपत्र सत्यापित',
    
    // Verification
    verificationSuccess: 'सत्यापन सफल',
    verificationFailed: 'सत्यापन विफल',
    tamperDetected: 'छेड़छाड़ का पता चला',
    dataMismatch: 'संग्रहीत हैश के साथ डेटा मेल नहीं खाता। प्रमाणपत्र अमान्य।',
    integrityVerified: 'डेटा अखंडता सत्यापित',
    verifyCertificateDesc: 'गुणवत्ता प्रमाणपत्रों की प्रामाणिकता तुरंत सत्यापित करें।',
    enterCertificateId: 'प्रमाणपत्र आईडी दर्ज करें',
    scanQR: 'QR स्कैन करें',
    scanQRCode: 'QR कोड स्कैन करें',
    uploadQRImage: 'QR छवि अपलोड करें',
    uploadVCFile: 'VC फ़ाइल अपलोड करें',
    cameraScanner: 'कैमरा स्कैनर',
    startCameraScan: 'कैमरा स्कैन शुरू करें',
    scanning: 'स्कैन हो रहा है...',
    scanAnother: 'एक और स्कैन करें',
    
    // Security
    securityShield: 'सुरक्षा कवच',
    tamperAlert: 'छेड़छाड़ चेतावनी',
    certificateValid: 'प्रमाणपत्र वैध',
    certificateIntact: 'प्रमाणपत्र अखंडता बरकरार',
    simulateTamper: 'छेड़छाड़ सिमुलेट करें',
    resetTamper: 'रीसेट',
    
    // Offline
    offlineMode: 'ऑफ़लाइन मोड',
    offlineVerifyDesc: 'इंटरनेट के बिना बुनियादी सत्यापन उपलब्ध',
    offlineReady: 'ऑफ़लाइन तैयार',
    
    // Users
    users: 'उपयोगकर्ता',
    manageUsers: 'उपयोगकर्ता प्रबंधित करें',
    totalExporters: 'कुल निर्यातक',
    qaAgencies: 'QA एजेंसियां',
    
    // Admin
    revocations: 'निरस्तीकरण',
    viewRevocations: 'निरस्तीकरण देखें',
    auditLogs: 'ऑडिट लॉग',
    systemSettings: 'सिस्टम सेटिंग्स',
    quickActions: 'त्वरित कार्रवाई',
    
    // History
    history: 'इतिहास',
    verificationHistory: 'सत्यापन इतिहास',
    viewHistory: 'इतिहास देखें',
    
    // Form
    selectProduct: 'उत्पाद प्रकार चुनें',
    enterQuantity: 'मात्रा दर्ज करें',
    selectOrigin: 'मूल राज्य चुनें',
    enterDestination: 'गंतव्य दर्ज करें',
    uploadImages: 'छवियां अपलोड करें',
    uploadDocuments: 'दस्तावेज़ अपलोड करें',
    dragAndDrop: 'खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें',
    submitting: 'जमा हो रहा है...',
    batchSubmittedSuccess: 'बैच सफलतापूर्वक जमा किया गया!',
    
    // Misc
    downloadReport: 'रिपोर्ट डाउनलोड करें',
    awaitingInspection: 'निरीक्षण की प्रतीक्षा',
    awaitingReview: 'समीक्षा की प्रतीक्षा',
    date: 'तारीख',
    role: 'भूमिका',
    email: 'ईमेल',
    name: 'नाम',
  },
  ta: {
    // Common
    dashboard: 'டாஷ்போர்டு',
    submit: 'சமர்ப்பி',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    download: 'பதிவிறக்கு',
    verify: 'சரிபார்',
    back: 'பின்செல்',
    view: 'காண்க',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    status: 'நிலை',
    actions: 'செயல்கள்',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    loading: 'ஏற்றுகிறது...',
    noData: 'தரவு இல்லை',
    success: 'வெற்றி',
    error: 'பிழை',
    warning: 'எச்சரிக்கை',
    info: 'தகவல்',
    
    // Navigation
    home: 'முகப்பு',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    signIn: 'உள்நுழை',
    signOut: 'வெளியேறு',
    verifyCertificate: 'சான்றிதழ் சரிபார்',
    
    // Roles
    exporter: 'ஏற்றுமதியாளர்',
    qaAgency: 'QA நிறுவனம்',
    importer: 'இறக்குமதியாளர்',
    admin: 'நிர்வாகி',
    
    // Dashboard Titles
    exporterDashboard: 'ஏற்றுமதியாளர் டாஷ்போர்டு',
    qaDashboard: 'QA டாஷ்போர்டு',
    importerDashboard: 'இறக்குமதியாளர் டாஷ்போர்டு',
    adminDashboard: 'நிர்வாகி டாஷ்போர்டு',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்! உங்கள் மேலோட்டம் இதோ.',
    
    // Batch Related
    batches: 'தொகுதிகள்',
    batch: 'தொகுதி',
    batchId: 'தொகுதி ஐடி',
    submitBatch: 'தொகுதி சமர்ப்பி',
    submitNewBatch: 'புதிய தொகுதி சமர்ப்பி',
    myBatches: 'எனது தொகுதிகள்',
    allBatches: 'அனைத்து தொகுதிகள்',
    recentBatches: 'சமீபத்திய தொகுதிகள்',
    totalBatches: 'மொத்த தொகுதிகள்',
    pendingBatches: 'நிலுவை',
    viewAll: 'அனைத்தையும் காண்க',
    
    // Statuses
    submitted: 'சமர்ப்பிக்கப்பட்டது',
    underReview: 'மதிப்பாய்வில்',
    inInspection: 'ஆய்வில்',
    inspected: 'ஆய்வு செய்யப்பட்டது',
    certified: 'சான்றளிக்கப்பட்டது',
    rejected: 'நிராகரிக்கப்பட்டது',
    verified: 'சரிபார்க்கப்பட்டது',
    valid: 'செல்லுபடியாகும்',
    invalid: 'செல்லாது',
    revoked: 'திரும்பப்பெறப்பட்டது',
    expired: 'காலாவதியானது',
    pending: 'நிலுவை',
    completed: 'நிறைவு',
    
    // Certificates
    certificates: 'சான்றிதழ்கள்',
    certificate: 'சான்றிதழ்',
    certificateId: 'சான்றிதழ் ஐடி',
    issuedCertificates: 'வழங்கிய சான்றிதழ்கள்',
    certificatesIssued: 'வழங்கிய சான்றிதழ்கள்',
    recentCertificates: 'சமீபத்திய சான்றிதழ்கள்',
    downloadCertificate: 'சான்றிதழ் பதிவிறக்கு',
    viewCertificate: 'சான்றிதழ் காண்க',
    
    // Digital Passport
    digitalProductPassport: 'டிஜிட்டல் தயாரிப்பு பாஸ்போர்ட்',
    verifiedCertificate: 'சரிபார்க்கப்பட்ட சான்றிதழ்',
    productDetails: 'தயாரிப்பு விவரங்கள்',
    inspectionResults: 'ஆய்வு முடிவுகள்',
    issuerInformation: 'வழங்குநர் தகவல்',
    qualityScore: 'தர மதிப்பெண்',
    certificateStamp: 'சான்றிதழ் முத்திரை',
    scanToVerify: 'சான்றிதழ் நம்பகத்தன்மையை சரிபார்க்க ஸ்கேன் செய்யவும்',
    downloadVC: 'VC பதிவிறக்கு (JSON)',
    downloadPDF: 'PDF பதிவிறக்கு',
    addToWallet: 'Inji வாலட்டில் சேர்',
    offlineVerification: 'ஆஃப்லைன் சரிபார்ப்பு கிடைக்கும்',
    
    // Product Fields
    productType: 'தயாரிப்பு வகை',
    product: 'தயாரிப்பு',
    quantity: 'அளவு',
    origin: 'தோற்றம்',
    destination: 'இலக்கு',
    farmLocation: 'பண்ணை இடம்',
    harvestDate: 'அறுவடை தேதி',
    packagingDate: 'பேக்கேஜிங் தேதி',
    
    // Inspection Fields
    inspection: 'ஆய்வு',
    inspections: 'ஆய்வுகள்',
    inspectionRequests: 'ஆய்வு கோரிக்கைகள்',
    pendingInspections: 'நிலுவை ஆய்வுகள்',
    recentInspections: 'சமீபத்திய ஆய்வுகள்',
    newRequests: 'புதிய கோரிக்கைகள்',
    inProgress: 'நடைபெறுகிறது',
    inspect: 'ஆய்வு செய்',
    grade: 'தரம்',
    moistureLevel: 'ஈரப்பதம்',
    pesticideTest: 'பூச்சிக்கொல்லி சோதனை',
    heavyMetals: 'கன உலோகங்கள்',
    isoStandard: 'ISO தரநிலை',
    passedAllTests: 'அனைத்து சோதனைகளும் தேர்ச்சி',
    
    // Certificate Fields
    issuingAuthority: 'வழங்கும் அதிகாரம்',
    issueDate: 'வழங்கிய தேதி',
    issuedDate: 'வழங்கிய தேதி',
    validUntil: 'செல்லுபடியாகும் வரை',
    certificateHash: 'சான்றிதழ் ஹாஷ்',
    integrityHash: 'ஒருமைப்பாடு ஹாஷ்',
    
    // Timeline
    batchTimeline: 'தொகுதி காலவரிசை',
    batchJourney: 'தொகுதி பயணம்',
    batchSubmitted: 'தொகுதி சமர்ப்பிக்கப்பட்டது',
    inspectionStarted: 'ஆய்வு தொடங்கியது',
    inspectionCompleted: 'ஆய்வு நிறைவு',
    certificateIssued: 'சான்றிதழ் வழங்கப்பட்டது',
    certificateVerified: 'சான்றிதழ் சரிபார்க்கப்பட்டது',
    
    // Verification
    verificationSuccess: 'சரிபார்ப்பு வெற்றி',
    verificationFailed: 'சரிபார்ப்பு தோல்வி',
    tamperDetected: 'சேதாரம் கண்டறியப்பட்டது',
    dataMismatch: 'சேமிக்கப்பட்ட ஹாஷுடன் தரவு பொருந்தவில்லை. சான்றிதழ் செல்லாது.',
    integrityVerified: 'தரவு ஒருமைப்பாடு சரிபார்க்கப்பட்டது',
    verifyCertificateDesc: 'தர சான்றிதழ்களின் நம்பகத்தன்மையை உடனடியாக சரிபார்க்கவும்.',
    enterCertificateId: 'சான்றிதழ் ஐடி உள்ளிடவும்',
    scanQR: 'QR ஸ்கேன்',
    scanQRCode: 'QR குறியீடு ஸ்கேன்',
    uploadQRImage: 'QR படம் பதிவேற்று',
    uploadVCFile: 'VC கோப்பு பதிவேற்று',
    cameraScanner: 'கேமரா ஸ்கேனர்',
    startCameraScan: 'கேமரா ஸ்கேன் தொடங்கு',
    scanning: 'ஸ்கேன் செய்கிறது...',
    scanAnother: 'மற்றொன்றை ஸ்கேன் செய்',
    
    // Security
    securityShield: 'பாதுகாப்பு கவசம்',
    tamperAlert: 'சேதார எச்சரிக்கை',
    certificateValid: 'சான்றிதழ் செல்லுபடியாகும்',
    certificateIntact: 'சான்றிதழ் ஒருமைப்பாடு உள்ளது',
    simulateTamper: 'சேதாரத்தை உருவகப்படுத்து',
    resetTamper: 'மீட்டமை',
    
    // Offline
    offlineMode: 'ஆஃப்லைன் முறை',
    offlineVerifyDesc: 'இணையம் இல்லாமல் அடிப்படை சரிபார்ப்பு கிடைக்கும்',
    offlineReady: 'ஆஃப்லைன் தயார்',
    
    // Users
    users: 'பயனர்கள்',
    manageUsers: 'பயனர்களை நிர்வகி',
    totalExporters: 'மொத்த ஏற்றுமதியாளர்கள்',
    qaAgencies: 'QA நிறுவனங்கள்',
    
    // Admin
    revocations: 'திரும்பப்பெறுதல்கள்',
    viewRevocations: 'திரும்பப்பெறுதல்கள் காண்க',
    auditLogs: 'தணிக்கை பதிவுகள்',
    systemSettings: 'கணினி அமைப்புகள்',
    quickActions: 'விரைவு செயல்கள்',
    
    // History
    history: 'வரலாறு',
    verificationHistory: 'சரிபார்ப்பு வரலாறு',
    viewHistory: 'வரலாறு காண்க',
    
    // Form
    selectProduct: 'தயாரிப்பு வகையை தேர்ந்தெடு',
    enterQuantity: 'அளவை உள்ளிடவும்',
    selectOrigin: 'தோற்ற மாநிலத்தை தேர்ந்தெடு',
    enterDestination: 'இலக்கை உள்ளிடவும்',
    uploadImages: 'படங்களை பதிவேற்று',
    uploadDocuments: 'ஆவணங்களை பதிவேற்று',
    dragAndDrop: 'இழுத்து விடவும் அல்லது பதிவேற்ற கிளிக் செய்யவும்',
    submitting: 'சமர்ப்பிக்கிறது...',
    batchSubmittedSuccess: 'தொகுதி வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    
    // Misc
    downloadReport: 'அறிக்கை பதிவிறக்கு',
    awaitingInspection: 'ஆய்வுக்கு காத்திருக்கிறது',
    awaitingReview: 'மதிப்பாய்வுக்கு காத்திருக்கிறது',
    date: 'தேதி',
    role: 'பங்கு',
    email: 'மின்னஞ்சல்',
    name: 'பெயர்',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Language = 'en'): string {
  return translations[lang][key] || translations.en[key] || key;
}
