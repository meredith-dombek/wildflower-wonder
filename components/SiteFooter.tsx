import Link from "next/link";
import { site } from "@/content/site";
import { Scene } from "./Scene";
import s from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.scene}>
        <Scene wide={{ src: "/art/forest-floor.webp", width: 1600, height: 330 }} tall={{ src: "/art/forest-floor-m.webp", width: 520, height: 240 }} className={s.img} />
      </div>
      <div className={`band edge-b ${s.soil}`}>
        <div className={`wrap ${s.row}`}>
          <div>
            <p className={s.name}>{site.name}</p>
            <p>{site.slogan}</p>
            <p className={s.place}>{site.place}</p>
          </div>
          <nav aria-label="Footer">
            <ul>{site.menu.map((m) => <li key={m.href}><Link href={m.href}>{m.label}</Link></li>)}</ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
