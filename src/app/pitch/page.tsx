import React from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Code2,
  MessageSquare,
  Zap,
  Users,
  Target,
  AlertCircle,
} from "lucide-react";
import { calendlyUrl, email } from "@/lib/site-config";

export const metadata = {
  title: "Work With Me | Vishesh Baghel",
  description:
    "AI integrations and MVPs for startups. I help founders add AI to their products using cutting-edge typescript tools. OSS contributor to Mastra.",
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
              i help startups add ai to their products
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              agents, integrations, or full ai-powered mvps. i contribute to the
              typescript tools i use — so when things break, i can actually fix
              them.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              most founders spend their first month watching demos break because
              the llm hallucinated, debugging tool calls that worked yesterday,
              and rewriting code for frameworks that changed last week. i've
              already shipped through all of that.
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
                href={`mailto:${email}?subject=${encodeURIComponent("project inquiry")}`}
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
                <span className="text-muted-foreground">
                  for 20 hours of work
                </span>
              </div>
              <p className="text-sm sm:text-base">
                that's your ai integration or mvp kickstart. 20 hours gets you a
                working ai chat feature, an agent integration, or a solid
                prototype. not satisfied? full refund — i'd rather lose the
                money than have an unhappy client.
              </p>
              <div className="grid gap-2 text-sm pt-2">
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-accent-red shrink-0 mt-0.5" />
                  <span>
                    production-ready ai features — error handling, retries, and
                    monitoring included
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-accent-red shrink-0 mt-0.5" />
                  <span>
                    clean typescript codebase your next developer can extend
                    without rewriting
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-accent-red shrink-0 mt-0.5" />
                  <span>
                    documentation so you can maintain it yourself or onboard
                    teammates
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* What I'll Help With */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              what i can help with
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">
                    ai agents & integrations
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  add agents, smart model switching, or knowledge retrieval to
                  your existing product. i contribute to mastra (ai agent
                  framework) and use vercel ai sdk in production daily.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">
                    ai-powered mvps
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  build your ai product from scratch. chatbots, automation
                  tools, ai-native apps. production-ready with proper error
                  handling and observability.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Code2 className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">
                    tool adoption
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  migrate to modern ai frameworks before your competitors do.
                  you get production code while others are still watching
                  tutorials.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">
                    prototype cleanup
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  upgrade your cursor/bolt prototype into something
                  production-ready. add tests, fix the architecture, make it
                  reliable before launch.
                </p>
              </article>
            </div>
          </section>

          {/* What You Get Beyond Code */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              what you actually get
            </h2>
            <div className="space-y-3">
              <div className="border border-border p-4 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-accent-red text-accent-red font-bold text-sm mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 mb-1">
                    a framework, not a dependency
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    you'll stop being dependent on contractors for every ai
                    feature. i'll teach you how to build on your own — that's
                    freedom, not a subscription.
                  </p>
                </div>
              </div>
              <div className="border border-border p-4 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-accent-red text-accent-red font-bold text-sm mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 mb-1">
                    systems that run themselves
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    i'll set up agents and automation that handle repetitive
                    tasks. your product should work while you sleep.
                  </p>
                </div>
              </div>
              <div className="border border-border p-4 flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-accent-red text-accent-red font-bold text-sm mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 mb-1">
                    honest assessment
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    if something is out of my depth, i'll tell you. if your idea
                    has technical problems, i'll tell you that too.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What I Expect */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              what i expect in return
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              the price is low intentionally. in exchange, i have three
              requirements:
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="size-5 text-accent-red shrink-0" />
                  <span className="font-semibold text-sm leading-none">
                    testimonial
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground m-0">
                  public feedback on x or linkedin. positive or negative —
                  doesn't matter. i want honest reviews.
                </p>
              </div>
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="size-5 text-accent-red shrink-0" />
                  <span className="font-semibold text-sm leading-none">
                    brutal feedback
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground m-0">
                  tell me what sucked. tell me what worked. i need to know where
                  i'm weak to get better.
                </p>
              </div>
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="size-5 text-accent-red shrink-0" />
                  <span className="font-semibold text-sm leading-none">
                    one introduction
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground m-0">
                  if you liked my work, introduce me to one founder friend who's
                  adding ai to their product.
                </p>
              </div>
            </div>
          </section>

          {/* Honest Background */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              why work with me now
            </h2>
            <div className="border-l-4 border-accent-red pl-4 sm:pl-6 py-2 space-y-4">
              <p className="text-sm sm:text-base m-0">
                i'm a software engineer with 3.5 years building backend systems
                at fintech and saas startups. i'm building my consulting
                practice from scratch — which means you get senior-level ai
                expertise at early-stage prices.
              </p>
              <p className="text-sm sm:text-base m-0">
                what you're getting: 10 merged prs to mastra (ai agent
                framework), focused on memory systems and integrations. when you
                hit a weird bug, i can read the source code and fix it — not
                just google the error message. the mastra team refers clients to
                me when they need implementation help.
              </p>
              <p className="text-sm sm:text-base m-0">
                my edge: i shipped production mastra code within 2 months of the
                framework launching. i adopt tools before they're mainstream —
                you get working implementations while your competitors are still
                figuring out the basics.
              </p>
            </div>
          </section>

          {/* Past Work */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              proof of work
            </h2>
            <div className="space-y-4">
              <div className="border border-border p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-red shrink-0" />
                  <Link
                    href="https://artifact.engineer"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-base m-0 hover:text-accent-red transition-colors"
                  >
                    artifact.engineer
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  built an ai agent for this yc-backed startup's real-time
                  diagram editor. natural language prompts to canvas mutations,
                  with tool calls, safety checks, and audit logs. shipped to
                  production — now handling customer requests daily.
                </p>
              </div>
              <div className="border border-border p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-red shrink-0" />
                  <Link
                    href="https://github.com/mastra-ai/mastra"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-base m-0 hover:text-accent-red transition-colors"
                  >
                    mastra oss contributions
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  10 merged prs focused on memory systems and integrations. when
                  you hit a weird bug or edge case, i can read the source code
                  and fix it — not just google the error message.
                </p>
              </div>
            </div>
          </section>

          {/* Referral Proof */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              how i got my first client
            </h2>
            <p className="text-sm text-muted-foreground">
              i didn't cold email or run ads. the mastra cto saw my
              contributions and connected me directly.
            </p>
            <div className="border border-border overflow-hidden">
              <img
                src="/clients/mastra-referral.png"
                alt="DM conversation showing Mastra CTO referring me to Artifact Engineering team"
                className="w-full"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              that referral turned into artifact.engineer — my first consulting
              project. this is what i mean when i say the mastra team trusts my
              work.
            </p>
          </section>

          {/* Skills Breakdown */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              technical stack
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              this stack means your ai features plug directly into your next.js
              or react app — no awkward glue code, no performance bottlenecks,
              no "it works on my machine" surprises.
            </p>
            <div className="grid gap-2 text-sm border border-border p-4 sm:p-5">
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">ai tools:</span>
                <span className="text-muted-foreground">
                  mastra, vercel ai sdk, openai apis, langchain, rag pipelines
                </span>
              </div>
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">core stack:</span>
                <span className="text-muted-foreground">
                  typescript, node.js, postgres, next.js, react
                </span>
              </div>
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold shrink-0">infra:</span>
                <span className="text-muted-foreground">
                  aws, docker, ci/cd, observability, monitoring
                </span>
              </div>
            </div>
          </section>

          {/* Why Not Just Vibe Code */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              why not just use cursor/bolt/v0?
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>you can. many founders do. but here's what happens next:</p>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>
                    your first paying customer sees gibberish instead of a
                    response. the llm hallucinated and there's no retry logic,
                    no fallback — just a broken experience.
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>
                    you demo to investors and it works perfectly. launch day
                    hits, 50 users show up, and the agent crashes because the
                    generated code has no rate limit handling.
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-accent-red shrink-0">—</span>
                  <span>
                    you need to add one feature and realize you can't. ai tools
                    generate code — they don't explain the architecture or help
                    you extend it. you're stuck.
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">
                i've fixed all of these. $500 gets you production ai features
                that actually work when users show up.
              </p>
            </div>
          </section>

          {/* Process */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              how it works
            </h2>
            <div className="space-y-0">
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">
                    1
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">
                    15-min call
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    you explain what you're building. i ask questions. we see if
                    it's a fit.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">
                    2
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">
                    scope and quote
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    i send you what i'll build, how long it'll take, and any
                    constraints.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">
                    3
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">
                    i build, you review
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    async updates. you see progress. you can course-correct
                    early.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">
                    handoff
                  </h3>
                  <p className="text-sm text-muted-foreground m-0">
                    you get the code, docs, and a walkthrough. you're not stuck.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">
              common questions
            </h2>
            <div className="space-y-4">
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  what if i need more than 20 hours?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  we continue at $35/hour. most projects need 40-80 hours total
                  for a complete feature. the 20-hour kickstart lets you
                  evaluate my work before committing to more.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  what timezone are you in?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  ist (india). i'm flexible with async communication and can
                  overlap with us/eu hours for calls when needed. most updates
                  happen via slack or github.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  how do i know you won't disappear?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  you get daily async updates, access to the git repo from day
                  one, and docs as i build. if i vanish, you have everything you
                  need to continue without me.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  what's the turnaround time?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  20 hours of work typically spans 1-2 weeks depending on
                  complexity and feedback cycles. urgent projects can be faster
                  — let's discuss on the call.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  do you work with non-technical founders?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  yes. i'll explain technical decisions in plain english and
                  make sure you understand what's being built. you don't need to
                  know how llms work — that's my job.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  what if the project scope changes?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  happens all the time. we'll re-scope and i'll give you a new
                  estimate. no surprises — you approve any additional hours
                  before i start.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  can you work with my existing codebase?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  yes. typescript/javascript is my specialty, but i can work
                  with other languages too — just need a bit more time upfront
                  to understand the codebase properly.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  why $35/hour?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  you're paying for ai expertise, not just code. i contribute to
                  the frameworks i use, debug issues others can't, and ship
                  production-ready features — not prototypes that break. i'm
                  building my consulting practice, so you get senior-level ai
                  work while i build my client base.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  do you offer project-based pricing?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  yes. if you have a well-defined scope, i can quote a fixed
                  price for the whole project. let's discuss what works best for
                  you on the call.
                </p>
              </div>
              <div className="border border-border p-4">
                <h3 className="font-semibold text-sm m-0 mb-2">
                  what's your availability?
                </h3>
                <p className="text-sm text-muted-foreground m-0">
                  i take on 1-2 projects at a time to ensure quality. if i'm
                  fully booked, i'll let you know upfront and can schedule for
                  when i'm free.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-2 border-border p-6 sm:p-8 space-y-4 text-center">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-2">
              ready to add ai to your product?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              15 minutes is enough to know if we're a fit. no sales pitch — just
              a conversation about what you're building and whether i can help.
            </p>
            <p className="text-sm text-muted-foreground">
              worst case: you lose 15 minutes. best case: your ai feature ships
              next month instead of next quarter. and if you're not satisfied
              with my work — full refund, no questions asked.
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
                href={`mailto:${email}?subject=${encodeURIComponent("project inquiry")}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 text-sm font-medium no-underline hover:bg-secondary transition-colors"
              >
                prefer email? reach out
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-2 m-0">
              agencies: i also white-label for client projects.{" "}
              <Link
                href={`mailto:${email}?subject=${encodeURIComponent("agency partnership")}`}
                className="text-accent-red underline hover:opacity-80"
              >
                let's talk
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
