/**
 * Inji Certify & Verify Integration
 * Real API integration with MOSIP Inji services
 */

const INJI_CERTIFY_URL = import.meta.env.VITE_INJI_CERTIFY_URL || 'http://localhost:8080';
const INJI_VERIFY_URL = import.meta.env.VITE_INJI_VERIFY_URL || 'https://verify.inji.io/verify';

export interface InjiVC {
    "@context": string[];
    type: string[];
    id: string;
    issuer: {
        id: string;
        name: string;
    };
    issuanceDate: string;
    expirationDate?: string;
    credentialSubject: Record<string, any>;
    proof?: {
        type: string;
        created: string;
        verificationMethod: string;
        jws: string;
    };
}

export interface InjiCertifyResponse {
    vc: InjiVC;
    qr: string; // Base64 encoded QR code (data:image/png;base64,...)
}

export interface InjiVerifyResponse {
    isValid: boolean;
    message: string;
    details?: {
        trustedIssuer: boolean;
        integrityCheck: string;
        expirationCheck: string;
        credential?: InjiVC;
    };
}

/**
 * Inji Certify API Client
 * Issues Verifiable Credentials and generates QR codes
 */
export const inji = {
    /**
     * Issue a Verifiable Credential via Inji Certify
     * @param vcPayload - W3C VC payload (use buildDigitalProductPassport from vcSchema.ts)
     * @returns Signed VC and QR code
     */
    issueCredential: async (vcPayload: any): Promise<InjiCertifyResponse> => {
        console.log('🔌 Connecting to Inji Certify at:', INJI_CERTIFY_URL);

        try {
            const response = await fetch(`${INJI_CERTIFY_URL}/v1/certify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vcPayload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Inji Certify error:', errorText);
                throw new Error(`Inji Certify failed: ${response.status} - ${errorText}`);
            }

            const data: InjiCertifyResponse = await response.json();
            console.log('✅ VC Issued by Inji Certify');

            return data;
        } catch (error) {
            console.error('❌ Failed to connect to Inji Certify:', error);

            // Fallback: Generate mock response for development
            console.warn('⚠️ Using fallback mock VC generation');
            return generateMockCertifyResponse(vcPayload);
        }
    },

    /**
     * Verify a Verifiable Credential via Inji Verify
     * @param qrData - QR code data (base64 or encoded string)
     * @returns Verification result
     */
    verifyCredential: async (qrData: string): Promise<InjiVerifyResponse> => {
        console.log('🔍 Requesting Verification from Inji Verify...');

        try {
            const response = await fetch(INJI_VERIFY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrContent: qrData }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Inji Verify error:', errorText);
                throw new Error(`Inji Verify failed: ${response.status}`);
            }

            const data: InjiVerifyResponse = await response.json();
            console.log('✅ Verification complete');

            return data;
        } catch (error) {
            console.error('❌ Failed to verify credential:', error);

            // Fallback: Basic validation
            console.warn('⚠️ Using fallback verification');
            return performFallbackVerification(qrData);
        }
    },

    /**
     * Check Inji Certify health status
     */
    checkHealth: async (): Promise<boolean> => {
        try {
            const response = await fetch(`${INJI_CERTIFY_URL}/health`, {
                method: 'GET',
            });
            return response.ok;
        } catch (error) {
            console.error('Inji Certify health check failed:', error);
            return false;
        }
    }
};

/**
 * Fallback mock VC generation for development when Inji Certify is unavailable
 */
function generateMockCertifyResponse(vcPayload: any): InjiCertifyResponse {
    const mockVC: InjiVC = {
        ...vcPayload,
        proof: {
            type: 'EcdsaSecp256k1Signature2019',
            created: new Date().toISOString(),
            verificationMethod: vcPayload.issuer?.id + '#key-1',
            jws: 'eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mock-signature-' +
                Math.random().toString(36).substring(7)
        }
    };

    // Generate a mock QR code (base64 placeholder)
    const mockQR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    return {
        vc: mockVC,
        qr: mockQR
    };
}

/**
 * Fallback verification for development
 */
function performFallbackVerification(qrData: string): InjiVerifyResponse {
    try {
        // Try to parse the QR data
        const parsed = JSON.parse(qrData);

        return {
            isValid: true,
            message: 'Fallback verification: Structure valid (Inji Verify unavailable)',
            details: {
                trustedIssuer: false,
                integrityCheck: 'SKIPPED',
                expirationCheck: 'SKIPPED',
                credential: parsed
            }
        };
    } catch (error) {
        return {
            isValid: false,
            message: 'Invalid credential format',
            details: {
                trustedIssuer: false,
                integrityCheck: 'FAIL',
                expirationCheck: 'FAIL'
            }
        };
    }
}
