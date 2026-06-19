"use client";

import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { LottiePlayer } from "@/components/motion/LottiePlayer";
import { MomentsGrid } from "@/components/home/MomentsGrid";
import { ClipReveal } from "@/components/journey/ClipReveal";

/** Vertical stagger so the scrolling row reads as a gentle wave (some cards raised). */
const OFFSETS = [-26, 26, -26, 26];

function PhotoCard({ src, alt, label, offset }: { src: string; alt: string; label: string; offset: number }) {
  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden"
      style={{ width: 230, height: 290, transform: `translateY(${offset}px)` }}
    >
      <Image src={src} alt={alt} fill sizes="230px" className="object-cover" loading="lazy" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(20,18,42,0.65) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <span
        className="absolute bottom-3 left-3 font-sans font-semibold text-sm px-3 py-1 rounded-pill"
        style={{ background: "rgba(20,18,42,0.72)", color: "#F4F2FF" }}
      >
        {label}
      </span>
    </div>
  );
}

/* Unsplash placeholder photos — happy couples and duos sharing warm platonic moments */
const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=480&q=80",
    alt: "A happy couple walking together laughing on a city street",
    label: "City Walk",
  },
  {
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=480&q=80",
    alt: "A fitness duo working out and laughing together at a gym",
    label: "Gym Buddy",
  },
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=480&q=80",
    alt: "A couple having an animated, happy conversation at a café",
    label: "Café Chat",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=480&q=80",
    alt: "A couple laughing and enjoying a live music festival together",
    label: "Live Concert",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=480&q=80",
    alt: "A happy duo looking out at mountain peaks on a hiking trail",
    label: "Hiking Trail",
  },
  {
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480&q=80",
    alt: "A couple chatting warmly and laughing at a social gathering",
    label: "Rooftop Social",
  },
  {
    src: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=480&q=80",
    alt: "Two people smiling and looking at classical art on a museum tour",
    label: "Museum Tour",
  },
  {
    src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=480&q=80",
    alt: "A couple laughing and cooking a meal together in the kitchen",
    label: "Cooking Together",
  },
  {
    src: "/jam-session.jpg",
    alt: "A couple smiling and playing acoustic guitar together during a jam session",
    label: "Jam Session",
  },
  {
    src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=480&q=80",
    alt: "A couple sharing snacks and enjoying a movie night together",
    label: "Movie Night",
  },
  {
    src: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=480&q=80",
    alt: "Two friends smiling and laughing over a board game night",
    label: "Game Night",
  },
  {
    src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=480&q=80",
    alt: "A couple smiling while cycling side-by-side on a scenic road",
    label: "Cycling",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=480&q=80",
    alt: "A couple having fun and splashing water at the beach",
    label: "Swim & Sport",
  },
  {
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=480&q=80",
    alt: "A couple celebrating happily at a sports game day",
    label: "Game Day",
  },
  {
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=480&q=80",
    alt: "A couple painting together at a creative art class",
    label: "Art & Crafts",
  },
  {
    src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=480&q=80",
    alt: "A couple sitting outside their tent during a weekend camping trip",
    label: "Weekend Camping",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&q=80",
    alt: "A couple walking closely and laughing in the city",
    label: "City Hangout",
  },
  {
    src: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=480&q=80",
    alt: "A couple celebrating together on a peak at sunset",
    label: "Sunset Trek",
  },
] as const;

export function PeopleSection() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--grad-dark-panel)" }}
      aria-labelledby="people-heading"
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-96 rounded-full opacity-10 blur-3xl" style={{ background: "var(--color-violet)" }} />

      {/* Birdies — subtle ambient decorative, behind content */}
      <div aria-hidden="true" className="pointer-events-none absolute top-8 right-8 opacity-15 select-none hidden md:block">
        <LottiePlayer src="/lottie/birdies.json" width={180} height={120} loop />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16">
        <RevealGroup>
          <Reveal>
            <p className="label-eyebrow mb-4" style={{ color: "var(--color-gold)" }}>
              Real people · Real moments
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ClipReveal
              id="people-heading"
              text="Life is richer with someone."
              accent="with someone."
              accentStyle={{
                background: 'linear-gradient(135deg, #FFB23E, #7A4FE0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              className="font-display text-h1 leading-tight tracking-tight max-w-3xl mb-5"
              style={{ color: 'var(--color-panel-text)', letterSpacing: '-0.03em' }}
            />
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lead max-w-xl" style={{ color: "rgba(244,242,255,0.65)" }}>
              From a dawn city walk to a weekend hike, every activity is better with
              someone warm beside you. Companio connects you with verified companions
              who share your city and your energy.
            </p>
          </Reveal>
        </RevealGroup>
      </div>

      {/* Moments bento grid — 5 Lottie blocks, varied sizes */}
      <MomentsGrid />

      <Marquee speed={56} className="py-12">
        {PHOTOS.map((photo, i) => (
          <PhotoCard key={photo.src} {...photo} offset={OFFSETS[i % OFFSETS.length]} />
        ))}
      </Marquee>

    </section>
  );
}
