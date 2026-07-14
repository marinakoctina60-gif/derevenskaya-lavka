"use client";

import Link from "next/link";
import { useSiteData } from "@/context/SiteDataContext";

export function Hero() {
  const { settings } = useSiteData();
  const hasPhoto = Boolean(settings.heroImage);

  return (
    <section
      className={`hero ${hasPhoto ? "hero--photo" : ""}`}
      aria-labelledby="hero-brand"
    >
      <div className="hero__media" aria-hidden>
        {hasPhoto ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero__photo"
              src={settings.heroImage}
              alt=""
            />
            <div className="hero__shade" />
          </>
        ) : (
          <>
            <div className="hero__glow hero__glow--one" />
            <div className="hero__glow hero__glow--two" />
            <div className="hero__field" />
            <div className="hero__produce hero__produce--left" />
            <div className="hero__produce hero__produce--right" />
          </>
        )}
      </div>

      <div className="hero__content">
        <p id="hero-brand" className="hero__brand">
          {settings.brandName}
        </p>
        <h1 className="hero__title">{settings.heroTitle}</h1>
        <p className="hero__lead">{settings.heroLead}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#catalog">
            Смотреть продукты
          </a>
          <Link className="btn btn--ghost" href="/zakaz">
            Оформить заявку
          </Link>
        </div>
      </div>
    </section>
  );
}
