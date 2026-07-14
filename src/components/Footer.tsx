"use client";

import { useSiteData } from "@/context/SiteDataContext";

export function Footer() {
  const { settings } = useSiteData();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">{settings.brandName}</p>
          <p>{settings.footerTagline}</p>
        </div>
        <div className="footer-contacts">
          <a href={`tel:${settings.phone}`}>{settings.phoneDisplay}</a>
          <span>{settings.hours}</span>
        </div>
      </div>
    </footer>
  );
}
