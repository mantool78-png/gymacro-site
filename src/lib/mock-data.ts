export type DisciplineSlug =
  | "acrobatic"
  | "artistic"
  | "rhythmic"
  | "aerobic"
  | "trampoline";

export interface Discipline {
  slug: DisciplineSlug;
  name: string;
  shortName: string;
  description: string;
  href: string;
  accent: "violet" | "teal";
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: "technique" | "strength" | "stretch" | "injury" | "mind" | "compete" | "gear" | "parents";
}

export type ArticleTab = "popular" | "new" | "parents" | "coaches";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  discipline: DisciplineSlug;
  readMinutes: number;
  /** ISO 8601 (как приходит из WordPress) */
  date: string;
  featured?: boolean;
  tabs: ArticleTab[];
  /** Внешняя ссылка (оригинал на gymacro.ru и т.п.) */
  href?: string;
  /** URL обложки поста */
  image?: string | null;
  /** Slug WordPress / маршрут /posts/[slug] */
  slug: string;
  /** Название рубрики из WordPress (для отображения в карточке) */
  wpCategoryName?: string;
}

export const disciplines: Discipline[] = [
  {
    slug: "acrobatic",
    shortName: "Акробатика",
    name: "Спортивная акробатика",
    description: "Пары и группы, балансы, динамика, подготовка к разрядам и соревнованиям.",
    href: "/disciplines/acrobatic",
    accent: "violet",
  },
  {
    slug: "artistic",
    shortName: "Спорт. гимнастика",
    name: "Спортивная гимнастика",
    description: "Снаряды, элементы, ОФП и тактика сезона для юных и квалифицированных гимнастов.",
    href: "/disciplines/artistic",
    accent: "teal",
  },
  {
    slug: "rhythmic",
    shortName: "Худ. гимнастика",
    name: "Художественная гимнастика",
    description: "Предметы, хореография, гибкость и сценическое мастерство.",
    href: "/disciplines/rhythmic",
    accent: "violet",
  },
  {
    slug: "aerobic",
    shortName: "Аэробика",
    name: "Аэробика",
    description: "Комбинации, выносливость, музыкальность и правила дисциплины.",
    href: "/disciplines/aerobic",
    accent: "teal",
  },
  {
    slug: "trampoline",
    shortName: "Батут",
    name: "Прыжки на батуте",
    description: "Трамплин, синхрон, двойной мини и безопасная техника приземления.",
    href: "/disciplines/trampoline",
    accent: "violet",
  },
];

export const disciplineLabel: Record<DisciplineSlug, string> = {
  acrobatic: "Акробатика",
  artistic: "Спорт. гимнастика",
  rhythmic: "Худ. гимнастика",
  aerobic: "Аэробика",
  trampoline: "Батут",
};

/** Обложки карточек дисциплин на главной (`Public/images/`). */
export const disciplineCoverImages: Record<DisciplineSlug, string> = {
  acrobatic: "/images/acrobatic.jpg",
  artistic: "/images/artistic.webp",
  rhythmic: "/images/rhythmic.webp",
  aerobic: "/images/aerobic.webp",
  trampoline: "/images/trampoline.webp",
};

/** Плашка на карточке статьи: короткий текст + цвет полосы */
export const disciplineCardBadge: Record<
  DisciplineSlug,
  { label: string; barClass: string }
> = {
  acrobatic: { label: "Акробатика", barClass: "bg-[#6d28d9]" },
  artistic: { label: "Спортивная", barClass: "bg-[#2563eb]" },
  rhythmic: { label: "Художественная", barClass: "bg-[#c026d3]" },
  aerobic: { label: "Аэробика", barClass: "bg-[#ea580c]" },
  trampoline: { label: "Батут", barClass: "bg-[#0284c7]" },
};

export const topics: Topic[] = [
  {
    id: "technique",
    title: "Техника",
    description: "Разборы элементов и типичные ошибки",
    href: "/topics/technique",
    icon: "technique",
  },
  {
    id: "ofp",
    title: "ОФП",
    description: "Сила, взрыв и устойчивость без перегруза",
    href: "/topics/ofp",
    icon: "strength",
  },
  {
    id: "stretch",
    title: "Растяжка",
    description: "Мобильность и безопасная работа на шпагат",
    href: "/topics/stretch",
    icon: "stretch",
  },
  {
    id: "injuries",
    title: "Травмы и профилактика",
    description: "Что отслеживать и когда к врачу",
    href: "/topics/injuries",
    icon: "injury",
  },
  {
    id: "psychology",
    title: "Психология",
    description: "Стресс, мотивация, выступления",
    href: "/topics/psychology",
    icon: "mind",
  },
  {
    id: "competitions",
    title: "Соревнования",
    description: "Сборы, регламент, тактика дня старта",
    href: "/topics/competitions",
    icon: "compete",
  },
  {
    id: "gear",
    title: "Экипировка",
    description: "Ковры, обувь, уход за снарядами",
    href: "/topics/gear",
    icon: "gear",
  },
  {
    id: "parents",
    title: "Для родителей",
    description: "Режим, питание, как поддерживать ребёнка",
    href: "/topics/parents",
    icon: "parents",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "ofp-nedelya-mezhseson",
    title: "Как выстроить неделю ОФП в межсезонье без выгорания",
    excerpt:
      "Простая схема нагрузок для юных гимнастов и подростков: что оставить, что убрать. Сохраняем прогресс без хронической усталости и риска травм.",
    discipline: "artistic",
    readMinutes: 8,
    date: "2026-03-26",
    featured: true,
    tabs: ["popular", "new", "coaches"],
  },
  {
    id: "2",
    slug: "balansy-v-pare",
    title: "Балансовые позиции в паре: контроль линии и дыхание",
    excerpt:
      "Три опоры стабильности, которые стоит проверять на каждой тренировке. Как синхронизировать темп и не «ломать» линию корпуса у нижнего и верхнего.",
    discipline: "acrobatic",
    readMinutes: 6,
    date: "2026-03-24",
    tabs: ["new", "coaches"],
  },
  {
    id: "3",
    slug: "pryzhok-batut-vysota",
    title: "Прыжок на батуте: где чаще всего теряется высота",
    excerpt:
      "Короткий чек-лист амплитуды и работы ног до отталкивания. Разбираем типичные потери энергии и момент, когда техника уходит в «пружину без контроля».",
    discipline: "trampoline",
    readMinutes: 5,
    date: "2026-03-22",
    tabs: ["popular", "new"],
  },
  {
    id: "4",
    slug: "hgg-myach-kisti",
    title: "Художественная гимнастика: мяч и ловкость кистей",
    excerpt:
      "Упражнения на 10 минут в конце тренировки — без «ломания» хореографии. Мягкий прогресс для бросков, ловель и уверенной работы пальцев.",
    discipline: "rhythmic",
    readMinutes: 7,
    date: "2026-03-20",
    tabs: ["popular", "new"],
  },
  {
    id: "5",
    slug: "roditelyam-posle-sorevnovaniy",
    title: "Родителям: как говорить о соревнованиях после выступления",
    excerpt:
      "Поддержка без оценки «на пятерку» — что работает в долгую. Как не перехватить ответственность за эмоции ребёнка и остаться рядом в любой исход.",
    discipline: "artistic",
    readMinutes: 4,
    date: "2026-03-18",
    tabs: ["parents", "popular"],
  },
  {
    id: "6",
    slug: "aerobika-puls-vosstanovlenie",
    title: "Аэробика: пульс и восстановление между проходами",
    excerpt:
      "Когда сбавить интенсивность, чтобы не потерять чистоту комбинации. Простые ориентиры по дыханию и паузам между повторениями в зале.",
    discipline: "aerobic",
    readMinutes: 6,
    date: "2026-03-15",
    tabs: ["coaches", "new"],
  },
  {
    id: "7",
    slug: "razminka-kisti-opornye",
    title: "Разминка суставов кисти перед опорными элементами",
    excerpt:
      "Мягкая активация за 5 минут — для спортивной и художественной гимнастики. Снимаем скованность без лишнего растяжения перед нагрузкой на запястье.",
    discipline: "rhythmic",
    readMinutes: 3,
    date: "2026-03-12",
    tabs: ["popular", "new"],
  },
];

/** Расширенная цветовая идентичность каждой дисциплины */
export const disciplineAccents: Record<
  DisciplineSlug,
  {
    gradFrom: string;
    gradTo: string;
    soft: string;
    textClass: string;
    badgeClass: string;
    ringClass: string;
  }
> = {
  acrobatic: {
    gradFrom: "#6d28d9",
    gradTo: "#7c3aed",
    soft: "#ede9fe",
    textClass: "text-violet-700",
    badgeClass: "bg-violet-600",
    ringClass: "ring-violet-200",
  },
  artistic: {
    gradFrom: "#1d4ed8",
    gradTo: "#3b82f6",
    soft: "#dbeafe",
    textClass: "text-blue-700",
    badgeClass: "bg-blue-600",
    ringClass: "ring-blue-200",
  },
  rhythmic: {
    gradFrom: "#a21caf",
    gradTo: "#d946ef",
    soft: "#fae8ff",
    textClass: "text-fuchsia-700",
    badgeClass: "bg-fuchsia-600",
    ringClass: "ring-fuchsia-200",
  },
  aerobic: {
    gradFrom: "#c2410c",
    gradTo: "#f97316",
    soft: "#ffedd5",
    textClass: "text-orange-700",
    badgeClass: "bg-orange-600",
    ringClass: "ring-orange-200",
  },
  trampoline: {
    gradFrom: "#0369a1",
    gradTo: "#0ea5e9",
    soft: "#e0f2fe",
    textClass: "text-sky-700",
    badgeClass: "bg-sky-600",
    ringClass: "ring-sky-200",
  },
};

/** Данные о соревновании (из WordPress категории competitions) */
export interface CompetitionEvent {
  id: string;
  title: string;
  /** ISO дата начала соревнования (из post.date) */
  date: string;
  /** Город и уровень — берётся из excerpt поста */
  excerpt: string;
  link: string;
  slug: string;
}

/** Пост для Фан-зоны (мемы, видео) */
export interface FunPost {
  id: string;
  title: string;
  excerpt: string;
  /** Rendered HTML — для извлечения iframe embed */
  content: string;
  image: string | null;
  slug: string;
  date: string;
}

export const trustPoints = [
  {
    title: "Для родителей — простым языком",
    description: "Объясняем без тренерского жаргона, с пояснениями по ходу текста.",
  },
  {
    title: "Опираемся на источники",
    description: "Методики федераций, правила FIG и практика действующих тренеров.",
  },
  {
    title: "Все гимнастические дисциплины",
    description: "Акробатика, спортивная и художественная гимнастика, аэробика, батут.",
  },
  {
    title: "Путь от секции до старта",
    description: "Выбор секции, тренировки, разряды и первые соревнования — без запугивания.",
  },
];
