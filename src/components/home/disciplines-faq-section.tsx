import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Во сколько лет отдавать ребёнка в гимнастику?",
    href: "/topics/parents",
    label: "Раздел для родителей",
    answer:
      "В художественную и спортивную гимнастику чаще всего берут с 4–6 лет — пока гибкость развивается легко. В акробатику и на батут комфортный вход — с 5–7 лет, в спортивную аэробику — с 6–8. Важнее возраста — желание ребёнка и готовность к режиму: 2–3 тренировки в неделю уже на первом году.",
    accent: "teal",
  },
  {
    q: "Спортивная, художественная или акробатика — что выбрать?",
    href: "/disciplines/artistic",
    label: "Сравнить дисциплины",
    answer:
      "Смотрите на характер ребёнка: любит музыку и красоту — художественная; много энергии и не боится высоты — спортивная или батут; нравится работать в команде — акробатика; хочет двигаться под музыку в быстром темпе — аэробика. В наших гайдах по дисциплинам — снаряды, требования и перспективы каждого вида.",
    accent: "violet",
  },
  {
    q: "Сколько стоит гимнастика для ребёнка?",
    href: "/topics/gear",
    label: "Экипировка и расходы",
    answer:
      "Считайте заранее: абонемент в секцию, купальник и чешки для тренировок, выступительный костюм (в художественной — от 5–15 тыс. ₽), судейские взносы за старты, поездки на выездные турниры. В первый год бюджет обычно скромный, пик расходов — с первыми соревнованиями.",
    accent: "violet",
  },
  {
    q: "Растяжка через слёзы — это нормально?",
    href: "/topics/stretch",
    label: "О растяжке и гибкости",
    answer:
      "Лёгкий дискомфорт при работе на гибкость — норма, но крик и слёзы — сигнал остановиться и поговорить с тренером. Современные методики дают результат и без «давления». Опасно, когда болит сустав, а не тянется мышца. Разбираем, как отличить норму от перегиба и как помочь дома безопасно.",
    accent: "teal",
  },
  {
    q: "Что такое разряды и зачем они ребёнку?",
    href: "/topics/competitions",
    label: "Разряды и соревнования",
    answer:
      "Разряды (от 3-го юношеского до мастера спорта) — шкала спортивного прогресса. Первые разряды ребёнок может выполнить уже через 1–2 года тренировок. Они важны для спортивной карьеры, отбора в сборные и иногда дают бонусы при поступлении. Но главное на старте — интерес ребёнка, а не скорость выполнения нормативов.",
    accent: "violet",
  },
  {
    q: "Как поддержать ребёнка после неудачного выступления?",
    href: "/topics/parents",
    label: "Психология и поддержка",
    answer:
      "Падения и низкие оценки — часть спорта. Работает формула: сначала эмоции, потом разбор. Не критикуйте тренера при ребёнке, не сравнивайте с другими детьми и отделяйте результат от личности: «ты молодец, что боролся» важнее «почему только пятое место». Подробные сценарии разговоров — в разделе для родителей.",
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
          Быстрые ответы на вопросы, которые задают родители в раздевалке и у дверей зала.
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
