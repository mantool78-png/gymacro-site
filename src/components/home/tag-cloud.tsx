"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Tag {
  label: string;
  href: string;
}

const TAGS: Tag[] = [
  { label: "Акробатика", href: "/disciplines/acrobatic" },
  { label: "Спортивная гимнастика", href: "/disciplines/artistic" },
  { label: "Художественная", href: "/disciplines/rhythmic" },
  { label: "Аэробика", href: "/disciplines/aerobic" },
  { label: "Батут", href: "/disciplines/trampoline" },
  { label: "Техника", href: "/topics/technique" },
  { label: "ОФП", href: "/topics/ofp" },
  { label: "Растяжка", href: "/topics/stretch" },
  { label: "Травмы", href: "/topics/injuries" },
  { label: "Психология", href: "/topics/psychology" },
  { label: "Соревнования", href: "/topics/competitions" },
  { label: "Экипировка", href: "/topics/gear" },
  { label: "Для родителей", href: "/topics/parents" },
  { label: "Сальто", href: "/topics/technique" },
  { label: "Координация", href: "/topics/ofp" },
  { label: "Гибкость", href: "/topics/stretch" },
];

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function fibonacciSphere(count: number): Point3D[] {
  const points: Point3D[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }
  return points;
}

function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
}

function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}

export function TagCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const frameRef = useRef<number>(0);
  const angleRef = useRef({ x: -0.15, y: 0 });
  const speedRef = useRef({ x: 0.0003, y: 0.004 });
  const hoverRef = useRef(false);
  const pointsRef = useRef<Point3D[]>(fibonacciSphere(TAGS.length));
  const sizeRef = useRef({ cx: 0, cy: 0, radius: 0 });

  const setItemRef = useCallback(
    (idx: number) => (el: HTMLAnchorElement | null) => {
      itemsRef.current[idx] = el;
    },
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const RADIUS_FACTOR = 0.42;

    function updateSize() {
      const w = container!.offsetWidth;
      const h = container!.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      sizeRef.current = { cx, cy, radius: Math.min(cx, cy) * RADIUS_FACTOR };
    }
    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    function animate() {
      if (!hoverRef.current) {
        angleRef.current.y += speedRef.current.y;
        angleRef.current.x += speedRef.current.x;
      }

      const { cx, cy, radius } = sizeRef.current;

      const points = pointsRef.current;
      for (let i = 0; i < points.length; i++) {
        let p = points[i];
        p = rotateY(p, angleRef.current.y);
        p = rotateX(p, angleRef.current.x);

        const scale = (p.z + 1.8) / 2.8;
        const x = cx + p.x * radius * 2.2;
        const y = cy + p.y * radius * 2.2;
        const opacity = 0.8 + scale * 0.2;
        const fontSize = 0.7 + scale * 0.5;
        const zIndex = Math.round(scale * 100);

        const el = itemsRef.current[i];
        if (el) {
          el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.fontSize = `${fontSize}rem`;
          el.style.zIndex = String(zIndex);
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none"
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
      aria-label="Облако тегов"
    >
      {TAGS.map((tag, i) => (
        <Link
          key={tag.label}
          href={tag.href}
          ref={setItemRef(i)}
          className="absolute left-0 top-0 inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-4 py-2 font-medium text-violet-800 transition-colors duration-200 will-change-transform hover:text-violet-900"
          style={{ opacity: 0 }}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}
