import { getImageProps } from "next/image";

type Size = { src: string; width: number; height: number };

// One painted scene with a wide drawing for computers and a tall one for phones.
export function Scene({ wide, tall, className, eager = false }: { wide: Size; tall: Size; className?: string; eager?: boolean }) {
  const common = { alt: "", sizes: "100vw", quality: 85 };
  const { props: { srcSet } } = getImageProps({ ...common, ...wide });
  const { props: img } = getImageProps({ ...common, ...tall });
  return (
    <picture>
      <source media="(min-width: 760px)" srcSet={srcSet} sizes="100vw" width={wide.width} height={wide.height} />
      <img {...img} alt="" className={className} loading={eager ? undefined : "lazy"} fetchPriority={eager ? "high" : undefined} />
    </picture>
  );
}
