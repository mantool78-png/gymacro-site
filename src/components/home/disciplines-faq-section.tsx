import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Что такое спортивная гимнастика?",
    href: "/disciplines/artistic",
    label: "Статьи по спортивной гимнастике",
    answer:
      "Спортивная гимнастика — один из старейших олимпийских видов спорта, где атлеты выполняют упражнения на снарядах: перекладина, брусья, кольца, конь, опорный прыжок и вольные упражнения. У женщин — бревно, разновысокие брусья, напольные упражнения. Дисциплина требует взрывной силы, абсолютного контроля тела и безупречной координации.",
    accent: "teal",
  },
  {
    q: "Что такое художественная гимнастика?",
    href: "/disciplines/rhythmic",
    label: "Статьи по художественной гимнастике",
    answer:
      "Художественная гимнастика сочетает хореографию и владение предметами — лентой, мячом, булавами, скакалкой и обручем. Спортсменки выступают под музыку; оцениваются техника, артистизм и сложность элементов. Дисциплина развивает гибкость, пластику и музыкальность.",
    accent: "violet",
  },
  {
    q: "Что такое спортивная акробатика?",
    href: "/disciplines/acrobatic",
    label: "Статьи по спортивной акробатике",
    answer:
      "Спортивная акробатика — командная дисциплина: пары и группы выполняют балансовые и динамические элементы — пирамиды, поддержки, перелёты. Ключевые навыки: сила и устойчивость нижних партнёров, лёгкость и координация верхних, точная синхронизация внутри группы.",
    accent: "violet",
  },
  {
    q: "Что такое прыжки на батуте?",
    href: "/disciplines/trampoline",
    label: "Статьи о прыжках на батуте",
    answer:
      "Прыжки на батуте — олимпийская дисциплина: спортсмен выполняет серию из десяти прыжков с элементами вращения и сальто. Оцениваются высота полёта, время в воздухе и чистота техники; в синхронных видах — совпадение траекторий партнёров.",
    accent: "teal",
  },
  {
    q: "Что такое акробатическая дорожка?",
    href: "/disciplines/acrobatic",
    label: "Статьи по акробатической дорожке",
    answer:
      "Акробатическая дорожка — длинный упругий снаряд, на котором спортсмен выполняет непрерывную серию темповых акробатических элементов: рондат, фляки, сальто. Требует мощного стартового толчка, вестибулярной устойчивости и умения сохранять технику на протяжении всей серии.",
    accent: "violet",
  },
  {
    q: "Что такое спортивная аэробика?",
    href: "/disciplines/aerobic",
    label: "Статьи по спортивной аэробике",
    answer:
      "Спортивная аэробика — высокоинтенсивная дисциплина: один спортсмен или группа выполняют 60–90-секундную программу под музыку. Оцениваются скорость и точность движений, сложность элементов, музыкальность и общая выносливость. Требует исключительного аэробного ресурса.",
    accent: "teal",
  },
];

export function DisciplinesFaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="px-4 py-10 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)] md:text-3xl"
        >
          Виды гимнастики: коротко о главном
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)] md:text-base">
          Быстрые ответы на базовые вопросы о каждой дисциплине.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.q}
              className={`flex flex-col rounded-[18px] border border-[var(--color-border-subtle)] p-6 shadow-[var(--shadow-soft)] ${
                item.accent === "violet"
                  ? "bg-gradient-to-br from-white to-[#ede9fe]/40"
                  : "bg-gradient-to-br from-white to-[#ccfbf1]/30"
              }`}
            >
              <h3 className="font-display text-[1rem] font-bold leading-snug text-[var(--color-ink)] md:text-[1.0625rem]">
                {item.q}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {item.answer}
              </p>
              <Link
                href={item.href}
                className={`mt-5 inline-flex items-center text-sm font-semibold transition-colors ${
                  item.accent === "violet"
                    ? "text-[var(--color-accent-violet)] hover:text-[#5b21b6]"
                    : "text-[var(--color-accent-teal)] hover:text-[#0f766e]"
                }`}
              >
                {item.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
