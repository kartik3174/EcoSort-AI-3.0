"use server";

import {
  analyzeWaste,
  type WasteAnalysisInput,
  type WasteAnalysisOutput,
} from "@/ai/flows/hazardous-waste-detection-flow";

export async function analyzeLitterImage(
  input: WasteAnalysisInput
): Promise<WasteAnalysisOutput> {
  try {
    const result = await analyzeWaste(input);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isQuotaError = errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429");

    if (isQuotaError) {
      console.warn("AI Quota Exceeded. Falling back to simulated data for demonstration.");
    } else {
      console.error("Error in waste analysis flow:", error);
    }

    // Fallback to mock data for development/demo purposes when API quota is hit or fails
    // This allows the user to continue testing the flow without interruption.
    return {
      wasteType: "Simulated: Mixed Plastic & Paper",
      description:
        "AI Analysis (Simulated): A collection of single-use plastic bottles and paper wrappers found near a public pathway. The items appear dry but scattered.",
      isHazardous: false,
      recyclingInstructions:
        "Separate the plastic bottles from the paper. Plastic bottles (PET #1) should be emptied and crushed. Paper should be kept dry if possible for recycling.",
      hazardousMaterials: [],
      cleanupGuidelines: [
        "Wear protective gloves to handle the waste.",
        "Use a separate bag for the recyclable plastic bottles.",
        "Ensure no broken glass or sharp objects are hidden underneath the paper.",
        "Dispose of non-recyclable wrappers in the general waste bin."
      ],
    };
  }
}
