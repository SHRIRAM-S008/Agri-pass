/**
 * Digital Product Passport (DPP) VC Schema Builder
 * Builds W3C Verifiable Credential payloads for agricultural products
 */

export interface DPPOptions {
    batchId: string;
    issuerName: string;
    issuerDID?: string;
    issuanceDate?: string;
    expirationDate?: string;
    exporter: {
        name: string;
        id?: string;
        contact?: string;
        location?: string;
    };
    product: {
        name: string;
        variety?: string;
        origin?: string;
        weight?: string;
        grade?: string;
        quantity?: string;
    };
    inspectionResults: {
        grade: string;
        moisture: number;
        pesticideLevel: string;
        heavyMetalTest: string;
        isoCode?: string;
        inspectedAt?: string;
        inspectorId?: string;
        notes?: string;
    };
    attachments?: string[]; // Storage URLs for lab reports, photos, etc.
    destination?: string;
}

/**
 * Builds a W3C Verifiable Credential payload for Digital Product Passport
 * Compatible with Inji Certify and MOSIP standards
 */
export const buildDigitalProductPassport = (opts: DPPOptions) => {
    const issuanceDate = opts.issuanceDate ?? new Date().toISOString();
    const expirationDate = opts.expirationDate ??
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year default

    const issuerDID = opts.issuerDID ?? `did:web:agriqcert.app:${opts.issuerName.toLowerCase().replace(/\s+/g, '-')}`;
    const subjectDID = `did:web:exporter.app:${opts.exporter.name.toLowerCase().replace(/\s+/g, '-')}`;

    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/traceability/v1"
        ],
        "type": ["VerifiableCredential", "DigitalProductPassport", "AgriculturalProductCredential"],
        "id": `urn:uuid:${opts.batchId}`,
        "issuer": {
            "id": issuerDID,
            "name": opts.issuerName
        },
        "issuanceDate": issuanceDate,
        "expirationDate": expirationDate,
        "credentialSubject": {
            "id": subjectDID,
            "type": "AgriculturalProduct",

            // Batch Information
            "batchId": opts.batchId,

            // Exporter Details
            "exporter": {
                "name": opts.exporter.name,
                "id": opts.exporter.id,
                "contact": opts.exporter.contact,
                "location": opts.exporter.location
            },

            // Product Details
            "product": {
                "name": opts.product.name,
                "variety": opts.product.variety,
                "origin": opts.product.origin,
                "weight": opts.product.weight,
                "grade": opts.product.grade,
                "quantity": opts.product.quantity
            },

            // Quality & Inspection Results
            "qualityAssurance": {
                "grade": opts.inspectionResults.grade,
                "moistureContent": `${opts.inspectionResults.moisture}%`,
                "pesticideLevel": opts.inspectionResults.pesticideLevel,
                "heavyMetalTest": opts.inspectionResults.heavyMetalTest,
                "isoStandard": opts.inspectionResults.isoCode || "ISO 22000",
                "inspectedAt": opts.inspectionResults.inspectedAt,
                "inspectorId": opts.inspectionResults.inspectorId,
                "notes": opts.inspectionResults.notes
            },

            // Destination
            "destination": opts.destination,

            // Supporting Documents
            "attachments": opts.attachments ?? []
        }
    };
};

/**
 * Builds a minimal VC payload for offline QR codes (PixelPass)
 * This is a compressed version for QR encoding
 */
export const buildMinimalVC = (opts: {
    id: string;
    product: string;
    grade: string;
    status: 'VALID' | 'REVOKED' | 'EXPIRED';
    issuedAt: string;
    expiresAt: string;
    issuer: string;
}) => {
    return {
        id: opts.id,
        prod: opts.product,
        grade: opts.grade,
        stat: opts.status === 'VALID' ? 'V' : opts.status === 'REVOKED' ? 'R' : 'E',
        date: opts.issuedAt,
        exp: opts.expiresAt,
        iss: opts.issuer
    };
};
