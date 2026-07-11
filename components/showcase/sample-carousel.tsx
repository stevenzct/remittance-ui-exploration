"use client";

import { Children, type ReactNode } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface SampleCarouselProps {
  readonly children: ReactNode;
  readonly slideIds: readonly string[];
}

export function SampleCarousel({ children, slideIds }: SampleCarouselProps) {
  const slides = Children.toArray(children);

  return (
    <Swiper modules={[Navigation, Pagination]} navigation={{ prevEl: ".sample-prev", nextEl: ".sample-next" }} pagination={{ clickable: true }} spaceBetween={24} slidesPerView={1} className="sample-swiper">
      {slides.map((slide, index) => (
        <SwiperSlide key={slideIds[index]}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
}
