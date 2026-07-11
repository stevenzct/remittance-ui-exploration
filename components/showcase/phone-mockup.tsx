import Image from "next/image";
import { ImagePreview } from "@/components/showcase/image-preview";

interface PhoneMockupProps {
  readonly src: string;
  readonly alt: string;
  readonly priority?: boolean;
  readonly className?: string;
}

export function PhoneMockup({ src, alt, priority = false, className }: PhoneMockupProps) {
  const shellClassName = className ? `phone-shell ${className}` : "phone-shell";

  return (
    <ImagePreview src={src} alt={alt}>
      <div className={shellClassName}>
        <Image src={src} alt={alt} width={750} height={1624} priority={priority} className="phone-screen" />
      </div>
    </ImagePreview>
  );
}
