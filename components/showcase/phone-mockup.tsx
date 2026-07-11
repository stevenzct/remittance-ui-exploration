import Image from "next/image";

interface PhoneMockupProps {
  readonly src: string;
  readonly alt: string;
  readonly priority?: boolean;
  readonly className?: string;
}

export function PhoneMockup({ src, alt, priority = false, className }: PhoneMockupProps) {
  const shellClassName = className ? `phone-shell ${className}` : "phone-shell";

  return (
    <div className={shellClassName}>
      <Image src={src} alt={alt} width={750} height={1624} priority={priority} className="phone-screen" />
    </div>
  );
}
