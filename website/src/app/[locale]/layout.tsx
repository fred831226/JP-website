export function generateStaticParams() {
  return [{ locale: "zh-tw" }];
}

export default function LocaleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
