"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FileText,
  Sparkles,
  Database,
  Mail,
  MessageSquare,
  CalendarCheck,
  BellRing,
  CreditCard,
  ClipboardList,
  FolderPlus,
  ListChecks,
  Send,
  Info,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AutomationFlow, { type FlowStep } from "@/components/ui/AutomationFlow";

type TabKey = "lead" | "chatbot" | "crm" | "onboarding";

export default function AIShowcase() {
  const { t } = useLang();
  const [tab, setTab] = useState<TabKey>("lead");
  const tabs: TabKey[] = ["lead", "chatbot", "crm", "onboarding"];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.indexOf(tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setTab(tabs[(idx + 1) % tabs.length] as TabKey);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setTab(tabs[(idx - 1 + tabs.length) % tabs.length] as TabKey);
    }
  };

  return (
    <section id={SECTION_IDS.aiAutomation} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.aiAutomation.eyebrow}
          title={t.sections.aiAutomation.title}
          description={t.sections.aiAutomation.description}
        />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label={t.sections.aiAutomation.title}
          onKeyDown={onKeyDown}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2"
        >
          {tabs.map((key) => {
            const selected = tab === key;
            return (
              <button
                key={key}
                role="tab"
                id={`aidemo-tab-${key}`}
                aria-selected={selected}
                aria-controls={`aidemo-panel-${key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(key)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "bg-gradient-to-r from-vx-blue to-vx-cyan text-vx-bg"
                    : "border border-[rgba(14,165,233,0.2)] text-vx-muted hover:text-vx-ink",
                ].join(" ")}
              >
                {t.aiShowcase.tabs[key]}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="mx-auto mt-8 max-w-4xl">
          <div
            role="tabpanel"
            id={`aidemo-panel-${tab}`}
            aria-labelledby={`aidemo-tab-${tab}`}
            className="rounded-2xl border border-[rgba(14,165,233,0.16)] bg-vx-bg2/60 p-6 sm:p-8"
          >
            {tab === "lead" ? <LeadDemo /> : null}
            {tab === "chatbot" ? <ChatbotDemo /> : null}
            {tab === "crm" ? <CrmDemo /> : null}
            {tab === "onboarding" ? <OnboardingDemo /> : null}
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs text-vx-muted">
            <Info size={14} className="mt-0.5 shrink-0 text-vx-silver-dim" aria-hidden />
            {t.aiShowcase.disclaimer}
          </p>
        </div>
      </Container>
    </section>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-center text-sm text-vx-muted">{children}</p>;
}

function LeadDemo() {
  const { t } = useLang();
  const s = t.aiShowcase.lead.steps;
  const steps: FlowStep[] = [
    { id: "form", label: s.form, icon: <FileText size={16} aria-hidden /> },
    { id: "scored", label: s.scored, icon: <Sparkles size={16} aria-hidden /> },
    { id: "crm", label: s.crm, icon: <Database size={16} aria-hidden /> },
    { id: "email", label: s.email, icon: <Mail size={16} aria-hidden /> },
    { id: "sms", label: s.sms, icon: <MessageSquare size={16} aria-hidden /> },
    { id: "appointment", label: s.appointment, icon: <CalendarCheck size={16} aria-hidden /> },
    { id: "notify", label: s.notify, icon: <BellRing size={16} aria-hidden /> },
  ];
  return (
    <>
      <AutomationFlow steps={steps} orientation="vertical" className="sm:mx-auto sm:max-w-md" />
      <Caption>{t.aiShowcase.lead.caption}</Caption>
    </>
  );
}

function OnboardingDemo() {
  const { t } = useLang();
  const s = t.aiShowcase.onboarding.steps;
  const steps: FlowStep[] = [
    { id: "payment", label: s.payment, icon: <CreditCard size={16} aria-hidden /> },
    { id: "intake", label: s.intake, icon: <ClipboardList size={16} aria-hidden /> },
    { id: "documents", label: s.documents, icon: <FileText size={16} aria-hidden /> },
    { id: "project", label: s.project, icon: <FolderPlus size={16} aria-hidden /> },
    { id: "tasks", label: s.tasks, icon: <ListChecks size={16} aria-hidden /> },
    { id: "update", label: s.update, icon: <Send size={16} aria-hidden /> },
  ];
  return (
    <>
      <AutomationFlow steps={steps} orientation="vertical" className="sm:mx-auto sm:max-w-md" />
      <Caption>{t.aiShowcase.onboarding.caption}</Caption>
    </>
  );
}

function ChatbotDemo() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const c = t.aiShowcase.chatbot;
  const script: { from: "visitor" | "assistant"; text: string }[] = [
    { from: "visitor", text: c.messages.visitor1 },
    { from: "assistant", text: c.messages.assistant1 },
    { from: "assistant", text: c.messages.assistant2 },
  ];

  const [shown, setShown] = useState(reduce ? script.length : 0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (reduce || !started || shown >= script.length) return;
    const timer = window.setTimeout(() => setShown((n) => n + 1), 900);
    return () => window.clearTimeout(timer);
  }, [started, shown, reduce, script.length]);

  return (
    <div ref={ref} className="mx-auto flex max-w-md flex-col gap-3">
      {script.slice(0, shown).map((msg, i) => {
        const isVisitor = msg.from === "visitor";
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={isVisitor ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={[
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                isVisitor
                  ? "rounded-br-sm bg-gradient-to-r from-vx-blue to-vx-cyan text-vx-bg"
                  : "rounded-bl-sm border border-[rgba(14,165,233,0.18)] bg-vx-bg3 text-vx-ink",
              ].join(" ")}
            >
              <span className="mb-0.5 block font-mono text-[0.6rem] uppercase tracking-wide opacity-70">
                {isVisitor ? c.visitorLabel : c.assistantLabel}
              </span>
              {msg.text}
            </div>
          </motion.div>
        );
      })}
      {!reduce && started && shown < script.length ? (
        <div className="flex justify-start" aria-hidden>
          <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-[rgba(14,165,233,0.18)] bg-vx-bg3 px-4 py-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vx-muted" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vx-muted [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vx-muted [animation-delay:300ms]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CrmDemo() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const cols = t.aiShowcase.crm.columns;
  const rec = t.aiShowcase.crm.records;

  type ColKey = "new" | "contacted" | "proposal" | "won";
  const columnOrder: ColKey[] = ["new", "contacted", "proposal", "won"];

  // "restaurant" starts in New Lead, then advances to Contacted once in view.
  const [restaurantCol, setRestaurantCol] = useState<ColKey>(reduce ? "contacted" : "new");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          const timer = window.setTimeout(() => setRestaurantCol("contacted"), 1200);
          return () => window.clearTimeout(timer);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  const records: { id: string; label: string; col: ColKey }[] = [
    { id: "restaurant", label: rec.restaurant, col: restaurantCol },
    { id: "home", label: rec.home, col: "new" },
    { id: "legal", label: rec.legal, col: "proposal" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {columnOrder.map((col) => (
        <div key={col} className="rounded-xl border border-[rgba(14,165,233,0.12)] bg-vx-bg p-3">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={[
                "h-2 w-2 rounded-full",
                col === "new" ? "bg-vx-blue" : col === "won" ? "bg-vx-cyan" : "bg-vx-silver-dim",
              ].join(" ")}
              aria-hidden
            />
            <span className="font-mono text-[0.65rem] uppercase tracking-wide text-vx-muted">
              {cols[col]}
            </span>
          </div>
          <div className="flex min-h-[3rem] flex-col gap-2">
            {records
              .filter((r) => r.col === col)
              .map((r) => (
                <motion.div
                  key={r.id}
                  layout={!reduce}
                  layoutId={reduce ? undefined : `crm-${r.id}`}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="rounded-lg border border-[rgba(14,165,233,0.18)] bg-vx-bg3 px-3 py-2 text-xs text-vx-ink"
                >
                  {r.label}
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
