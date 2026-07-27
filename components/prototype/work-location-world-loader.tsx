"use client";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(MotionPathPlugin);

const WORLD_ROUTE_ASSET = "/assets/prototype-figma/work-location-world-route.png";
const REFERENCE_WIDTH = 359;
const REFERENCE_HEIGHT = 269;
const PLANE_NOSE = { x: 249.42, y: 54.71 };
const HONG_KONG_PIN = { x: 230.45, y: 146.64 };
const PHILIPPINES_PIN = { x: 262.87, y: 214.26 };
const PLANE_TRANSFORM_ORIGIN = "69.48% 20.34%";

function destinationPin(destination: string) {
  return destination === "Philippines" ? PHILIPPINES_PIN : HONG_KONG_PIN;
}

function createGlobeTextureCanvas(sourceImage: HTMLImageElement) {
  const sourceWidth = sourceImage.naturalWidth || sourceImage.width;
  const sourceHeight = sourceImage.naturalHeight || sourceImage.height;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = sourceWidth;
  sourceCanvas.height = sourceHeight;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceContext) throw new Error("Unable to read the globe artwork");
  sourceContext.drawImage(sourceImage, 0, 0);
  const sourcePixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data;

  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  const textureContext = textureCanvas.getContext("2d");
  if (!textureContext) throw new Error("Unable to prepare the globe texture");

  const oceanGradient = textureContext.createLinearGradient(0, 0, 0, textureCanvas.height);
  oceanGradient.addColorStop(0, "#389cf3");
  oceanGradient.addColorStop(1, "#55b7ff");
  textureContext.fillStyle = oceanGradient;
  textureContext.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  const textureImage = textureContext.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
  const texturePixels = textureImage.data;
  const halfTextureWidth = textureCanvas.width / 2;
  const sourceScaleX = sourceWidth / 1448;
  const sourceScaleY = sourceHeight / 1086;
  const globeCenterX = 733 * sourceScaleX;
  const globeCenterY = 901 * sourceScaleY;
  const globeRadiusX = 455 * sourceScaleX;
  const globeRadiusY = 455 * sourceScaleY;

  for (let y = 0; y < textureCanvas.height; y += 1) {
    const latitude = Math.PI / 2 - ((y + .5) / textureCanvas.height) * Math.PI;
    const latitudeCosine = Math.cos(latitude);
    const latitudeSine = Math.sin(latitude);

    for (let x = 0; x < halfTextureWidth; x += 1) {
      const longitude = -Math.PI / 2 + ((x + .5) / halfTextureWidth) * Math.PI;
      const sourceX = Math.round(globeCenterX + globeRadiusX * latitudeCosine * Math.sin(longitude));
      const sourceY = Math.round(globeCenterY - globeRadiusY * latitudeSine);
      if (sourceX < 0 || sourceX >= sourceWidth || sourceY < 0 || sourceY >= sourceHeight) continue;

      const sourceIndex = (sourceY * sourceWidth + sourceX) * 4;
      const destinationIndex = (y * textureCanvas.width + x) * 4;
      const alpha = sourcePixels[sourceIndex + 3] / 255;
      if (alpha <= .01) continue;

      texturePixels[destinationIndex] = Math.round(
        sourcePixels[sourceIndex] * alpha + texturePixels[destinationIndex] * (1 - alpha),
      );
      texturePixels[destinationIndex + 1] = Math.round(
        sourcePixels[sourceIndex + 1] * alpha + texturePixels[destinationIndex + 1] * (1 - alpha),
      );
      texturePixels[destinationIndex + 2] = Math.round(
        sourcePixels[sourceIndex + 2] * alpha + texturePixels[destinationIndex + 2] * (1 - alpha),
      );
    }
  }

  for (let y = 0; y < textureCanvas.height; y += 1) {
    for (let x = halfTextureWidth; x < textureCanvas.width; x += 1) {
      const backProgress = (x - halfTextureWidth) / (halfTextureWidth - 1);
      const frontX = halfTextureWidth - 1 - (x - halfTextureWidth);
      const frontIndex = (y * textureCanvas.width + frontX) * 4;
      const destinationIndex = (y * textureCanvas.width + x) * 4;
      const frontStrength = 1 - Math.sin(backProgress * Math.PI) ** 2 * .45;
      texturePixels[destinationIndex] = Math.round(
        texturePixels[frontIndex] * frontStrength + texturePixels[destinationIndex] * (1 - frontStrength),
      );
      texturePixels[destinationIndex + 1] = Math.round(
        texturePixels[frontIndex + 1] * frontStrength
          + texturePixels[destinationIndex + 1] * (1 - frontStrength),
      );
      texturePixels[destinationIndex + 2] = Math.round(
        texturePixels[frontIndex + 2] * frontStrength
          + texturePixels[destinationIndex + 2] * (1 - frontStrength),
      );
    }
  }

  textureContext.putImageData(textureImage, 0, 0);
  return textureCanvas;
}

interface WorkLocationWorldLoaderProps {
  readonly destination: string;
  readonly onComplete: () => void;
}

function routeMetrics(width: number, height: number, pin: { x: number; y: number }) {
  const scaleX = width / REFERENCE_WIDTH;
  const scaleY = height / REFERENCE_HEIGHT;
  const endX = (pin.x - PLANE_NOSE.x) * scaleX;
  const endY = (pin.y - PLANE_NOSE.y) * scaleY;

  return {
    endX,
    endY,
    path: [
      { x: width * -.46, y: height * -.05 },
      { x: width * -.22, y: height * .05 },
      { x: endX - width * .08, y: endY - height * .04 },
      { x: endX, y: endY },
    ],
  };
}

export function WorkLocationWorldLoader({ destination, onComplete }: WorkLocationWorldLoaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const globeFallbackRef = useRef<HTMLDivElement | null>(null);
  const planeFlightRef = useRef<HTMLDivElement | null>(null);
  const planeVisualRef = useRef<HTMLDivElement | null>(null);
  const destinationPulseRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    const canvas = globeCanvasRef.current;
    const globeFallback = globeFallbackRef.current;
    const planeFlight = planeFlightRef.current;
    const planeVisual = planeVisualRef.current;
    const destinationPulse = destinationPulseRef.current;

    if (!overlay || !artwork || !canvas || !globeFallback || !planeFlight || !planeVisual || !destinationPulse) {
      return;
    }

    let disposed = false;
    let completed = false;
    let finishTimer = 0;
    let renderFrame = 0;
    let introTimeline: gsap.core.Timeline | null = null;
    let routeTimeline: gsap.core.Timeline | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let disposeThreeScene: (() => void) | null = null;

    const finish = () => {
      if (disposed || completed) return;
      completed = true;
      onComplete();
    };

    const width = artwork.clientWidth || REFERENCE_WIDTH;
    const height = artwork.clientHeight || REFERENCE_HEIGHT;
    const metrics = routeMetrics(width, height, destinationPin(destination));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(artwork, { autoAlpha: 1, scale: 1 });
      gsap.set(globeFallback, { autoAlpha: 1, x: 0, y: 0, rotation: 0, rotationY: 0 });
      gsap.set(canvas, { autoAlpha: 0 });
      gsap.set(planeFlight, {
        x: metrics.endX,
        y: metrics.endY,
        rotation: 21,
        transformOrigin: PLANE_TRANSFORM_ORIGIN,
      });
      gsap.set(planeVisual, {
        autoAlpha: 0,
        scale: .42,
        rotationZ: 0,
        transformOrigin: PLANE_TRANSFORM_ORIGIN,
      });
      gsap.set(destinationPulse, { autoAlpha: .82, scale: 1 });
      finishTimer = window.setTimeout(finish, 400);

      return () => {
        disposed = true;
        window.clearTimeout(finishTimer);
        gsap.set(
          [overlay, artwork, globeFallback, canvas, planeFlight, planeVisual, destinationPulse],
          { clearProps: "all" },
        );
      };
    }

    gsap.set(globeFallback, { autoAlpha: 1, x: 0, y: 0, rotation: 0, rotationY: 0 });
    gsap.set(canvas, { autoAlpha: 0 });
    introTimeline = gsap.timeline({ defaults: { overwrite: "auto" } })
      .fromTo(
        overlay,
        { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: .16, ease: "power3.out" },
        0,
      )
      .fromTo(
        artwork,
        { autoAlpha: 0, scale: .96, transformOrigin: "50% 64%" },
        { autoAlpha: 1, scale: 1, duration: .2, ease: "power3.out" },
        .02,
      );

    const startRouteTimeline = (updateGlobe: (progress: number) => void, useWebGlobe = false) => {
      if (disposed || routeTimeline) return;

      const orbit = { progress: 0 };
      gsap.set(planeFlight, {
        x: metrics.path[0].x,
        y: metrics.path[0].y,
        rotation: 0,
        transformOrigin: PLANE_TRANSFORM_ORIGIN,
        willChange: "transform",
      });
      gsap.set(planeVisual, {
        autoAlpha: 0,
        scale: .58,
        rotationZ: 0,
        transformOrigin: PLANE_TRANSFORM_ORIGIN,
        willChange: "transform,opacity",
      });
      gsap.set(destinationPulse, { autoAlpha: 0, scale: .55, willChange: "transform,opacity" });

      routeTimeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: finish,
      });

      routeTimeline
        .to(planeVisual, { autoAlpha: 1, scale: .88, duration: .2, ease: "power2.out" }, .04)
        .to(orbit, {
          progress: 1,
          duration: .8,
          ease: "sine.inOut",
          onUpdate: () => updateGlobe(orbit.progress),
        }, .2)
        .to(planeFlight, {
          motionPath: {
            path: metrics.path,
            curviness: .7,
            autoRotate: true,
          },
          duration: 1.2,
          ease: "power3.out",
        }, .08)
        .to(planeVisual, { scale: .42, duration: 1, ease: "sine.inOut" }, .3)
        .to(planeVisual, { autoAlpha: 0, duration: .35, ease: "sine.out" }, 1.35)
        .to(destinationPulse, { autoAlpha: .82, scale: 1, duration: .55, ease: "sine.out" }, 1.3)
        .to(overlay, { autoAlpha: 0, duration: .15, ease: "power1.in" }, 1.95);

      if (useWebGlobe) {
        routeTimeline
          .to(canvas, { autoAlpha: 1, duration: .12, ease: "sine.out" }, .06)
          .to(globeFallback, { autoAlpha: 0, duration: .12, ease: "sine.out" }, .06)
          .to(canvas, { autoAlpha: 0, duration: .12, ease: "sine.in" }, .94)
          .to(globeFallback, { autoAlpha: 1, duration: .12, ease: "sine.in" }, .94);
      }
    };

    const startFallback = () => {
      gsap.set(canvas, { autoAlpha: 0 });
      gsap.set(globeFallback, { autoAlpha: 1, transformPerspective: 700, transformOrigin: "50% 72%" });
      startRouteTimeline((progress) => {
        const theta = progress * Math.PI * 2;
        gsap.set(globeFallback, {
          x: Math.sin(theta) * width * .016,
          y: (Math.cos(theta) - 1) * height * .012,
          rotation: Math.sin(theta) * 1.4,
          rotationY: Math.sin(progress * Math.PI) * 9,
        });
      });
    };

    const startThreeScene = async () => {
      try {
        const THREE = await import("three");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        disposeThreeScene = () => {
          renderer.dispose();
          renderer.forceContextLoss();
        };

        const resize = () => {
          const bounds = artwork.getBoundingClientRect();
          renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
        };
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(artwork);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
          -REFERENCE_WIDTH / 2,
          REFERENCE_WIDTH / 2,
          REFERENCE_HEIGHT / 2,
          -REFERENCE_HEIGHT / 2,
          .1,
          1000,
        );
        camera.position.z = 400;

        const sourceTexture = await new THREE.TextureLoader().loadAsync(WORLD_ROUTE_ASSET);
        if (disposed) {
          sourceTexture.dispose();
          disposeThreeScene?.();
          disposeThreeScene = null;
          return;
        }

        let textureCanvas: HTMLCanvasElement;
        try {
          textureCanvas = createGlobeTextureCanvas(sourceTexture.image as HTMLImageElement);
        } catch (error) {
          sourceTexture.dispose();
          throw error;
        }
        sourceTexture.dispose();

        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        texture.needsUpdate = true;

        const geometry = new THREE.SphereGeometry(112.8, 64, 40);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          depthWrite: false,
          toneMapped: false,
        });
        const globe = new THREE.Mesh(geometry, material);
        globe.position.set(2.23, -88.78, 0);

        const globeGroup = new THREE.Group();
        globeGroup.add(globe);
        scene.add(globeGroup);

        const render = () => {
          if (disposed) return;
          renderer.render(scene, camera);
          renderFrame = window.requestAnimationFrame(render);
        };
        renderer.render(scene, camera);
        renderFrame = window.requestAnimationFrame(render);

        const disposeRenderer = disposeThreeScene;
        disposeThreeScene = () => {
          window.cancelAnimationFrame(renderFrame);
          scene.remove(globeGroup);
          geometry.dispose();
          material.dispose();
          texture.dispose();
          disposeRenderer?.();
        };

        startRouteTimeline((progress) => {
          const theta = progress * Math.PI * 2;
          globeGroup.position.x = Math.sin(theta) * 4.2;
          globeGroup.position.y = (Math.cos(theta) - 1) * 2.4;
          globeGroup.rotation.z = Math.sin(theta) * .018;
          globeGroup.rotation.y = theta;
        }, true);
      } catch {
        resizeObserver?.disconnect();
        resizeObserver = null;
        disposeThreeScene?.();
        disposeThreeScene = null;
        if (!disposed) startFallback();
      }
    };

    void startThreeScene();

    return () => {
      disposed = true;
      window.clearTimeout(finishTimer);
      introTimeline?.kill();
      routeTimeline?.kill();
      resizeObserver?.disconnect();
      disposeThreeScene?.();
      gsap.killTweensOf([
        overlay,
        artwork,
        globeFallback,
        canvas,
        planeFlight,
        planeVisual,
        destinationPulse,
      ]);
      gsap.set(
        [overlay, artwork, globeFallback, canvas, planeFlight, planeVisual, destinationPulse],
        { clearProps: "all" },
      );
    };
  }, [destination, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="prototype-work-location-loading"
      role="status"
      aria-live="assertive"
      aria-label={`Loading ${destination}`}
    >
      <div ref={artworkRef} className="prototype-work-location-loading-artwork prototype-work-location-loading-artwork--world">
        <div ref={globeFallbackRef} className="prototype-world-route-globe-fallback" aria-hidden="true">
          <Image src={WORLD_ROUTE_ASSET} alt="" width={359} height={269} priority />
        </div>
        <canvas ref={globeCanvasRef} className="prototype-world-route-canvas" aria-hidden="true" />
        <div ref={planeFlightRef} className="prototype-world-route-plane-flight" aria-hidden="true">
          <div ref={planeVisualRef} className="prototype-world-route-plane-visual">
            <Image src={WORLD_ROUTE_ASSET} alt="" width={359} height={269} priority />
          </div>
        </div>
        <span className="prototype-world-route-destination" aria-hidden="true">
          <span ref={destinationPulseRef} />
        </span>
      </div>
    </div>
  );
}
