import { PageHeader } from "@/components/shared/page-header";
import { BeforeAfterUpload } from "@/components/features/cleanup/before-after-upload";

export default function BeforeAfterStats() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Cleanup Verification"
                description="Upload evidence of completed cleanups to verify impact and close reports."
            />
            <BeforeAfterUpload />
        </div>
    );
}
