'use client';

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Enter your email"
        className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 outline-none transition-all focus:border-white/[0.12] focus:bg-white/[0.05]"
      />
      <button
        type="submit"
        className="rounded-xl border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.13] hover:text-white"
      >
        Subscribe
      </button>
    </form>
  );
}
