"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";

const Sparkline = dynamic(
  () => import("@/components/shared/Sparkline").then((mod) => mod.Sparkline),
  {
    ssr: false,
    loading: () => (
      <div className="h-[50px] w-full bg-muted/20 animate-pulse rounded" />
    ),
  }
);
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Brain, Activity, History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth() as any;
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      api.profile.get().then((profile) => {
        if (!profile) {
          router.push("/profile");
        }
      });
    }
  }, [loading, user, router]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <RequireAuth>
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, {user?.displayName || user?.email}
            </h1>
            <p className="text-muted-foreground">
              Here is your stroke risk overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="outline">View Profile</Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Risk
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">LOW</div>
              <p className="text-xs text-muted-foreground">
                Based on last scan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 days ago</div>
              <p className="text-xs text-muted-foreground">Oct 24, 2023</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Sparkline
                data={[
                  { date: "1", value: 10 },
                  { date: "2", value: 15 },
                  { date: "3", value: 12 },
                  { date: "4", value: 20 },
                  { date: "5", value: 15 },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/scan">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none overflow-hidden relative">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform translate-x-12" />
              <CardContent className="flex items-center justify-between p-8 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="h-8 w-8" />
                    Start Face Scan
                  </h2>
                  <p className="text-blue-100 max-w-md">
                    Perform a quick 30-second AI analysis of your facial
                    features to detect early signs of stroke risk.
                  </p>
                </div>
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <div className="text-right">
          <Link href="/analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">Scan #{i}</p>
                      <p className="text-sm text-muted-foreground">
                        Oct {20 + i}, 2023
                      </p>
                    </div>
                    <RiskBadge level="LOW" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Maintain regular sleep schedule</li>
                <li>Monitor blood pressure weekly</li>
                <li>Stay hydrated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
