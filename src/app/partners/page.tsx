"use client";

import React from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import Link from 'next/link';
import { ArrowRight, Users, Briefcase, Calculator, Monitor, UserCheck, CheckCircle2 } from 'lucide-react';
import { calendlyUrl, email, twitterUsername } from '@/lib/site-config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />

        <main className="space-y-12 sm:space-y-16 mb-20">
          {/* Hero Section */}
          <section className="py-6 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              you bring clients. i build. you get 30%.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              you already have clients who ask about ai.
              you just don't have an answer for them. now you do.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-accent-red bg-accent-red text-white px-4 py-2.5 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
              >
                let's talk <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`mailto:${email}?subject=${encodeURIComponent('partnership inquiry')}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-4 py-2.5 text-sm font-medium no-underline hover:bg-secondary transition-colors"
              >
                send an email
              </Link>
            </div>
          </section>

          {/* Who This Is For */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">who this is for</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">consultants</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  business, operations, hr, industry-specific.
                  you diagnose problems. i build solutions.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">agencies</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  design, marketing, dev shops.
                  clients ask "can you do ai?" and you say no. stop saying no.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Calculator className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">financial professionals</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  accountants, fractional cfos, bookkeepers.
                  you see every inefficiency in their business. i fix the ones ai can solve.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">tech-adjacent advisors</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  it consultants, crm specialists, no-code experts.
                  you hit the ceiling of what tools can do. i build past it.
                </p>
              </article>

              <article className="border border-border p-4 sm:p-5 space-y-2 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-5 text-accent-red shrink-0" />
                  <h3 className="font-semibold text-base m-0 leading-none">anyone with client relationships</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  lawyers, recruiters, brokers, coaches.
                  if your clients trust you and they have a business, you'll hear about ai eventually.
                </p>
              </article>
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">how it works</h2>
            <div className="space-y-0">
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">1</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">client mentions ai problem</h3>
                  <p className="text-sm text-muted-foreground m-0">they ask about automation, ai, or something manual that's eating their time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">2</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">you intro me</h3>
                  <p className="text-sm text-muted-foreground m-0">email intro, add me to a call, or share my contact. whatever works.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 relative">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5 relative z-10">3</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(2rem+0.5rem)] w-px h-4 bg-border" />
                </div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">i handle everything</h3>
                  <p className="text-sm text-muted-foreground m-0">discovery, scoping, building, delivery. you're not involved unless you want to be.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-accent-red text-white font-bold text-sm mt-0.5">4</div>
                <div>
                  <h3 className="font-semibold text-base m-0 leading-none mb-1">you get paid</h3>
                  <p className="text-sm text-muted-foreground m-0">when the client pays, you get your cut. no chasing invoices.</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 border border-border p-4 mt-6">
              <p className="text-sm text-muted-foreground m-0">
                you don't sell. you don't scope. you don't manage. you just make an introduction.
              </p>
            </div>
          </section>

          {/* What I Build */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">what i build</h2>
            <div className="border border-border p-4 sm:p-5 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent-red shrink-0">-</span>
                  <span>ai agents that handle repetitive work</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent-red shrink-0">-</span>
                  <span>llm integrations into existing systems</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent-red shrink-0">-</span>
                  <span>document processing and extraction</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent-red shrink-0">-</span>
                  <span>knowledge bases and rag systems</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent-red shrink-0">-</span>
                  <span>automation that actually works</span>
                </div>
              </div>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">
                custom builds only. no templates. every solution fits the client's actual problem.
              </p>
            </div>
          </section>

          {/* Your Cut */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">your cut</h2>
            <div className="border-2 border-accent-red p-6 sm:p-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">30%</div>
                  <div className="text-sm text-muted-foreground">of project fees</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">10%</div>
                  <div className="text-sm text-muted-foreground">of retainers (monthly, ongoing)</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold m-0">minimum project size: $3,000</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="m-0">$3k project = $900 to you</p>
                  <p className="m-0">$5k project = $1,500 to you</p>
                  <p className="m-0">$2k/month retainer = $200/month ongoing</p>
                </div>
              </div>
            </div>
          </section>

          {/* What You'd Tell Your Client */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">what you'd tell your client</h2>
            <div className="border-l-4 border-accent-red pl-4 sm:pl-6 py-2 bg-secondary/30">
              <p className="text-sm sm:text-base italic m-0">
                "i know someone who builds custom ai solutions.
                he's independent, ships fast, and his rates are reasonable.
                want me to connect you?"
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              that's it. i handle everything after the intro.
            </p>
          </section>

          {/* Full Transparency */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">full transparency</h2>
            <div className="border border-border p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground m-0">
                i don't have pre-built products to demo.
                every project is custom-built for that client.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground m-0">
                this means harder initial conversations (no shiny demo to show),
                but better outcomes (built for their exact problem).
              </p>
              <p className="text-sm sm:text-base text-muted-foreground m-0">
                <span className="font-semibold text-foreground">the upside:</span> once i build a solution for one client,
                we can replicate it for similar clients. over time, you'll have real products to demo -
                built from actual client work, not hypotheticals.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground m-0">
                i'm new to partnerships. 3+ years writing production software,
                but building this referral network from scratch.
              </p>
              <Separator className="my-2" />
              <p className="text-sm sm:text-base text-muted-foreground m-0">
                <span className="font-semibold text-foreground">public accountability:</span> i have a public presence on{' '}
                <a
                  href={`https://x.com/${twitterUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-red underline"
                >
                  x (twitter)
                </a>
                {' '}and linkedin. if i screw you over, you can call me out publicly.
                i can't afford to burn my reputation. that's your insurance.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">faq</h2>
            <Accordion type="single" collapsible className="border border-border">
              <AccordionItem value="intro" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">how do i introduce you?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  however you want. email intro, add me to a call, share my contact and let them reach out. i'll take it from there.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="invisible" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">can i stay invisible?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  yes. if you want to white-label this (client thinks i'm your team or subcontractor), i'm fine with that. your client relationship, your rules.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">when do i get paid?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  when the client pays in full. not on deposit, not on milestone - only after full payment clears.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="scope" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">what if the project scope grows?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  your commission is based on what you closed. if a $3k project becomes $6k because of scope creep, you still get 30% of $3k ($900), not $6k. the extra work is mine to sell and deliver.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fails" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">what if the project fails?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  if i don't deliver and the client doesn't pay, you don't get paid. i carry that risk. if i deliver but client refuses to pay (rare), we're both out of luck.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contract" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">do i need to sign anything?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  not upfront. we can formalize with a simple agreement once we've done a deal or two. early on, i'd rather move fast than lawyer up.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="exclusivity" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">can i refer to other devs too?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  yes. no exclusivity. refer to whoever you think is best for the client. if they pick someone else, no hard feelings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="busy" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">what if you're too busy?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  i'll tell you immediately and give you a realistic timeline. if it's urgent and i can't help, i won't waste your client's time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="industries" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">what industries do you work with?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  any industry where ai can solve a real problem. legal, healthcare, finance, construction, e-commerce, saas. if i don't know the domain, i'll learn it.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="timeline" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">how long do projects take?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  typical mvp: 2-4 weeks. complex integrations: 4-8 weeks. retainers: monthly cycles. i'll give exact timelines after scoping with the client.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ghost" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">what if the client ghosts after the intro?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  nothing owed. commission is only on closed, paid projects. dead leads are part of the game.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tracking" className="px-4 border-b border-border last:border-b-0">
                <AccordionTrigger className="py-3 cursor-pointer">how do i track what i'm owed?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 pt-0">
                  i'll send you updates when projects close and payments clear. full transparency on what's in pipeline and what's paid.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* The Catches */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-4">the catches</h2>
            <p className="text-sm text-muted-foreground mb-4">
              before you commit, know the downsides:
            </p>
            <div className="space-y-3">
              <CatchItem
                title="no demos"
                description="i don't have ready-made products to show. you're referring clients to a custom dev, not a product. this makes the initial conversation harder."
              />
              <CatchItem
                title="scope creep doesn't pay more"
                description="if the project grows after you intro'd it, your commission stays based on the original scope. the upside is mine, not yours."
              />
              <CatchItem
                title="payment on completion only"
                description="you don't get paid until the client pays in full. if a project drags out, so does your commission."
              />
              <CatchItem
                title="i'm new to this"
                description="no track record of paying partners yet. you're trusting that i'll honor the deal. all i can offer is my word and public accountability."
              />
              <CatchItem
                title="i might be at capacity"
                description="if i'm slammed, i might not be able to take your referral. i'll always be upfront about timelines."
              />
              <CatchItem
                title="custom work = longer sales cycles"
                description="no 'click here to buy' moment. clients need to talk, scope, and decide. some will drop off. that's normal."
              />
              <CatchItem
                title="no formal contract initially"
                description="we'll work on trust first. if that bothers you, we can formalize upfront - but it'll slow things down."
              />
            </div>
            <div className="bg-secondary/30 border border-border p-4 mt-4">
              <p className="text-sm text-muted-foreground m-0">
                if these are dealbreakers, no hard feelings. this partnership isn't for everyone.
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-2 border-border p-6 sm:p-8 space-y-4 text-center">
            <h2 className="text-lg sm:text-xl font-bold mt-0 mb-2">still interested?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              no pitch. just a conversation about whether this makes sense for both of us.
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
                href={`mailto:${email}?subject=${encodeURIComponent('partnership inquiry')}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 text-sm font-medium no-underline hover:bg-secondary transition-colors"
              >
                prefer email? reach out
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const CatchItem = ({ title, description }: { title: string; description: string }) => (
  <div className="border border-border p-4 flex items-start gap-3">
    <CheckCircle2 className="size-4 text-accent-red shrink-0 mt-0.5" />
    <div>
      <h3 className="font-semibold text-sm m-0 mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground m-0">{description}</p>
    </div>
  </div>
);

export default PartnersPage;
