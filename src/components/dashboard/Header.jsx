import React from "react";
import { ChefHat, BookOpen, Search, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-100/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-200">
            <ChefHat size={23} strokeWidth={2.4} className="text-white" />

            <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white/30 blur-[2px]" />
          </div>

          <div className="leading-none">
            <h1 className="text-[19px] font-extrabold tracking-tight text-slate-800">
              Cooking<span className="text-cyan-500">App</span>
            </h1>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Learn • Cook • Master
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="/"
            className="rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-bold text-blue-600"
          >
            Home
          </a>

          <a
            href="/lessons"
            className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-blue-600"
          >
            <BookOpen
              size={17}
              className="transition group-hover:-translate-y-0.5"
            />
            Lessons
          </a>

          <a
            href="/recipes"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-blue-600"
          >
            Recipes
          </a>

          <a
            href="/challenges"
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-blue-600"
          >
            Challenges
            <Sparkles size={14} className="text-cyan-400" />
          </a>
        </nav>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Search */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-sky-50 hover:text-cyan-600"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* CTA */}
          <a
            href="/learn"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200"
          >
            <span className="relative z-10">Logout</span>

            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-blue-600 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-sky-100 bg-white px-5 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="/"
              className="rounded-xl bg-sky-50 px-4 py-3 font-bold text-blue-600"
            >
              Home
            </a>

            <a
              href="/lessons"
              className="rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-sky-50"
            >
              Lessons
            </a>

            <a
              href="/recipes"
              className="rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-sky-50"
            >
              Recipes
            </a>

            <a
              href="/challenges"
              className="rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-sky-50"
            >
              Challenges ✨
            </a>

            <div className="my-2 h-px bg-sky-100" />

            <Link
              to="/"
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-center font-bold text-white shadow-md shadow-red-200"
            >
              Logout →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
