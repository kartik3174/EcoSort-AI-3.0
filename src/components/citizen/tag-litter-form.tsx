
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Upload,
  Loader2,
  MapPin,
  Map as MapIcon,
  ClipboardList,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Recycle as RecycleIcon,
  Info,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { analyzeLitterImage } from "@/app/citizen/tag-litter/actions";
import { submitReport } from "@/app/citizen/tag-litter/report-action";
import type { WasteAnalysisOutput } from "@/ai/flows/hazardous-waste-detection-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "@firebase/auth";

type SubmissionStatus = "idle" | "success";
type Tag = "still_there" | "picked_up" | "hazardous" | "recyclable";

export function TagLitterForm() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<Tag | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [aiResult, setAiResult] = useState<WasteAnalysisOutput | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      setLocation("Detecting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
          setLocation(newLocation);
          setCoords({ lat: latitude, lng: longitude });
          setIsLocating(false);
          toast({
            title: "Location Detected",
            description: "Your current location has been automatically added to the report.",
          });
        },
        () => {
          setIsLocating(false);
          setLocation("Could not get location. Please enable permissions.");
          toast({
            variant: "destructive",
            title: "Location Access Denied",
            description: "Please enable location permissions in your browser to auto-tag locations.",
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocation("Geolocation is not supported by your browser.");
      toast({
        variant: "destructive",
        title: "Location Not Supported",
        description: "Your browser does not support geolocation.",
      });
    }
  };

  useEffect(() => {
    if (imageDataUri) {
      startAnalyzing(async () => {
        const result = await analyzeLitterImage({ photoDataUri: imageDataUri });
        setAiResult(result);
        setDescription(result.description);
        if (result.isHazardous) {
          setTag("hazardous");
        } else {
          setTag("still_there");
        }
        toast({
          title: `AI Analysis: ${result.wasteType}`,
          description: result.recyclingInstructions || "Details have been added to your report.",
          variant: result.isHazardous ? 'destructive' : 'default',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUri]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCameraStream = async () => {
    stopCameraStream(); // Ensure any existing stream is stopped
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Camera Not Supported",
        description: "Your browser does not support camera access.",
      });
      setHasCameraPermission(false);
      setIsCameraOpen(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      setIsCameraOpen(false);

      let title = "Camera Error";
      let description = "An unexpected error occurred while accessing the camera.";

      if (error.name === 'NotAllowedError') {
        title = "Camera Access Denied";
        description = "Please enable camera permissions in your browser settings to use this feature.";
      } else if (error.name === 'NotFoundError') {
        title = "No Camera Found";
        description = "We couldn't find a camera on your device. Please connect a camera and try again.";
      } else if (error.name === 'NotReadableError') {
        title = "Could Not Access Camera";
        description = "Could not start video source. The camera might be in use by another application or there might be a hardware issue.";
      }

      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleGetLocation();
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const dataUriReader = new FileReader();
      dataUriReader.onload = (e) => {
        setImageDataUri(e.target?.result as string);
      };
      dataUriReader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCapturePhotoClick = () => {
    setIsCameraOpen(true);
    startCameraStream();
  };

  const handleCancelCamera = () => {
    setIsCameraOpen(false);
    stopCameraStream();
  }

  const handleTakePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
        handleGetLocation();
      }
      handleCancelCamera();
    }
  };

  const handleTagSelect = (selectedTag: Tag) => {
    setTag(selectedTag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !tag) {
      toast({
        variant: "destructive",
        title: "Incomplete Report",
        description: "Please upload a photo and select a tag.",
      });
      return;
    }
    setIsSubmitting(true);
    setIsSubmitting(true);

    try {
      const reportResult = await submitReport({
        location: manualAddress || location || "Unknown Location",
        description: description,
        wasteType: aiResult?.wasteType || "Unidentified",
        isHazardous: tag === 'hazardous',
        recyclingInstructions: aiResult?.recyclingInstructions,
        hazardousMaterials: aiResult?.hazardousMaterials,
        cleanupGuidelines: aiResult?.cleanupGuidelines,
        // In a real app, upload the image to storage and pass the URL. 
        // Passing the data URI to the server action for now (be mindful of payload size limits).
        imageDataUri: imageDataUri || undefined,
        lat: coords?.lat,
        lng: coords?.lng
      });

      if (reportResult.success) {
        // Update local session data for the demo
        const uid = user?.uid || 'guest';
        const storageKey = `ecosort_session_${uid}`;
        const savedData = localStorage.getItem(storageKey);
        let session = savedData ? JSON.parse(savedData) : { reports: 0, points: 0, level: 1, hasActivity: true };

        session.reports = (session.reports || 0) + 1;
        session.points = (session.points || 0) + 100;
        session.level = Math.floor(session.points / 500) + 1;
        session.hasActivity = true;

        localStorage.setItem(storageKey, JSON.stringify(session));

        setSubmissionStatus("success");
        if (tag === 'hazardous') {
          toast({
            variant: "destructive",
            title: "⚠️ Hazardous Litter Reported",
            description: "A priority alert has been sent to the authorities. Thank you for your vigilance.",
            duration: 9000,
          });
        } else {
          toast({
            title: "✅ Report Submitted",
            description: "Thank you for helping keep our city clean!",
          });
        }
      } else {
        throw new Error((reportResult as any).message || "Submission failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem submitting your report. Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setImageDataUri(null);
    setDescription("");
    setTag(null);
    setSubmissionStatus("idle");
    setAiResult(null);
    setIsCameraOpen(false);
    setIsCameraOpen(false);
    setLocation(null);
    setCoords(null);
    setIsLocating(false);
    stopCameraStream();
    setManualAddress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (submissionStatus === "success") {
    return (
      <Card className="max-w-2xl mx-auto text-center p-8">
        <CardContent className="p-0">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Submitted Successfully</h2>
          <p className="text-muted-foreground mb-6">
            Your report has been sent to the city officials. Thank you for your contribution!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/citizen/map">
                <MapIcon /> View on Map
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/citizen/my-reports">
                <ClipboardList /> View My Reports
              </Link>
            </Button>
          </div>
          <Button variant="link" onClick={resetForm} className="mt-4">Submit Another Report</Button>
        </CardContent>
      </Card>
    );
  }

  const tagOptions: { id: Tag, label: string, icon: React.ElementType, variant: "destructive" | "default" | "secondary" }[] = [
    { id: 'hazardous', label: 'Hazardous Waste', icon: ShieldAlert, variant: 'destructive' },
    { id: 'still_there', label: 'Still There', icon: Trash2, variant: 'secondary' },
    { id: 'picked_up', label: 'Picked Up', icon: CheckCircle2, variant: 'secondary' },
    { id: 'recyclable', label: 'Recyclable', icon: RecycleIcon, variant: 'secondary' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-start">
          <div>
            {isCameraOpen ? (
              <div className="relative w-full aspect-video border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-center p-4 bg-black">
                <video ref={videoRef} className="w-full h-full rounded-md object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="absolute bottom-20 left-4 right-4 w-auto z-10">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                  </Alert>
                )}
                <div className="absolute bottom-4 flex gap-4 z-10">
                  <Button type="button" onClick={handleTakePicture} disabled={!hasCameraPermission}>
                    <Camera /> Take Picture
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancelCamera}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : !imagePreview ? (
              <div className="relative w-full aspect-video border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-primary/5 hover:bg-primary/10 transition-all group/upload cursor-pointer overflow-hidden">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform shadow-inner">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-black text-xl tracking-tight text-primary">Capture or Upload</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">Click anywhere to take a photo or upload from your device</p>

                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                />

                <div className="flex gap-4 mt-6 pointer-events-none">
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-4 py-2 rounded-full border text-xs font-bold shadow-sm">
                    <Upload className="h-4 w-4" /> BROWSE
                  </div>
                  <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">
                    <Camera className="h-4 w-4" /> CAPTURE
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image src={imagePreview} alt="Litter preview" layout="fill" objectFit="cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                <Button type="button" variant="destructive" size="sm" onClick={resetForm} className="absolute top-2 right-2 z-10">
                  <Trash2 className="h-4 w-4 mr-2" /> Change Photo
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {imagePreview && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Tag Litter</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {tagOptions.map((opt) => (
                      <Button
                        key={opt.id}
                        type="button"
                        variant={tag === opt.id ? opt.variant : "outline"}
                        onClick={() => handleTagSelect(opt.id)}
                        className={cn("justify-start h-12", tag === opt.id && "ring-2 ring-primary")}
                      >
                        <opt.icon className="h-5 w-5 mr-2" />
                        <span>{opt.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted rounded-md">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>AI is analyzing the image...</span>
                  </div>
                )}

                {aiResult && !isAnalyzing && (
                  <>
                    <Alert variant={aiResult.isHazardous ? "destructive" : "default"}>
                      {aiResult.isHazardous ? <ShieldAlert className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                      <AlertTitle>AI Analysis: {aiResult.wasteType}</AlertTitle>
                      <AlertDescription>
                        {aiResult.recyclingInstructions}
                        {aiResult.isHazardous && aiResult.hazardousMaterials && aiResult.hazardousMaterials.length > 0 && (
                          <div className="mt-2">
                            <strong>Identified Hazards: </strong>
                            {aiResult.hazardousMaterials.map((mat) => (
                              <Badge key={mat} variant="destructive" className="mr-1">
                                {mat}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                    {aiResult.cleanupGuidelines && aiResult.cleanupGuidelines.length > 0 && (
                      <Alert variant="default" className="mt-4">
                        <ClipboardCheck className="h-4 w-4" />
                        <AlertTitle>Cleanup Guidelines</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 space-y-1 text-foreground">
                            {aiResult.cleanupGuidelines.map((guideline, index) => (
                              <li key={index}>{guideline.replace(/^\d+\.\s*/, '')}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>
                        {isLocating ? "Detecting location..." : (location || "Auto-location depends on browser permissions.")}
                      </span>
                    </div>
                    <Input
                      placeholder="Or enter manual address/landmark (e.g. 'Near Central Park Gate 2')"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Additional Details (AI Generated)</h3>
                  <Textarea
                    placeholder="Add description (e.g., 'behind the bus stop', 'large pile of plastic bottles')"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting || isAnalyzing || !tag}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Litter Report"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
