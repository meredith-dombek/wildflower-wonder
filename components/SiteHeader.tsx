"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import s from "./SiteHeader.module.css";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className={s.header} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <div className={`wrap ${s.row}`}>
        <Link href="/" className={s.mark} onClick={() => setOpen(false)}>
          <Image src="/art/daisy.webp" alt="" width={44} height={44} />
          {site.name}
        </Link>
        <button type="button" className={s.toggle} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-menu" aria-label="Main" className={s.nav} data-open={open}>
          <ul>
            {site.menu.map((m) => (
              <li key={m.href}><Link href={m.href} onClick={() => setOpen(false)}>{m.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
