import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Plus, Minus, Landmark, ShieldCheck, Scale } from 'lucide-react';

const principles = [
  {
    num: '01',
    title: 'Fiduciary, without asterisks',
    body: 'We are legally and ethically bound to act in your interest — not most of the time, not when convenient, but always. We accept no commissions, no revenue sharing, no soft-dollar arrangements. Our only incentive is the one you pay us for: your outcome.',
  },
  {
    num: '02',
    title: 'Evidence over forecasts',
    body: 'We do not pretend to know where the market goes next quarter. Nobody does. We build portfolios on six decades of academic evidence — broad diversification, disciplined rebalancing, ruthless cost control — and let compounding do the heavy lifting.',
  },
  {
    num: '03',
    title: 'Planning before products',
    body: 'A portfolio is the last thing we build, not the first. Tax strategy, estate structure, insurance gaps, equity compensation, charitable intent — the plan comes first. The investments simply fund it.',
  },
  {
    num: '04',
    title: 'Candor, even when it costs us',
    body: 'If you do not need us, we will tell you. If a strategy is working against you, we will say so plainly. We have ended engagements that were profitable for us but wrong for the client. We sleep well.',
  },
];

const team = [
  {
    name: 'Eleanor Voss',
    role: 'Founding Partner',
    creds: 'CFP®, CFA',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=720&h=900&fit=crop',
    bio: 'Former portfolio strategist at Brown Brothers Harriman. Founded Alder & Main in 2009 after concluding that the brokerage model could not be reformed from the inside.',
  },
  {
    name: 'Marcus Okafor',
    role: 'Partner, Tax & Estate Strategy',
    creds: 'CPA, CFP®',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=720&h=900&fit=crop',
    bio: 'Eleven years at Deloitte Private Wealth before joining in 2014. Architect of our tax-loss harvesting and Roth conversion frameworks.',
  },
  {
    name: 'Priya Raghavan',
    role: 'Director of Financial Planning',
    creds: 'CFP®, ChFC®',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=720&h=900&fit=crop',
    bio: 'Specializes in equity compensation and pre-IPO planning for technology executives. Joined from Vanguard Personal Advisor Services in 2018.',
  },
  {
    name: 'Daniel Hartwell',
    role: 'Senior Wealth Advisor',
    creds: 'CFP®',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=720&h=900&fit=crop',
    bio: 'Works primarily with physicians and business owners approaching transition. Believes the best advice usually starts with listening longer than feels comfortable.',
  },
];

const milestones = [
  { year: '2009', event: 'Founded in a two-room office above a bookshop on Alder Street, Portland. Eleven clients, all referred.' },
  { year: '2013', event: 'Crossed $100M in assets under management. Hired our first dedicated planning associate.' },
  { year: '2017', event: 'Adopted a flat-fee structure for clients under $1M — among the first independent RIAs in the Northwest to do so.' },
  { year: '2021', event: 'Named to the CNBC FA 100 list of top independent advisory firms in the United States.' },
  { year: '2024', event: '$840M under management, 312 client households, and a 98.4% annual retention rate. Still no sales targets.' },
];

export default function App() {
  const [openPrinciple, setOpenPrinciple] = useState(0);

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1B17] antialiased selection:bg-[#1F3D2B] selection:text-[#F4EFE6]">
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .grain::after {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 50;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .underline-grow { position: relative; }
        .underline-grow::after {
          content: ''; position: absolute; left: 0; bottom: -2px; height: 1px; width: 0;
          background: currentColor; transition: width .35s cubic-bezier(.4,0,.2,1);
        }
        .underline-grow:hover::after { width: 100%; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #F4EFE6; }
        ::-webkit-scrollbar-thumb { background: #C9BFA9; border-radius: 6px; }
      `}} />

      <div className="grain font-body">

        {/* ───────── NAV ───────── */}
        <header className="sticky top-0 z-40 bg-[#F4EFE6]/90 backdrop-blur-sm border-b border-[#1C1B17]/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[22px] font-medium tracking-tight">Alder & Main</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#1C1B17]/50">Wealth Counsel</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#1C1B17]/70">
              {['Approach', 'Services', 'About', 'Insights'].map((item, i) => (
                <a key={item} href="#" className={`underline-grow ${i === 2 ? 'text-[#1C1B17]' : 'hover:text-[#1C1B17]'} transition-colors`}>{item}</a>
              ))}
              <a href="#" className="group flex items-center gap-2 bg-[#1F3D2B] text-[#F4EFE6] px-5 py-2.5 rounded-full text-[13px] hover:bg-[#16301F] transition-colors">
                Begin a conversation
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </nav>
          </div>
        </header>

        {/* ───────── HERO ───────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[12px] uppercase tracking-[0.22em] text-[#9A6A2B] font-semibold mb-8">
            About the firm
          </motion.p>

          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-8 font-display text-[44px] leading-[1.05] sm:text-[64px] lg:text-[78px] font-light tracking-[-0.02em]">
              Wealth advice the way it was meant to be practiced<span className="text-[#9A6A2B]">—</span>
              <em className="font-light">quietly</em>, carefully, and entirely on your side.
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="lg:col-span-4 space-y-6">
              <p className="text-[16px] leading-relaxed text-[#1C1B17]/70">
                Alder & Main is an independent, fee-only advisory practice serving 312 families across the Pacific Northwest. We hold no products, chase no quotas, and answer to no one but the people whose names are on the accounts.
              </p>
              <a href="#" className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#1F3D2B]">
                Read our fiduciary oath
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>

          {/* hero image band */}
          <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-16 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 overflow-hidden rounded-[4px]">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=800&fit=crop" alt="Alder & Main offices"
                className="w-full h-[320px] md:h-[440px] object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-12 md:col-span-4 bg-[#1F3D2B] text-[#F4EFE6] rounded-[4px] p-8 lg:p-10 flex flex-col justify-between min-h-[280px]">
              <Landmark size={28} strokeWidth={1.25} className="text-[#C9A562]" />
              <div>
                <p className="font-display text-[26px] lg:text-[30px] leading-snug font-light">
                  “Most firms sell certainty. We sell discipline. Only one of those exists.”
                </p>
                <p className="mt-5 text-[13px] text-[#F4EFE6]/60">Eleanor Voss — Founding Partner</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ───────── STATS ───────── */}
        <section className="border-y border-[#1C1B17]/10 bg-[#EFE8DA]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-2 lg:grid-cols-4 gap-y-10">
            {[
              { value: '$840M', label: 'Assets under management' },
              { value: '312', label: 'Client households served' },
              { value: '98.4%', label: 'Annual client retention' },
              { value: '0', label: 'Commissions accepted, ever' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`px-2 ${i !== 0 ? 'lg:border-l lg:border-[#1C1B17]/10 lg:pl-10' : ''}`}>
                <p className="font-display text-[42px] lg:text-[52px] font-light tracking-tight text-[#1F3D2B]">{s.value}</p>
                <p className="mt-1 text-[13px] text-[#1C1B17]/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───────── PRINCIPLES ───────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-[12px] uppercase tracking-[0.22em] text-[#9A6A2B] font-semibold mb-5">How we practice</p>
              <h2 className="font-display text-[36px] lg:text-[44px] leading-[1.08] font-light tracking-tight">
                Four commitments, written down and kept.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-[#1C1B17]/65 max-w-sm">
                We put these in every client agreement. They are not marketing language — they are the operating constraints of the firm.
              </p>
            </div>

            <div className="lg:col-span-8">
              {principles.map((p, i) => {
                const open = openPrinciple === i;
                return (
                  <div key={p.num} className="border-b border-[#1C1B17]/12 first:border-t">
                    <button onClick={() => setOpenPrinciple(open ? -1 : i)}
                      className="w-full flex items-center gap-6 py-7 text-left group">
                      <span className={`font-display text-[15px] tabular-nums ${open ? 'text-[#9A6A2B]' : 'text-[#1C1B17]/40'}`}>{p.num}</span>
                      <span className={`flex-1 font-display text-[24px] lg:text-[28px] font-light tracking-tight transition-colors ${open ? 'text-[#1F3D2B]' : 'group-hover:text-[#1F3D2B]'}`}>
                        {p.title}
                      </span>
                      <span className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${open ? 'bg-[#1F3D2B] border-[#1F3D2B] text-[#F4EFE6]' : 'border-[#1C1B17]/25 text-[#1C1B17]/60 group-hover:border-[#1F3D2B]'}`}>
                        {open ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>
                    <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                      <p className="pb-8 pl-12 pr-6 lg:pr-24 text-[15.5px] leading-[1.75] text-[#1C1B17]/70">{p.body}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────── TEAM ───────── */}
        <section className="bg-[#1C1B17] text-[#F4EFE6] py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div>
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#C9A562] font-semibold mb-5">The people</p>
                <h2 className="font-display text-[36px] lg:text-[48px] font-light tracking-tight leading-[1.05]">
                  Eleven advisors. <span className="text-[#F4EFE6]/50">Zero salespeople.</span>
                </h2>
              </div>
              <a href="#" className="group inline-flex items-center gap-2 text-[14px] font-medium text-[#F4EFE6]/70 hover:text-[#F4EFE6] transition-colors">
                Meet the full team <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m, i) => (
                <motion.div key={m.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="group">
                  <div className="overflow-hidden rounded-[4px] mb-5">
                    <img src={m.img} alt={m.name}
                      className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-[21px] font-medium tracking-tight">{m.name}</h3>
                    <span className="text-[11px] tracking-wide text-[#C9A562]">{m.creds}</span>
                  </div>
                  <p className="text-[13px] text-[#F4EFE6]/55 mt-0.5">{m.role}</p>
                  <p className="text-[13.5px] leading-relaxed text-[#F4EFE6]/70 mt-4 border-t border-[#F4EFE6]/12 pt-4">{m.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── TIMELINE + FEES ───────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-16">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#9A6A2B] font-semibold mb-5">Fifteen years on</p>
            <h2 className="font-display text-[34px] lg:text-[42px] font-light tracking-tight mb-12">Built slowly, on purpose.</h2>
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="grid grid-cols-[80px_1fr] gap-6 py-6 border-b border-[#1C1B17]/10 last:border-b-0 group">
                  <span className="font-display text-[22px] text-[#1F3D2B] group-hover:text-[#9A6A2B] transition-colors">{m.year}</span>
                  <p className="text-[15px] leading-relaxed text-[#1C1B17]/70 pt-1">{m.event}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fee card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#EFE8DA] border border-[#1C1B17]/10 rounded-[4px] p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Scale size={20} strokeWidth={1.5} className="text-[#9A6A2B]" />
                <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#1C1B17]/60">How we are paid</p>
              </div>
              <h3 className="font-display text-[28px] font-light tracking-tight leading-snug mb-6">
                One fee. Disclosed in writing. Nothing else, from anyone.
              </h3>
              <div className="space-y-4 text-[14.5px] leading-relaxed text-[#1C1B17]/70">
                <div className="flex justify-between border-b border-[#1C1B17]/10 pb-3">
                  <span>Households under $1M</span><span className="font-semibold text-[#1C1B17]">$9,600 / yr flat</span>
                </div>
                <div className="flex justify-between border-b border-[#1C1B17]/10 pb-3">
                  <span>$1M – $5M</span><span className="font-semibold text-[#1C1B17]">0.85% of assets</span>
                </div>
                <div className="flex justify-between border-b border-[#1C1B17]/10 pb-3">
                  <span>Above $5M</span><span className="font-semibold text-[#1C1B17]">0.55% of assets</span>
                </div>
              </div>
              <div className="mt-8 flex items-start gap-3 text-[13px] text-[#1C1B17]/60 leading-relaxed">
                <ShieldCheck size={18} strokeWidth={1.5} className="text-[#1F3D2B] shrink-0 mt-0.5" />
                <p>Registered Investment Adviser with the SEC. Our Form ADV is available on request — and worth reading before hiring anyone, including us.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="bg-[#1F3D2B] text-[#F4EFE6]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <h2 className="font-display text-[38px] lg:text-[56px] font-light tracking-tight leading-[1.05]">
                The first conversation is unhurried,<br className="hidden lg:block" /> confidential, and free of obligation.
              </h2>
              <p className="mt-6 text-[15.5px] text-[#F4EFE6]/65 max-w-xl leading-relaxed">
                Ninety minutes. Your full financial picture on the table. If we are not the right fit, we will tell you who is.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <a href="#" className="group inline-flex items-center gap-3 bg-[#C9A562] text-[#1C1B17] px-8 py-4 rounded-full text-[15px] font-semibold hover:bg-[#D9B873] transition-colors">
                Schedule an introduction
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
          <div className="border-t border-[#F4EFE6]/15">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-[#F4EFE6]/45">
              <p>© 2025 Alder & Main Wealth Counsel, LLC · Portland & Seattle</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-[#F4EFE6] transition-colors">Form ADV</a>
                <a href="#" className="hover:text-[#F4EFE6] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#F4EFE6] transition-colors">Disclosures</a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}