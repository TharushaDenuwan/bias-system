import AdList from "@/features/admin/ad/components/ad-list";
import CreateNewAd from "@/features/admin/ad/components/create-new-ad";

export default function AdManagementPage() {
  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ad Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your ads
          </p>
        </div>
        <CreateNewAd />
      </div>

      <AdList />
    </div>
  );
}
