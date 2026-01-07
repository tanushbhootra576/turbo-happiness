export interface StrokeRiskResult {
    riskScore: number; // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number; // 0-100
    factors: string[];
    recommendations: string[];
    timestamp: string;
}

export interface MedicalProfile {
    id: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    systolicBP: number;
    diastolicBP: number;
    bmi: number;
    hasHypertension: boolean;
    hasHeartDisease: boolean;
    hasDiabetes: boolean;
    smokingStatus: 'never' | 'former' | 'current';
    activityLevel: 'sedentary' | 'moderate' | 'active';
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    phone: string;
    distance: number; // in km
    isPrimaryStrokeCenter: boolean;
    coordinates: {
        lat: number;
        lng: number;
    };
    waitTime?: number; // in minutes
}

export interface User {
    id: string;
    email: string;
    name: string;
    profile?: MedicalProfile;
    history: StrokeRiskResult[];
}
