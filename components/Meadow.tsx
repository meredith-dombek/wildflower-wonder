"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { Scene } from "./Scene";
import s from "./Meadow.module.css";

const CREATURES = [
  { id: "bee", label: "bee", w: 130, h: 116 },
  { id: "butterfly", label: "butterfly", w: 180, h: 160 },
  { id: "rabbit", label: "rabbit", w: 230, h: 270 },
  { id: "mushroom", label: "mushroom", w: 160, h: 150 },
  { id: "acorn", label: "acorn", w: 110, h: 130 },
] as const;

// The brand name as cut-paper lettering (drawn by art/title.mjs).
const TITLE = { w: 1933, h: 553 };

export function Meadow() {
  const [found, setFound] = useState<string[]>([]);
  const meadow = useRef<HTMLDivElement>(null);
  const slots = useRef<Record<string, HTMLElement | null>>({});
  const done = found.length === CREATURES.length;

  function glue(id: string, from: HTMLElement) {
    if (found.includes(id)) return;
    setFound((f) => [...f, id]);
    const to = slots.current[id];
    if (!to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const piece = from.querySelector("img")!.cloneNode() as HTMLElement;
    piece.className = s.flying;
    Object.assign(piece.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.append(piece);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const k = Math.min(b.width / a.width, b.height / a.height) * 0.8;
    piece.animate(
      [
        { transform: "none" },
        { transform: "translate(0, -18px) rotate(-7deg) scale(1.14)", offset: 0.25 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${k})` },
      ],
      { duration: 820, easing: "cubic-bezier(.22, 1, .36, 1)" },
    ).onfinish = () => piece.remove();
  }

  return (
    <>
      <section className={s.sky}>
        <div className={s.back}><Scene eager wide={{ src: "/art/meadow-back.webp", width: 1600, height: 520 }} tall={{ src: "/art/meadow-back-m.webp", width: 520, height: 360 }} className={s.scene} /></div>
        <div className={`wrap ${s.cover}`}>
          <h1 className={s.title}>
            <Image src="/art/title.webp" alt={site.name} width={TITLE.w} height={TITLE.h} quality={85} preload sizes="(min-width: 760px) 64vw, 92vw" />
          </h1>
          <div className={s.words}>
            <p className={s.slogan}>{site.slogan}</p>
            <p>{home.welcome}</p>
            <a className="tab" href="#shop">{home.shopButton}</a>
          </div>
        </div>
        <div className={s.front} ref={meadow}>
          {CREATURES.map((c) => (
            <button key={c.id} type="button" className={`${s.creature} ${s[c.id]}`} data-found={found.includes(c.id)} disabled={found.includes(c.id)} onClick={(e) => glue(c.id, e.currentTarget)}>
              <Image src={`/art/${c.id}.webp`} alt="" width={c.w} height={c.h} loading="eager" />
              <span className="sr-only">Found the {c.label}</span>
            </button>
          ))}
          <Scene eager wide={{ src: "/art/meadow-front.webp", width: 1600, height: 640 }} tall={{ src: "/art/meadow-front-m.webp", width: 520, height: 420 }} className={s.scene} />
        </div>
      </section>

      <section className={`band edge-a ${s.hill}`} aria-labelledby="hunt-title">
        <div className={`wrap ${s.hunt}`}>
          <div>
            <h2 id="hunt-title" className={s.huntTitle}>{home.hunt.title}</h2>
            <p aria-live="polite">
              {done ? <>{home.hunt.done} <Link href="#explorer-pack">{home.hunt.link}</Link></> : home.hunt.help}
              {!done && found.length > 0 && <span className="sr-only"> {found.length} of five found.</span>}
            </p>
          </div>
          <ul className={s.slots}>
            {CREATURES.map((c) => {
              const got = found.includes(c.id);
              return (
                <li key={c.id} className={s.slot} data-found={got}>
                  <span className={s.scrap} ref={(el) => { slots.current[c.id] = el; }}>
                    <Image src={`/art/pencil-${c.id}.webp`} alt="" width={c.w} height={c.h} className={s.pencil} />
                    <Image src={`/art/${c.id}.webp`} alt="" width={c.w} height={c.h} className={s.painted} />
                  </span>
                  {c.label}<span className="sr-only">{got ? ", found" : ", not found yet"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
