import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { calculateHash } from './pixelpass';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'exporter' | 'qa_agency' | 'admin' | 'importer';
    company?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    userId: string;
    userName?: string;
    details: any;
    timestamp: string;
}

export interface Batch {
    id: string;
    exporterName: string;
    exporterId?: string; // Optional linkage to User
    productType: string;
    quantity: string;
    farmLocation: string;
    destinationCountry: string;
    notes?: string;
    status: 'SUBMITTED' | 'INSPECTED' | 'CERTIFIED' | 'REJECTED';
    submittedAt: string;
    inspectionData?: InspectionData;
    documents?: string[];
}

export interface InspectionData {
    grade: string;
    moisture: number;
    pesticideLevel: 'Safe' | 'Warning' | 'High';
    heavyMetalTest: 'Pass' | 'Fail';
    inspectorId: string;
    inspectorName?: string;
    sampleId?: string;
    inspectionLocation?: string;
    inspectedAt: string;
    notes?: string;
    isoCode: string;
    comments?: string; // Added for compatibility
    foreignMatter?: number; // percentage
    defects?: string;
}

export interface Certificate {
    id: string;
    batchId: string;
    issuedAt: string;
    validUntil: string;
    status: 'VALID' | 'REVOKED' | 'EXPIRED';
    vcData: any;
    qrBase64?: string; // Inji-generated QR code
    metadata?: any;
    issuer?: string;
    hash?: string;
}

export interface ExporterStats {
    totalBatches: number;
    pending: number;
    inInspection: number;
    certified: number;
    rejected: number;
}

export interface QAStats {
    newRequests: number;
    ongoing: number;
    completed: number;
    certificatesIssued: number;
}

export interface AdminStats {
    totalExporters: number;
    totalQAAgencies: number;
    totalCertificates: number;
    totalRevocations: number;
}

// Helper to map DB row to Batch interface
const mapBatch = (row: any): Batch => ({
    id: row.id,
    exporterName: row.exporter_name,
    exporterId: row.exporter_id, // Map if exists
    productType: row.product_type,
    quantity: row.quantity,
    farmLocation: row.farm_location,
    destinationCountry: row.destination_country,
    notes: row.notes,
    status: row.status as any,
    submittedAt: row.submitted_at,
    inspectionData: row.inspection_data,
    documents: row.documents || [] // Map if exists or default
});

// Helper to map DB row to Certificate interface
const mapCertificate = (row: any): Certificate => ({
    id: row.id,
    batchId: row.batch_id,
    issuedAt: row.issued_at,
    validUntil: row.valid_until,
    status: row.status as any,
    vcData: row.vc_data,
    qrBase64: row.qr_base64,
    metadata: row.metadata,
    issuer: row.issuer || 'National Quality Agency',
    hash: row.hash || ''
});

// Helpers
const mapUser = (row: any): User => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    company: row.company
});

const mapAuditLog = (row: any): AuditLog => ({
    id: row.id,
    action: row.action,
    userId: row.user_id,
    userName: row.users?.name, // Joined from users table
    details: row.details,
    timestamp: row.timestamp
});

export const storage = {
    // --- Batches ---

    async saveBatch(batch: Omit<Batch, 'id' | 'status' | 'submittedAt'>) {
        // Prepare DB object, matching schema columns
        const dbObj: any = {
            exporter_name: batch.exporterName,
            product_type: batch.productType,
            quantity: batch.quantity,
            farm_location: batch.farmLocation,
            destination_country: batch.destinationCountry,
            notes: batch.notes,
            status: 'SUBMITTED'
        };
        // If exporterId provided, save it (if column exists, else ignored by some drivers or error)
        // We assume schema might verify later. For now, keep it simple.
        if (batch.exporterId) dbObj.exporter_id = batch.exporterId;
        if (batch.documents) dbObj.documents = batch.documents;

        const { data, error } = await supabase
            .from('batches')
            .insert(dbObj)
            .select()
            .single();

        if (error) {
            console.error('Error saving batch:', error);
            toast.error('Failed to save batch to database');
            throw error;
        }

        return mapBatch(data);
    },

    async getBatches(): Promise<Batch[]> {
        const { data, error } = await supabase
            .from('batches')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching batches:', error);
            return [];
        }

        return data.map(mapBatch);
    },

    async getBatchById(id: string): Promise<Batch | undefined> {
        const { data, error } = await supabase
            .from('batches')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return undefined;
        }

        return mapBatch(data);
    },

    async updateBatchStatus(id: string, status: string, inspectionData?: InspectionData) {
        const updates: any = { status };
        if (inspectionData) {
            updates.inspection_data = inspectionData;
        }

        const { error } = await supabase
            .from('batches')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating batch:', error);
            toast.error('Failed to update batch status');
        } else {
            // Create Audit Log
            this.createAuditLog({
                action: `Batch Status Updated to ${status}`,
                userId: 'UNKNOWN', // In real app, get from auth context
                details: { batchId: id, status }
            });
        }
    },

    // --- Certificates ---

    async uploadCertificate(certId: string, vcData: any): Promise<string | null> {
        try {
            const fileName = `${certId}.json`;
            const blob = new Blob([JSON.stringify(vcData, null, 2)], { type: 'application/json' });

            const { data, error } = await supabase
                .storage
                .from('Certificate')
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                console.error('Error uploading certificate to bucket:', error);
                toast.error('Failed to upload certificate file: ' + error.message);
                return null;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('Certificate')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error: any) {
            console.error('Exception uploading certificate:', error);
            toast.error('Error uploading certificate file');
            return null;
        }
    },

    async saveCertificate(cert: Certificate) {
        // Compute Hash before saving
        // Hash critical fields: id + batchId + status + issuedAt
        const dataToHash = `${cert.id}|${cert.batchId}|${cert.status}|${cert.issuedAt}`;
        const hash = await calculateHash(dataToHash);
        cert.hash = hash;

        const dbObj: any = {
            id: cert.id,
            batch_id: cert.batchId,
            issued_at: cert.issuedAt,
            valid_until: cert.validUntil,
            status: cert.status,
            vc_data: cert.vcData,
            qr_base64: cert.qrBase64,
            metadata: cert.metadata,
            issuer: cert.issuer,
            hash: cert.hash
        };

        const { error } = await supabase
            .from('certificates')
            .insert(dbObj);

        if (error) {
            console.error('Error saving certificate:', error);
            toast.error('Failed to save certificate: ' + error.message);
            throw error;
        } else {
            this.createAuditLog({
                action: 'Certificate Issued',
                userId: 'QA-AGENT-001', // Mock ID for now
                details: { certificateId: cert.id, batchId: cert.batchId }
            });
        }
    },

    async getCertificate(id: string): Promise<Certificate | undefined> {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;
        return mapCertificate(data);
    },

    async getAllCertificates(): Promise<Certificate[]> {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('issued_at', { ascending: false });

        if (error) return [];
        return data.map(mapCertificate);
    },

    // --- Users ---

    async getUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error("Error fetching users:", error);
            return [];
        }
        return data.map(mapUser);
    },

    async getUserById(id: string): Promise<User | undefined> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;
        return mapUser(data);
    },

    // --- Audit Logs ---

    async createAuditLog(log: { action: string, userId: string, details?: any, userName?: string }) {
        // For demo, if userId is unknown, use '4' (Admin) or '1' (Exporter) based on context or just '4'
        const { error } = await supabase
            .from('audit_logs')
            .insert({
                action: log.action,
                user_id: log.userId === 'UNKNOWN' ? '4' : log.userId,
                details: log.details
            });

        if (error) console.error("Error creating audit log", error);
    },

    async getAuditLogs(): Promise<AuditLog[]> {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*, users(name)')
            .order('timestamp', { ascending: false });

        if (error) {
            console.error("Error fetching audit logs", error);
            return [];
        }
        return data.map(mapAuditLog);
    },

    // --- Statistics (Dynamic) ---

    async getExporterStats(): Promise<ExporterStats> {
        const batches = await this.getBatches();
        return {
            totalBatches: batches.length,
            pending: batches.filter(b => b.status === 'SUBMITTED').length,
            inInspection: batches.filter(b => b.status === 'INSPECTED').length, // Assuming INSPECTED means in progress for this view, or we can add IN_PROGRESS status
            certified: batches.filter(b => b.status === 'CERTIFIED').length,
            rejected: batches.filter(b => b.status === 'REJECTED').length
        };
    },

    async getQAStats(): Promise<QAStats> {
        const batches = await this.getBatches();
        const certs = await this.getAllCertificates();

        return {
            newRequests: batches.filter(b => b.status === 'SUBMITTED').length,
            ongoing: batches.filter(b => b.status === 'INSPECTED').length,
            completed: batches.filter(b => b.status === 'CERTIFIED' || b.status === 'REJECTED').length,
            certificatesIssued: certs.length
        };
    },

    async getAdminStats(): Promise<AdminStats> {
        const [users, certs] = await Promise.all([
            this.getUsers(),
            this.getAllCertificates()
        ]);

        return {
            totalExporters: users.filter(u => u.role === 'exporter').length,
            totalQAAgencies: users.filter(u => u.role === 'qa_agency').length,
            totalCertificates: certs.length,
            totalRevocations: certs.filter(c => c.status === 'REVOKED').length
        };
    }
};
