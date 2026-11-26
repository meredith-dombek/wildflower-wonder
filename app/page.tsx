import Image from "next/image";
import { categories, products } from "@/content/products";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { Meadow } from "@/components/Meadow";
import s from "./home.module.css";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Home() {
  const pack = products[0];
  return (
    <>
      <Meadow />

      <section id="explorer-pack" className={`band edge-c ${s.pack}`} aria-labelledby="pack-title">
        <div className={`wrap ${s.packGrid}`}>
          <figure className={s.cover}>
            <Image src={pack.cover} alt={pack.coverAlt} width={900} height={1160} sizes="(min-width: 900px) 27rem, 80vw" />
            <figcaption>{home.pack.mockupNote}</figcaption>
          </figure>
          <div className={s.packWords}>
            <h2 id="pack-title">{pack.name}</h2>
            <p className={s.facts}><strong>{money.format(pack.price)}</strong> <span>Ages {pack.ages}</span> <span>{pack.format}</span></p>
            <p>{pack.summary}</p>
            <div className={s.state}>
              <span className="tab-pencil">{home.pack.soon}</span>
              <p>{home.pack.soonNote}</p>
            </div>
            <h3>{home.pack.insideTitle}</h3>
            <ol className={s.inside}>{pack.inside.map((i) => <li key={i}>{i}</li>)}</ol>
          </div>
        </div>
      </section>

      <section id="shop" className={`band edge-a ${s.shop}`} aria-labelledby="shop-title">
        <div className="wrap">
          <div className={s.shopHead}>
            <h2 id="shop-title">{home.shelves.title}</h2>
            <p>{home.shelves.intro}</p>
          </div>
        </div>
        <ul className={s.shelves}>
          <li aria-hidden="true" className={`band edge-b ${s.ground}`} />
          {categories.map((c) => (
            <li key={c.id} className={s.shelf} data-open={c.open}>
              <div className={s.plant}>
                {!c.open && <Image src={`/art/pencil-${c.plant}.webp`} alt="" width={250} height={340} className={s.pencil} />}
                <Image src={`/art/${c.plant}.webp`} alt="" width={250} height={340} className={s.paint} />
              </div>
              <div className={s.label}>
                <h3>{c.name}</h3>
                <p>{c.plan}</p>
                {c.open ? <a href="#explorer-pack">{home.shelves.open}</a> : <span className={s.planned}>{home.shelves.planned}</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="why" className={`band edge-b ${s.why}`} aria-labelledby="why-title">
        <div className={`wrap ${s.whyGrid}`}>
          <h2 id="why-title">{home.why.title}</h2>
          <ul className={s.reasons}>
            {home.why.reasons.map((r) => (
              <li key={r.title}>
                <Image src={`/art/${r.art}.webp`} alt="" width={200} height={200} />
                <div><h3>{r.title}</h3><p>{r.text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`band edge-c ${s.closing}`}>
        <div className={`wrap ${s.closingRow}`}>
          <p className={s.feeling}>{site.feeling}</p>
          <div><p>{home.closing.text}</p><a className="tab" href="#shop">{home.closing.button}</a></div>
        </div>
      </section>
    </>
  );
}
