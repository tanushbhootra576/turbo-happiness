"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Loader2, Camera, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ScanPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const router = useRouter();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsScanning(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow camera permissions.");
        }
    };

    const handleScanComplete = useCallback(async () => {
        setIsScanning(false);
        setIsAnalyzing(true);

        // Stop camera
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }

        try {
            // Simulate sending frame
            await api.scan.submit("mock-image-data");
            router.push("/results");
        } catch (error) {
            console.error("Analysis failed:", error);
            setIsAnalyzing(false);
        }
    }, [router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScanning && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((c) => c - 1);
            }, 1000);
        } else if (countdown === 0 && isScanning) {
            handleScanComplete();
        }
        return () => clearInterval(interval);
    }, [isScanning, countdown, handleScanComplete]);

    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <div className="w-full max-w-2xl space-y-8 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Face Analysis Scan</h1>
                    <p className="text-muted-foreground">
                        Position your face within the frame. Keep still for 30 seconds.
                    </p>
                </div>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-blue-900/20">
                    {!isScanning && !isAnalyzing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10">
                            <Button size="lg" onClick={startCamera} className="gap-2 text-lg h-16 px-8">
                                <Camera className="h-6 w-6" />
                                Enable Camera & Start
                            </Button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/90 z-20 text-white">
                            <Loader2 className="h-16 w-16 animate-spin mb-4" />
                            <h2 className="text-2xl font-bold">Analyzing Facial Features...</h2>
                            <p className="text-blue-200">Detecting asymmetry and micro-expressions</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />

                    {isScanning && (
                        <>
                            {/* Face Overlay SVG */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
                                <div className="w-64 h-64 border-4 border-blue-500/30 rounded-[40%] animate-pulse" />
                            </div>

                            {/* Countdown */}
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full font-mono text-xl backdrop-blur-sm">
                                00:{countdown.toString().padStart(2, '0')}
                            </div>

                            {/* Progress Bar */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-2 bg-blue-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 30, ease: "linear" }}
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                        <p>Good Lighting</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                        <p>Remove Glasses</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</div>
                        <p>Neutral Expression</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
