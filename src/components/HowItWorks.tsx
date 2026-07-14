export function HowItWorks() {
  const steps = [
    {
      title: "Выберите продукты",
      text: "Добавьте в корзину молоко, яйца, овощи и домашние заготовки.",
    },
    {
      title: "Оставьте заявку",
      text: "Укажите имя, телефон и адрес доставки или самовывоза.",
    },
    {
      title: "Оплатите при получении",
      text: "Наличными или картой по терминалу — без предоплаты.",
    },
  ];

  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="section-inner">
        <div className="section-intro">
          <h2 id="how-title">Как заказать</h2>
          <p>Три простых шага — без онлайн-оплаты и лишних сложностей.</p>
        </div>
        <ol className="how__list">
          {steps.map((step, index) => (
            <li key={step.title} className="how__item">
              <span className="how__num" aria-hidden>
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
