"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StrokeRiskResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { RiskBadge } from "@/components/shared/RiskBadge";

const BrainScanHero = dynamic(() => import("@/components/shared/BrainScanHero").then((mod) => mod.BrainScanHero), {
    ssr: false,
    loading: () => <div className="h-64 w-64 bg-muted/20 animate-pulse rounded-full" />
});
import { AlertTriangle, CheckCircle, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResultsPage() {
    const [result, setResult] = useState<StrokeRiskResult | null>(null);

    useEffect(() => {
        // In a real app, we'd fetch by ID. Here we fetch "latest" or use mock.
        // For demo, we'll generate a random result if none exists or fetch from history.
        api.history.getScans().then(scans => {
            if (scans.length > 0) setResult(scans[0]);
            else {
                // Fallback mock
                setResult({
                    riskScore: 15,
                    riskLevel: 'LOW',
                    confidence: 92,
                    factors: [],
                    recommendations: ["Maintain healthy lifestyle"],
                    timestamp: new Date().toISOString(),
                })
            }
        });
    }, []);

    if (!result) return <div className="p-8 text-center">Loading analysis...</div>;

    return (
        <div className="container py-8 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Analysis Complete</h1>
                <p className="text-muted-foreground">Here are the results of your stroke risk assessment.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-2 border-blue-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Risk Assessment
                            <RiskBadge level={result.riskLevel} className="text-lg px-4 py-1" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="relative">
                                <BrainScanHero />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-blue-900">{result.riskScore}%</span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">AI Confidence Score: {result.confidence}%</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium">Detected Factors:</h3>
                            {result.factors.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {result.factors.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle className="h-4 w-4" />
                                    No significant risk factors detected
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                        <span className="text-sm">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-100">
                        <CardHeader>
                            <CardTitle className="text-red-900 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Know the Signs (FAST)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">F</div>
                                <div className="text-xs font-medium">Face Drooping</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">A</div>
                                <div className="text-xs font-medium">Arm Weakness</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">S</div>
                                <div className="text-xs font-medium">Speech Difficulty</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">T</div>
                                <div className="text-xs font-medium">Time to Call</div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Link href="/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full">Back to Dashboard</Button>
                        </Link>
                        {result.riskLevel === 'HIGH' && (
                            <Link href="/emergency" className="flex-1">
                                <Button variant="destructive" className="w-full gap-2">
                                    <Phone className="h-4 w-4" /> Call Emergency
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
