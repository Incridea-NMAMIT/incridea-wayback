import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineSearch } from "react-icons/ai";
import { ChevronDown } from "lucide-react";
import { FiBookOpen } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import {
  type PublicEvent,
  type PublicEventCategory,
  fetchPublishedEvents,
} from "../api/public";
import EventPreviewCard from "../components/events/EventCard";
import LiquidGlassCard from "../components/liquidglass/LiquidGlassCard";
import SEO from "../components/SEO";

const CATEGORY_FILTERS: (PublicEventCategory | "ALL")[] = [
  "ALL",
  "TECHNICAL",
  "NON_TECHNICAL",
  "CORE",
  "SPECIAL",
];

const DAY_FILTERS = [
  { label: "DAY 1", key: "day1", dateString: "2026-03-06" },
  { label: "DAY 2", key: "day2", dateString: "2026-03-07" },
  { label: "DAY 3", key: "day3", dateString: "2026-03-08" }
] as const;

type DayFilterLabel = (typeof DAY_FILTERS)[number]["label"] | "ALL";


function toSlug(event: PublicEvent) {
  const base = event.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${event.id}`;
}

function EventsPage() {
  const [categoryFilter, setCategoryFilter] = useState<
    PublicEventCategory | "ALL"
  >("ALL");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dayFilter, setDayFilter] = useState<DayFilterLabel>("ALL");
  const [dayOpen, setDayOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
        setDayOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["published-events"],
    queryFn: fetchPublishedEvents,
  });

  const events = data?.events || [];

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const searchTerm = query.trim().toLowerCase();

    return events
      .filter((event) => {
        const matchesQuery = event.name.toLowerCase().includes(searchTerm);
        if (!matchesQuery) return false;
        const matchesCategory =
          categoryFilter === "ALL" || event.category === categoryFilter;
        if (!matchesCategory) return false;
        if (dayFilter === "ALL") return true;

        const selectedDay = DAY_FILTERS.find((d) => d.label === dayFilter);
        if (!selectedDay) return true;
        return event.Schedule?.some((schedule) => {
          if (!schedule.startTime) return false;
          return schedule.startTime.startsWith(selectedDay.dateString);
        });
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [events, categoryFilter, query, dayFilter]);

  if (isLoading) {
    return (
      <div className="min-h-dvh pt-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="space-y-4 flex flex-col items-center">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-white/10 rounded animate-pulse" />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:justify-center">
            <div className="h-10 w-full lg:w-96 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-white/5 rounded-xl animate-pulse border border-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-dvh text-red-500">
        Error loading events. Please try again later.
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Events - Techno-Cultural Fest"
        description="Discover 40+ exciting technical and cultural events at Incridea 2026, NMAMIT Nitte's premier national-level fest. Register to compete and win amazing prizes."
        url="/events"
      />

      <section className="relative isolate space-y-8 max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <LiquidGlassCard className="h-full w-full !p-0 !rounded-9" />
        </div>
        <div className="relative z-10 space-y-8">
          <header className="space-y-2 text-center flex flex-col items-center">
            <p className="text-sky-400 uppercase ttext-[11px] sm:text-[10px] tracking-[0.2em] font-bold font-moco">
              Discover
            </p>
            <h1 className="text-5xl sm:text-4xl font-moco font-bold text-white tracking-tight drop-shadow-md">
              Events
            </h1>
            <p className="text-white text-base sm:text-sm max-w-2xl font-moco mx-auto drop-shadow-sm">
              Explore the upcoming challenges. Filter by category or day to find
              your perfect match.
            </p>
            <a
              href="https://9ec732lutu.ufs.sh/f/aVR2JOdkpmeKJk08vMK18JTxpAImc3tzOLRfqsZHurSbkMDB"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all group mt-2"
            >
              <FiBookOpen className="text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm tracking-wide">Rule book</span>
            </a>
          </header>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-8">
            <div className="relative w-full lg:max-w-md">
              <AiOutlineSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
                size={18}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-white/40 rounded-xl py-2.5 pl-10 pr-4 text-base sm:text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all"
                placeholder="Search events..."
              />
            </div>

            <div className="flex flex-wrap gap-2" ref={filtersRef}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => {
                      setDayOpen(false);
                      setCategoryOpen(!categoryOpen);
                    }}
                    className="flex items-center justify-between gap-2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all min-w-[140px] text-outfit "
                  >
                    {categoryFilter === "ALL"
                      ? "ALL CATEGORIES"
                      : categoryFilter.replace("_", " ")}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {categoryOpen && (
                    <div className="absolute top-full right-0 mt-2 z-50 min-w-[150px]">
                      <LiquidGlassCard className="!p-1 !rounded-lg overflow-hidden">
                        <div className="flex flex-col gap-1">
                          {CATEGORY_FILTERS.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setCategoryFilter(category);
                                setCategoryOpen(false);
                              }}
                              className={`text-left px-3 py-2 text-base sm:text-sm text-outfit rounded-md transition-colors ${categoryFilter === category
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                              {category === "ALL"
                                ? "ALL CATEGORIES"
                                : category.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </LiquidGlassCard>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => {
                      setCategoryOpen(false);
                      setDayOpen(!dayOpen);
                    }}
                    className="flex items-center justify-between gap-2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all min-w-[140px] text-outfit"
                  >
                    {dayFilter === "ALL" ? "ALL DAYS" : dayFilter}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${dayOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dayOpen && (
                    <div className="absolute top-full right-0 mt-2 z-50 min-w-[150px]">
                      <LiquidGlassCard className="!p-1 !rounded-lg overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setDayFilter("ALL");
                              setDayOpen(false);
                            }}
                            className={`text-left px-3 py-2 text-base sm:text-sm text-outfit rounded-md transition-colors ${dayFilter === "ALL"
                              ? "bg-white/20 text-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            ALL DAYS
                          </button>
                          {DAY_FILTERS.map((day) => (
                            <button
                              key={day.key}
                              onClick={() => {
                                setDayFilter(day.label);
                                setDayOpen(false);
                              }}
                              className={`text-left px-3 py-2 text-base sm:text-sm text-outfit rounded-md transition-colors ${dayFilter === day.label
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </LiquidGlassCard>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center">
          {filteredEvents.map((event, index) => (
            <RouterLink
              key={event.id}
              to={`/events/${toSlug(event)}`}
              className="w-full flex justify-center"
            >
              <EventPreviewCard event={event} index={index} />
            </RouterLink>
          ))}
        </div>
      </section>
    </>
  );
}

export default EventsPage;
