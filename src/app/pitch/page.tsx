import React from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Code2, MessageSquare, Zap, Users, Target, AlertCircle } from 'lucide-react';
import { calendlyUrl, email } from '@/lib/site-config';

export const metadata = {
  title: 'Work With Me | Vishesh Baghel',
  description: 'Ship your MVP in 20 hours. $500. Backend-heavy development, AI integration, and infrastructure hardening.',
};

const PitchPage = () => {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />

        <main className="space-y-12 sm:space-y-16 mb-20">
          {/* Hero Section */}
          <section className="py-6 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              i help founders ship their first mvp
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              or upgrade their vibe-coded prototype into something that actually scales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-accent-red bg-accent-red text-white px-4 py-2.5 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
              >
                book a 15-min intro <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`mailto:${email}?subject=${encodeURIComponent('project inquiry')}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-4 py-2.5 text-sm font-medium no-underline hover:bg-secondary transition-colors"
              >
                send an email
              </Link>
            </div>
          </section>

          {/* The Deal - Pricing Section */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">the deal</h2>
            <div className="border-2 border-accent-red p-6 sm:p-8 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold">$500</span>
                <span className="text-muted-foreground">for 20 hours of work</span>
              </div>
              <p className="text-sm sm:text-base">
                that's your mvp. after 20 hours, you'll know if i'm worth keeping around or not. 
                if my work is subpar, walk away. no hard feelings.
              </p>
              <div className="grid gap-2 text-sm pt-2">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-accent-red shrink-0" />
                  <span>working product, not a prototype</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-accent-red shrink-0" />
                  <span>clean codebase you can extend</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-accent-red shrink-0" />
                  <span>documentation so you're not stuck</span>
                </div>
              </div>
            </div>
          </section>

          {/* What I'll Help With */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">what i can help with</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">mvp development</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  build your first version from scratch. backend-heavy, production-ready, 
                  with proper error handling and observability baked in.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Code2 className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">vibe code rescue</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  upgrade your ai-generated prototype into something reliable. 
                  add tests, fix the architecture, make it scale-ready.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">ai integration</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  add agents, llm routing, rag, or any ai capability to your existing product. 
                  i work with mastra, langchain, and raw openai apis daily.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">infra hardening</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  observability, monitoring, ci/cd, proper deployments. 
                  make your product reliable before you scale.
                </p>
              </article>
            </div>
          </section>

          {/* What You Get Beyond Code */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">what you actually get</h2>
            <div className="space-y-3">
              <div className="border border-border p-4 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-accent-red text-accent-red font-bold text-sm mt-0.5">1</div>
                <div>
                  <h3 className="font-semibold text-base m-0 mb-1">a framework, not a dependency</h3>
                  <p className="text-sm text-muted-foreground m-0">
                    i'll teach you how to build on your own. you won't need me for every feature. 
                    the goal is to make you independent, not to create recurring revenue for myself.
                  </p>
                </div>
              </div>
              <div className="border border-border p-4 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-accent-red text-accent-red font-bold text-sm mt-0.5">2</div>
                <div>
                  <h3 className="font-semibold text-base m-0 mb-1">systems that run themselves</h3>
                  <p className="text-sm text-muted-foreground m-0">
                    where it makes sense, i'll set up agents and automation. 
                    your product should work while you sleep.
                  </p>
                </div>
              </div>
              <div className="border border-border p-4 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-accent-red text-accent-red font-bold text-sm mt-0.5">3</div>
                <div>
                  <h3 className="font-semibold text-base m-0 mb-1">honest assessment</h3>
                  <p className="text-sm text-muted-foreground m-0">
                    if something is out of my depth, i'll tell you. 
                    if your idea has technical problems, i'll tell you that too.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What I Expect */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">what i expect in return</h2>
            <p className="text-sm text-muted-foreground mb-4">
              the price is low intentionally. in exchange, i have three requirements:
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="size-5 text-accent-red shrink-0" />
                  <span className="font-semibold text-sm leading-none">testimonial</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground m-0">
                  public feedback on x or linkedin. positive or negative — doesn't matter. 
                  i want honest reviews.
                </p>
              </div>
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="size-5 text-accent-red shrink-0" />
                  <span className="font-semibold text-sm leading-none">brutal feedback</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground m-0">
                  tell me what sucked. tell me what worked. i need to know where i'm weak 
                  to get better.
                </p>
              </div>
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="size-5 text-accent-red shrink-0" />
                  <span className="font-semibold text-sm leading-none">one introduction</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground m-0">
                  if you liked my work, introduce me to one founder friend who's building something.
                </p>
              </div>
            </div>
          </section>

          {/* Honest Background */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">full transparency</h2>
            <div className="border-l-4 border-accent-red pl-4 sm:pl-6 py-2 space-y-4">
              <p className="text-sm sm:text-base m-0">
                i'm a software engineer but new to consulting. i don't have a portfolio of 50 clients. 
                i'm building that from scratch.
              </p>
              <p className="text-sm sm:text-base m-0">
                what i do have: 3+ years writing production software, daily work with cutting-edge ai tooling, 
                contributions to open source frameworks i actually use, and an ability to figure things out fast.
              </p>
              <p className="text-sm sm:text-base m-0">
                my strongest skill isn't any specific technology — it's learning. 
                give me something vague, and i'll deliver something concrete. 
                you can trust that the work gets done.
              </p>
            </div>
          </section>

          {/* Skills Breakdown */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">technical background</h2>
            <div className="grid gap-2 text-sm border border-border p-4 sm:p-5">
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">strong:</span>
                <span className="text-muted-foreground">typescript, node.js, postgres, ai agents, backend systems</span>
              </div>
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">solid:</span>
                <span className="text-muted-foreground">react, next.js, aws, docker, observability</span>
              </div>
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">enough to ship:</span>
                <span className="text-muted-foreground">frontend design, css, tailwind</span>
              </div>
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">learning:</span>
                <span className="text-muted-foreground">whatever your project needs</span>
              </div>
            </div>
          </section>

          {/* Why Not Just Vibe Code */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">why not just use cursor/bolt/v0?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>you can. many founders do. but here's the thing:</p>
              <ul className="space-y-2 list-none p-0">
                <li className="flex items-center gap-2 before:content-none">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>vibe-coded apps break in production. i've seen it. i've fixed it.</span>
                </li>
                <li className="flex items-center gap-2 before:content-none">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>you'll spend $200+ on ai tools and still need to debug the output.</span>
                </li>
                <li className="flex items-center gap-2 before:content-none">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>i write software daily. i know what scales and what doesn't.</span>
                </li>
                <li className="flex items-center gap-2 before:content-none">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>you get a person who can answer questions, not a chat window.</span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                $500 gets you a working product and someone who can explain how it works.
              </p>
            </div>
          </section>

          {/* Process */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">how it works</h2>
            <div className="space-y-0">
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">1</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">15-min call</h3>
                  <p className="text-sm text-muted-foreground m-0">you explain what you're building. i ask questions. we see if it's a fit.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">2</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">scope and quote</h3>
                  <p className="text-sm text-muted-foreground m-0">i send you what i'll build, how long it'll take, and any constraints.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">3</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">i build, you review</h3>
                  <p className="text-sm text-muted-foreground m-0">async updates. you see progress. you can course-correct early.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5">4</div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">handoff</h3>
                  <p className="text-sm text-muted-foreground m-0">you get the code, docs, and a walkthrough. you're not stuck.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-2 border-border p-6 sm:p-8 space-y-4 text-center">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-2">ready to ship something?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              15 minutes is enough to know if we're a fit. no sales pitch, just a conversation about what you're building.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-accent-red bg-accent-red text-white px-6 py-3 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
              >
                book a call <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`mailto:${email}?subject=${encodeURIComponent('project inquiry')}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 text-sm font-medium no-underline hover:bg-secondary transition-colors"
              >
                prefer email? reach out
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-2 m-0">
              have clients but don't build?{' '}
              <Link href="/partners" className="text-accent-red underline hover:opacity-80">
                become a referral partner
              </Link>
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PitchPage;
