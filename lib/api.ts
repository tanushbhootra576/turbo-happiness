import { Hospital, MedicalProfile, StrokeRiskResult, User } from "./types";
import { LoginInput, ProfileInput, SignupInput } from "./validators";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data
const MOCK_USER: User = {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    profile: {
        id: "1",
        age: 45,
        gender: "male",
        systolicBP: 120,
        diastolicBP: 80,
        bmi: 24,
        hasHypertension: false,
        hasHeartDisease: false,
        hasDiabetes: false,
        smokingStatus: "never",
        activityLevel: "moderate",
    },
    history: [],
};

const MOCK_HOSPITALS: Hospital[] = [
    {
        id: "1",
        name: "City General Hospital",
        address: "123 Main St, Metropolis",
        phone: "+1 555-0123",
        distance: 2.5,
        isPrimaryStrokeCenter: true,
        coordinates: { lat: 40.7128, lng: -74.0060 },
        waitTime: 15,
    },
    {
        id: "2",
        name: "Westside Medical Center",
        address: "456 West Ave, Metropolis",
        phone: "+1 555-0456",
        distance: 4.2,
        isPrimaryStrokeCenter: false,
        coordinates: { lat: 40.7200, lng: -74.0100 },
        waitTime: 30,
    },
];

export const api = {
    auth: {
        login: async (data: LoginInput): Promise<User> => {
            await delay(1000);
            if (data.email === "user@example.com" && data.password === "password123") {
                return MOCK_USER;
            }
            throw new Error("Invalid credentials");
        },
        signup: async (data: SignupInput): Promise<User> => {
            await delay(1000);
            return { ...MOCK_USER, email: data.email, name: data.name };
        },
        logout: async () => {
            await delay(500);
        },
    },
    profile: {
        get: async (): Promise<MedicalProfile | undefined> => {
            await delay(500);
            return MOCK_USER.profile;
        },
        update: async (data: ProfileInput): Promise<MedicalProfile> => {
            await delay(1000);
            return { ...MOCK_USER.profile!, ...data, id: "1" };
        },
    },
    scan: {
        submit: async (imageData: string): Promise<StrokeRiskResult> => {
            await delay(2000); // Simulate processing
            // Randomize result for demo
            const riskScore = Math.floor(Math.random() * 100);
            let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
            if (riskScore > 30) riskLevel = 'MEDIUM';
            if (riskScore > 70) riskLevel = 'HIGH';

            return {
                riskScore,
                riskLevel,
                confidence: 85 + Math.floor(Math.random() * 10),
                factors: ["Facial asymmetry detected", "Slurred speech patterns (simulated)"],
                recommendations: riskLevel === 'HIGH'
                    ? ["Call Emergency Services immediately", "Do not drive yourself"]
                    : ["Monitor symptoms", "Consult a doctor"],
                timestamp: new Date().toISOString(),
            };
        },
    },
    hospitals: {
        findNearest: async (lat: number, lng: number): Promise<Hospital[]> => {
            await delay(1000);
            return MOCK_HOSPITALS;
        },
    },
    history: {
        getScans: async (): Promise<StrokeRiskResult[]> => {
            await delay(500);
            return [
                {
                    riskScore: 15,
                    riskLevel: 'LOW',
                    confidence: 92,
                    factors: [],
                    recommendations: ["All clear"],
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                }
            ];
        },
    },
};
