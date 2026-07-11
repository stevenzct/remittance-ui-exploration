import Image from "next/image";
import { ImagePreview } from "@/components/showcase/image-preview";
import type { ShowcaseSample } from "@/types/dashboard";

interface PhoneMockupProps {
  readonly src: string;
  readonly alt: string;
  readonly priority?: boolean;
  readonly className?: string;
  readonly samples?: readonly ShowcaseSample[];
}

export function PhoneMockup({ src, alt, priority = false, className, samples }: PhoneMockupProps) {
  const shellClassName = className ? `phone-shell ${className}` : "phone-shell";

  return (
    <ImagePreview src={src} alt={alt} samples={samples}>
      <div className={shellClassName}>
        <div className="phone-screen-viewport">
          <Image src={src} alt={alt} width={750} height={1624} priority={priority} className="phone-screen" />
        </div>
      </div>
    </ImagePreview>
  );
}
