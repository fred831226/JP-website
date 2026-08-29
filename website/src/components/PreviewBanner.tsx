import { shouldShowPreviewBanner, type DeploymentEnvironment } from "@/lib/deployment-environment";

export default function PreviewBanner({ environment }: { environment: DeploymentEnvironment }) {
  if (!shouldShowPreviewBanner(environment)) return null;

  return (
    <div
      role="region"
      aria-label="非正式環境"
      className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950"
    >
      {environment.label}｜內容尚未正式發布，請勿作為正式網站引用
    </div>
  );
}
