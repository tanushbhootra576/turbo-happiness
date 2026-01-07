"use client";

import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function EmergencyPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 text-center bg-red-50">
            <div className="max-w-md space-y-8">
                <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-red-900">Stroke Emergency</h1>
                    <p className="text-xl text-red-700">
                        If you suspect a stroke, every second counts.
                    </p>
                </div>

                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Button
                        size="lg"
                        className="w-full h-32 text-4xl font-bold bg-red-600 hover:bg-red-700 shadow-xl rounded-2xl gap-4"
                        onClick={() => window.location.href = "tel:108"}
                    >
                        <Phone className="h-12 w-12" />
                        CALL 108
                    </Button>
                </motion.div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 text-left space-y-4">
                    <h3 className="font-bold text-lg">While waiting for ambulance:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Keep the patient calm and comfortable.</li>
                        <li>Loosen tight clothing.</li>
                        <li>Do NOT give them food or water.</li>
                        <li>Note the time when symptoms started.</li>
                        <li>If they fall unconscious, check breathing and perform CPR if needed.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
