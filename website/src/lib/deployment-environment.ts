export type DeploymentKind = "production" | "preview" | "development";

export type DeploymentEnvironment = {
  kind: DeploymentKind;
  isProduction: boolean;
  isIndexable: boolean;
  label: "預覽環境" | "開發環境" | null;
};

export function classifyDeploymentEnvironment(value = process.env.VERCEL_ENV): DeploymentEnvironment {
  if (value === "production") {
    return { kind: "production", isProduction: true, isIndexable: true, label: null };
  }
  if (value === "preview") {
    return { kind: "preview", isProduction: false, isIndexable: false, label: "預覽環境" };
  }
  return { kind: "development", isProduction: false, isIndexable: false, label: "開發環境" };
}

export function getIndexingHeaders(value = process.env.VERCEL_ENV) {
  if (classifyDeploymentEnvironment(value).isIndexable) return [];
  return [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
}

export function shouldShowPreviewBanner(environment: DeploymentEnvironment) {
  return !environment.isProduction && environment.label !== null;
}

export function getRobotsPolicy(value = process.env.VERCEL_ENV) {
  if (!classifyDeploymentEnvironment(value).isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.jp-pump.com.tw/sitemap.xml",
  };
}
