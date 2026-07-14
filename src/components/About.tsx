"use client";

import { useSiteData } from "@/context/SiteDataContext";

export function About() {
  const { settings } = useSiteData();

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="section-inner about__grid">
        <div>
          <h2 id="about-title">{settings.aboutTitle}</h2>
          <p>{settings.aboutText1}</p>
          <p>{settings.aboutText2}</p>
        </div>
        <aside className="about__aside" aria-label="Условия получения">
          <h3>Оплата при получении</h3>
          <ul>
            <li>Наличными курьеру или при самовывозе</li>
            <li>Картой по терминалу на месте</li>
            <li>Без предоплаты и онлайн-платежей</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
