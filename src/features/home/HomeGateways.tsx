import RevealSection from "@/components/RevealSection";
import GatewayBlock, { type Gateway } from "@/features/content/GatewayBlock";

type HomeGatewaysProps = {
  gateways: Gateway[];
};

export default function HomeGateways({ gateways }: HomeGatewaysProps) {
  return (
    <section className="gateways-section relative overflow-hidden">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
        <RevealSection className="mb-10 max-w-[600px]">
          <p className="mb-2 text-sm font-[650] text-[var(--color-action)]">產品與服務</p>
          <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
            從產品探索到工程支援，選擇下一步
          </h2>
          <p className="mt-3 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
            此區負責說明網站的三條主要路徑，不重複 Hero 篩選器。
          </p>
        </RevealSection>
        <RevealSection delayMs={100}>
          <GatewayBlock gateways={gateways} />
        </RevealSection>
      </div>
    </section>
  );
}
