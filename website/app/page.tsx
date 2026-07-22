"use client";

import { FormEvent, useState } from "react";

const productUses = [
  {
    code: "01",
    title: "污水處理",
    description: "從污水與排水情境切入，快速查看對應的泵浦系列與關鍵規格。",
    tone: "blue",
  },
  {
    code: "02",
    title: "建築給排水",
    description: "依建築供水、排水與設備需求，找到適合進一步評估的產品方向。",
    tone: "cyan",
  },
  {
    code: "03",
    title: "空調循環",
    description: "針對循環與空調系統，整理可比較的產品資訊與應用入口。",
    tone: "slate",
  },
  {
    code: "04",
    title: "加壓供水",
    description: "從流量、揚程與現場條件出發，探索合適的加壓供水系列。",
    tone: "amber",
  },
  {
    code: "05",
    title: "工業製程",
    description: "集中查看工業使用情境下的產品資訊，建立清楚的選型起點。",
    tone: "deep",
  },
  {
    code: "06",
    title: "維修與汰換",
    description: "面對既有設備維修或汰換需求，從型號與現場資訊開始確認。",
    tone: "steel",
  },
];

const projects = [
  {
    category: "空調系統維保",
    title: "系統穩定運轉支援",
    copy: "從設備盤點、問題判讀到後續維護，協助建立可執行的改善方向。",
    tone: "project-blue",
  },
  {
    category: "高樓建築給排水",
    title: "建築泵浦系統整合",
    copy: "依據現場條件與使用需求，釐清產品、安裝與服務之間的合作範圍。",
    tone: "project-amber",
  },
  {
    category: "交通與公共設施",
    title: "關鍵設備技術支援",
    copy: "以清楚的技術資料與回應流程，協助客戶降低溝通與決策成本。",
    tone: "project-slate",
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brand, setBrand] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [searchResult, setSearchResult] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brandLabel = brand === "all" ? "全部品牌" : "JP PUMP";
    const purposeLabel =
      purpose === "all"
        ? "全部用途"
        : productUses.find((item) => item.title === purpose)?.title ?? purpose;
    setSearchResult(`已套用：${brandLabel}・${purposeLabel}`);
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <main>
      <header className="site-header">
        <div className="nav-shell">
          <a className="brand" href="#top" aria-label="JP PUMP 首頁">
            <img src="/jp-pump-logo.png" alt="JP PUMP" />
          </a>

          <nav className="desktop-nav" aria-label="主要導覽">
            <details className="nav-menu">
              <summary>產品總覽</summary>
              <div className="nav-dropdown">
                <a href="#products">依用途找產品</a>
                <a href="#products">依品牌找產品</a>
                <a className="dropdown-all" href="#products">全部產品 <span>→</span></a>
              </div>
            </details>
            <a href="#services">服務與實績</a>
            <a href="#about">關於傑平</a>
            <a href="#contact">聯絡我們</a>
          </nav>

          <a className="header-cta" href="#contact">需求諮詢 <span>→</span></a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={mobileOpen ? "關閉選單" : "開啟選單"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={`mobile-nav ${mobileOpen ? "is-open" : ""}`}
          aria-label="手機導覽"
        >
          <a href="#products" onClick={closeMobileMenu}>產品總覽</a>
          <a href="#services" onClick={closeMobileMenu}>服務與實績</a>
          <a href="#about" onClick={closeMobileMenu}>關於傑平</a>
          <a href="#contact" onClick={closeMobileMenu}>聯絡我們</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <img className="hero-image" src="/field-engineer.png" alt="工程人員於設備現場檢視泵浦系統" />
        <div className="hero-overlay" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content page-shell">
          <div className="hero-copy">
            <p className="eyebrow light"><span /> PUMP SYSTEM SOLUTIONS</p>
            <h1 id="hero-title">以扎實經驗，<br />守護每一套<br /><em>泵浦系統</em></h1>
            <p className="hero-lead">從設備選擇到工程服務，以清楚可靠的資訊，協助你找到合適的產品與技術方向。</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#products">探索產品 <span>→</span></a>
              <a className="text-link light-link" href="#about">認識 JP PUMP <span>↗</span></a>
            </div>
          </div>

          <form className="product-finder" onSubmit={handleSearch}>
            <div className="finder-head">
              <div>
                <small>QUICK FINDER</small>
                <h2>快速找到產品方向</h2>
              </div>
              <span className="finder-index">01 / 03</span>
            </div>
            <label htmlFor="brand">品牌</label>
            <div className="select-wrap">
              <select id="brand" value={brand} onChange={(event) => setBrand(event.target.value)}>
                <option value="all">全部品牌</option>
                <option value="jp-pump">JP PUMP</option>
              </select>
            </div>
            <label htmlFor="purpose">用途</label>
            <div className="select-wrap">
              <select id="purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                <option value="all">全部用途</option>
                {productUses.map((item) => <option key={item.code} value={item.title}>{item.title}</option>)}
              </select>
            </div>
            <button className="finder-submit" type="submit">搜尋產品 <span>→</span></button>
            <p className="finder-note" aria-live="polite">
              {searchResult || "不確定從哪裡開始？先保留「全部」即可瀏覽所有方向。"}
            </p>
          </form>
        </div>
        <div className="hero-rail" aria-hidden="true">
          <span>SCROLL TO DISCOVER</span>
          <i />
        </div>
      </section>

      <section className="trust-strip" aria-label="服務特色">
        <div className="page-shell trust-grid">
          <div><strong>01</strong><span>清楚的產品資訊</span></div>
          <div><strong>02</strong><span>可追溯的工程經驗</span></div>
          <div><strong>03</strong><span>直接的技術回應</span></div>
        </div>
      </section>

      <section className="section about-section" id="about" aria-labelledby="about-title">
        <div className="page-shell about-grid">
          <div className="about-image-wrap">
            <img src="/company-sign.png" alt="JP PUMP 公司識別招牌" />
            <div className="image-stamp"><strong>JP</strong><span>ENGINEERING<br />RESPONSE</span></div>
          </div>
          <div className="about-copy">
            <p className="eyebrow"><span /> ABOUT JP PUMP</p>
            <h2 id="about-title">從一台設備，看到整套系統的需求</h2>
            <p className="lead-copy">我們相信，好的設備選擇不只是一組型號，更需要理解現場、系統與後續服務。</p>
            <p>JP PUMP 將產品資訊、工程經驗與聯絡入口整理在同一個清楚的流程裡，讓每一次詢問都更快靠近可執行的答案。</p>
            <div className="about-facts">
              <div><b>產品選型</b><span>從用途與條件建立方向</span></div>
              <div><b>工程支援</b><span>依現場需求確認合作範圍</span></div>
            </div>
            <a className="text-link" href="#contact">進一步認識我們 <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="section products-section" id="products" aria-labelledby="products-title">
        <div className="page-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> PRODUCT USES</p>
              <h2 id="products-title">依產品用途，<br />找到合適系列</h2>
            </div>
            <div className="heading-side">
              <p>從使用情境開始探索，再依品牌、規格與現場條件縮小範圍。</p>
              {searchResult && <span className="active-filter">{searchResult}</span>}
            </div>
          </div>

          <div className="purpose-grid">
            {productUses.map((item) => (
              <a className={`purpose-card tone-${item.tone}`} href="#contact" key={item.code}>
                <div className="purpose-top">
                  <span className="purpose-code">{item.code}</span>
                  <span className="purpose-arrow">↗</span>
                </div>
                <div className="pump-mark" aria-hidden="true"><i /><i /><i /></div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-section" id="services" aria-labelledby="services-title">
        <div className="page-shell">
          <div className="section-heading split-heading dark-heading">
            <div>
              <p className="eyebrow light"><span /> PRODUCTS & SERVICES</p>
              <h2 id="services-title">從產品探索，<br />一路到工程支援</h2>
            </div>
            <p>三條清楚路徑，讓不同階段的需求都能找到下一步。</p>
          </div>

          <div className="service-paths">
            <a href="#products">
              <span>01</span><div><small>PRODUCT DISCOVERY</small><h3>依用途與品牌探索產品</h3><p>先掌握可比較的系列與關鍵資訊。</p></div><b>→</b>
            </a>
            <a href="#projects">
              <span>02</span><div><small>ENGINEERING SERVICE</small><h3>了解服務與工程實績</h3><p>從工作範圍與案例脈絡確認合作方向。</p></div><b>→</b>
            </a>
            <a href="#contact">
              <span>03</span><div><small>TECHNICAL CONTACT</small><h3>帶著需求直接聯絡</h3><p>需要選型、維修或現場協助時，快速開始。</p></div><b>→</b>
            </a>
          </div>
        </div>
      </section>

      <section className="section projects-section" id="projects" aria-labelledby="projects-title">
        <div className="page-shell">
          <div className="section-heading projects-heading">
            <div>
              <p className="eyebrow"><span /> FEATURED WORK</p>
              <h2 id="projects-title">工程實績與服務經驗</h2>
            </div>
            <a className="text-link" href="#contact">討論你的需求 <span>→</span></a>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                <div className={`project-visual ${project.tone}`}>
                  <span>JP / {String(index + 1).padStart(2, "0")}</span>
                  <div aria-hidden="true"><i /><i /><i /></div>
                </div>
                <div className="project-copy">
                  <small>{project.category}</small>
                  <h3>{project.title}</h3>
                  <p>{project.copy}</p>
                  <a href="#contact" aria-label={`洽詢 ${project.title}`}>了解合作方式 <span>↗</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-grid page-shell">
          <div>
            <p className="eyebrow light"><span /> START A CONVERSATION</p>
            <h2 id="contact-title">讓我們一起確認，<br />下一步怎麼走。</h2>
          </div>
          <div className="contact-copy">
            <p>無論是產品選型、設備汰換或工程支援，留下需求方向，我們會協助你整理後續確認項目。</p>
            <a className="button button-amber" href="mailto:service@jp-pump.example">聯絡 JP PUMP <span>→</span></a>
            <small>正式電話、Email 與服務資訊將於資料核准後更新。</small>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <img src="/jp-pump-logo.png" alt="JP PUMP" />
            <p>泵浦選型、設備供應與工程技術服務。</p>
          </div>
          <div>
            <h2>網站導覽</h2>
            <a href="#products">產品總覽</a>
            <a href="#services">服務與實績</a>
            <a href="#about">關於傑平</a>
          </div>
          <div>
            <h2>取得協助</h2>
            <a href="#contact">需求諮詢</a>
            <a href="#contact">產品選型</a>
            <a href="#contact">維修與汰換</a>
          </div>
          <div className="footer-status">
            <h2>聯絡資訊</h2>
            <p>正式資訊待核准</p>
            <span>TAIWAN · GMT+8</span>
          </div>
        </div>
        <div className="page-shell footer-bottom">
          <span>© 2026 JP PUMP. ALL RIGHTS RESERVED.</span>
          <a href="#top">回到頂端 ↑</a>
        </div>
      </footer>
    </main>
  );
}
