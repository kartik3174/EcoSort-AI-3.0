"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Shield, Palette, Globe, User, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
        >
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Settings className="w-7 h-7 text-white/60" />
                    Settings
                </h1>
                <p className="text-sm text-white/40 mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-400" /> Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold">
                            AK
                        </div>
                        <div>
                            <Button size="sm" variant="outline" className="border-white/[0.08] text-white/50 text-xs">
                                Change Avatar
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-white/40">Full Name</Label>
                            <Input defaultValue="Arun Kumar" className="mt-1 bg-white/[0.04] border-white/[0.08] text-sm" />
                        </div>
                        <div>
                            <Label className="text-xs text-white/40">Email</Label>
                            <Input defaultValue="arun.kumar@email.com" className="mt-1 bg-white/[0.04] border-white/[0.08] text-sm" />
                        </div>
                        <div>
                            <Label className="text-xs text-white/40">City</Label>
                            <Input defaultValue="Chennai" className="mt-1 bg-white/[0.04] border-white/[0.08] text-sm" />
                        </div>
                        <div>
                            <Label className="text-xs text-white/40">Phone</Label>
                            <Input defaultValue="+91 98765 43210" className="mt-1 bg-white/[0.04] border-white/[0.08] text-sm" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" /> Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { label: "Hazardous waste alerts nearby", desc: "Get notified when hazardous waste is detected within 2km", default: true },
                        { label: "Cleanup events", desc: "Notifications about upcoming community cleanups", default: true },
                        { label: "Report updates", desc: "When your reports are verified or cleaned", default: true },
                        { label: "Eco points earned", desc: "Notifications when you earn new points", default: false },
                        { label: "Weekly summary", desc: "Weekly email digest of city waste metrics", default: false },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-xs font-medium text-white/80">{item.label}</p>
                                <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
                            </div>
                            <Switch defaultChecked={item.default} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-violet-400" /> Appearance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-white/80">Theme</p>
                            <p className="text-[10px] text-white/30">Choose your preferred theme</p>
                        </div>
                        <Select defaultValue="dark">
                            <SelectTrigger className="w-32 h-8 bg-white/[0.04] border-white/[0.08] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[hsl(220,20%,12%)] border-white/[0.08]">
                                <SelectItem value="dark" className="text-white/70 focus:bg-white/[0.06] text-xs">Dark</SelectItem>
                                <SelectItem value="light" className="text-white/70 focus:bg-white/[0.06] text-xs">Light</SelectItem>
                                <SelectItem value="system" className="text-white/70 focus:bg-white/[0.06] text-xs">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-white/80">Language</p>
                            <p className="text-[10px] text-white/30">Select display language</p>
                        </div>
                        <Select defaultValue="en">
                            <SelectTrigger className="w-32 h-8 bg-white/[0.04] border-white/[0.08] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[hsl(220,20%,12%)] border-white/[0.08]">
                                <SelectItem value="en" className="text-white/70 focus:bg-white/[0.06] text-xs">English</SelectItem>
                                <SelectItem value="ta" className="text-white/70 focus:bg-white/[0.06] text-xs">Tamil</SelectItem>
                                <SelectItem value="hi" className="text-white/70 focus:bg-white/[0.06] text-xs">Hindi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-teal-400" /> Privacy & Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-xs font-medium text-white/80">Show on leaderboard</p>
                            <p className="text-[10px] text-white/30">Display your name publicly</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-xs font-medium text-white/80">Share location data</p>
                            <p className="text-[10px] text-white/30">Allow location for waste reports</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="gradient-primary text-white border-0 px-8">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>
        </motion.div>
    );
}
