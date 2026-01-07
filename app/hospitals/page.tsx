"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Hospital } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HospitalsPage() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock location
        api.hospitals.findNearest(40.7128, -74.0060)
            .then(setHospitals)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Locating nearby centers...</div>;

    return (
        <div className="container py-8 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Nearby Stroke Centers</h1>
                <p className="text-muted-foreground">
                    Primary Stroke Centers prioritized. In an emergency, call 108 immediately.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hospitals.map((hospital) => (
                    <Card key={hospital.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-lg">{hospital.name}</CardTitle>
                                {hospital.isPrimaryStrokeCenter && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        Primary Center
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{hospital.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4 shrink-0" />
                                    <span>{hospital.distance} km away</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 shrink-0" />
                                    <span>~{hospital.waitTime} min wait time</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4">
                                <Button className="flex-1 gap-2" variant="outline">
                                    <Phone className="h-4 w-4" /> Call
                                </Button>
                                <Button className="flex-1 gap-2">
                                    <Navigation className="h-4 w-4" /> Directions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
