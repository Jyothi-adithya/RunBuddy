import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="relative min-h-screen overflow-hidden bg-hero-coral px-4 py-20 text-white">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center">
      <span className="rounded-pill border border-white/35 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-coral-100">
        Local running community
      </span>
      <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] text-white md:text-7xl">
        Find your pace. Meet your crew. Run smarter.
      </h1>
      <p className="max-w-2xl text-lg text-coral-100 md:text-2xl">
        RunBuddy connects nearby runners with matching pace and goals so each session feels social, safe, and motivating.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link to="/signup" className="rounded-pill bg-coral-500 px-8 py-4 text-lg font-bold text-white shadow-glow transition hover:bg-coral-600">
          Start Free
        </Link>
        <Link to="/login" className="rounded-pill border border-white/60 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10">
          I already have an account
        </Link>
      </div>
    </div>
  </div>
);

export default Landing;