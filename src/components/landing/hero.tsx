"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building } from "lucide-react";

export function Hero() {
  return (
    <div className="container mx-auto flex h-full items-center justify-center">
      <div className="text-center">
        <Card className="glassmorphism max-w-2xl p-6 md:p-10 shadow-2xl">
          <CardContent className="flex flex-col items-center gap-6 p-0">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground drop-shadow-md font-headline">
              EcoSort AI — Tag the Litter, Clean the City
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-primary-foreground/90">
              Report litter, track cleanup, and help authorities keep the city clean.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="transition-transform hover:scale-105">
                <Link href="/login?redirect=/citizen/dashboard">
                  <User />
                  Continue as Citizen
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="transition-transform hover:scale-105">
                <Link href="/login?redirect=/official/overview">
                  <Building />
                  Continue as City Official
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
