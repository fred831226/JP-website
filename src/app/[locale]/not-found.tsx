import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <PageShell padding="xl">
      <SectionHeader
        title="找不到此頁面"
        description="您要求的頁面不存在或已被移除。請檢查網址是否正確。"
      />
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href="/zh-tw/products">瀏覽產品</ButtonLink>
        <ButtonLink href="/zh-tw/contact" variant="secondary">
          聯絡我們
        </ButtonLink>
      </div>
    </PageShell>
  );
}
