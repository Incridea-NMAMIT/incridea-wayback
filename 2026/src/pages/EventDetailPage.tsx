import { useEffect, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineArrowLeft, AiOutlinePhone } from "react-icons/ai";

import mocoSansFont from "../assets/mocoSans-BoldItalic.ttf";
import mocoSansBoldFont from "../assets/mocoSans-Bold.ttf";
import mocoSansRegularFont from "../assets/mocoSans-Regular.ttf";
import mocoSansRegularItalicFont from "../assets/mocoSans-RegularItalic.ttf";
import outfitRegularFont from "../assets/Outfit-Regular.ttf";
import { useAuth } from "../hooks/useAuth";

import {
  fetchPublishedEvent,
  type PublicEventDetail,
  type PublicEventType,
  type PublishedEventResponse,
} from "../api/public";
import { showToast } from "../utils/toast";
import EventRegistration from "../components/events/EventRegistration";
import EventDetails from "../components/events/EventDetails";
import { formatDateWithTime, formatDate, formatTime } from "../utils/date";
import LiquidGlassCard from "../components/liquidglass/LiquidGlassCard";
import SEO from "../components/SEO";
import LazyImage from "../components/LazyImage";
import { isArchiveMode } from "../archive/archive";

function parseIdFromSlug(slug: string | undefined) {
  if (!slug) {
    return null;
  }
  const parts = slug.split("-");
  const maybeId = parts[parts.length - 1];
  const id = Number(maybeId);
  return Number.isFinite(id) ? id : null;
}

function formatTeamSize(min: number, max: number) {
  if (min === max) {
    if (min === 1) {
      return "Solo";
    }
    if (min === 0) {
      return "Open";
    }
    return `${min} per team`;
  }
  return `${min}-${max} per team`;
}

function formatEventType(eventType: PublicEventType) {
  if (eventType.includes("MULTIPLE")) {
    return "Multi-entry";
  }
  return eventType.toLowerCase().startsWith("team") ? "Team" : "Individual";
}

function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const eventId = useMemo(() => parseIdFromSlug(slug), [slug]);
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery<
    PublishedEventResponse,
    Error
  >({
    queryKey: ["public-event", eventId],
    queryFn: () => {
      return fetchPublishedEvent(eventId ?? 0);
    },
    enabled: eventId !== null,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load event";
      showToast(message, "error");
    }
  }, [error]);

  if (eventId === null || (isError && !isLoading)) {
    return (
      <section className="space-y-4 max-w-5xl mx-auto p-4">
        <RouterLink
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200 transition-colors"
        >
          <AiOutlineArrowLeft /> Back to events
        </RouterLink>
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-6 text-red-200">
          <h2 className="text-xl sm:text-lg mb-2 font-moco font-bold">Event Not Found</h2>
          <p className="font-moco">
            We couldn't find the event you're looking for. It might have been
            removed or the link is incorrect.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading || !data) {
    return (
      <section className="space-y-4 max-w-5xl mx-auto p-4">
        <div className="h-8 w-32 animate-pulse rounded-md bg-slate-800"></div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 h-64 animate-pulse"></div>
      </section>
    );
  }

  const event: PublicEventDetail = data.event;
  const isRegistrationFull = event.maxTeams ? (event.registeredCount ?? 0) >= event.maxTeams : false;

  const confirmedSchedules = (event.Schedule?.filter(s => s.scheduleStatus !== 'Cancelled') || []).sort((a, b) => {
    if (!a.startTime || !b.startTime) return 0;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  const hasMultipleRounds = (event.rounds?.length || 0) > 1 || confirmedSchedules.length > 1;

  return (
    <>
      <SEO
        title={event.name}
        description={event.description?.substring(0, 150) + "..."}
        image={event.image ?? undefined}
        url={`/events/${slug}`}
      />
      <div
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <section className="relative min-h-screen w-full overflow-x-hidden">
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Macondo&family=Macondo+Swash+Caps&family=New+Rocker&display=swap');
          @font-face {
            font-family: 'MocoSans';
            src: url('${mocoSansFont}') format('truetype');
            font-weight: bold;
            font-style: italic;
          }
          @font-face {
            font-family: 'MocoSansBold';
            src: url('${mocoSansBoldFont}') format('truetype');
            font-weight: bold;
          }
          @font-face {
            font-family: 'MocoSansRegular';
            src: url('${mocoSansRegularFont}') format('truetype');
            font-weight: normal;
          }
          @font-face {
            font-family: 'MocoSansRegularItalic';
            src: url('${mocoSansRegularItalicFont}') format('truetype');
            font-weight: normal;
            font-style: italic;
          }
          @font-face {
            font-family: 'OutfitRegular';
            src: url('${outfitRegularFont}') format('truetype');
            font-weight: normal;
          }
          .category-font {
            font-family: 'MocoSansRegularItalic', cursive;
          }
          @keyframes glassShimmer {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.5;
            }
            90% {
              opacity: 0.3;
            }
            100% {
              transform: translateX(120%);
              opacity: 0;
            }
          }
          .wave-container {
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35), 
                        0 2px 8px rgba(0, 0, 0, 0.15),
                        inset 0 1px 2px rgba(255, 255, 255, 0.15),
                        inset 0 0px 16px rgba(255, 255, 255, 0.08);
            border-radius: 30px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.04) 100%);
          }
          .wave-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 18%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 100%);
            pointer-events: none;
            z-index: 5;
          }
          .wave-container::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            right: -50%;
            bottom: -50%;
            background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
            animation: glassShimmer 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 2;
          }`}
        </style>

        <div className="relative mx-auto w-full md:w-full lg:w-[92%] xl:w-full max-w-[1000px] xl:max-w-6xl px-1 md:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <RouterLink
            to="/events"
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.25)] transition-all duration-300 cursor-target"
            title="Back to events"
          >
            <AiOutlineArrowLeft className="text-sky-300 text-lg sm:text-xl hover:text-sky-200" />
          </RouterLink>

          {/* GLASS CONTAINER: Event Header + Description + Coordinators */}

          {/* Event Header Section */}

          <LiquidGlassCard className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,300px)_1fr] lg:grid-cols-[minmax(280px,340px)_1fr] gap-3 sm:gap-4  lg:gap-6 p-0 sm:p-2 lg:p-4 border-b border-white/10">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl max-w-full">
                <div
                  className="relative aspect-4/5 w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {event.image ? (
                    <LazyImage
                      src={event.image}
                      alt={event.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      containerClassName="absolute inset-0 h-full w-full"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black flex items-center justify-center text-black/40">
                      <div className="text-center text-sm">
                        <div className="font-semibold"></div>
                        <div></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between h-full px-4 py-10 md:p-0 md:pl-8 lg:pl-10">
                <div>
                  <div className="inline-block py-2 rounded-2xl md:mb-3">
                    <p className="category-font text-sm sm:text-sm lg:text-base uppercase tracking-wider text-yellow-400">
                      {event.category?.replaceAll("_", " ")}
                    </p>
                  </div>
                  <h1
                    className="mt-2 sm:mt-2 text-4xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
                    style={{ fontFamily: "'MocoSansBold', cursive" }}
                  >
                    {event.name}
                  </h1>
                </div>

                <div className={`grid ${hasMultipleRounds ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'} gap-x-5 sm:gap-x-6 gap-y-4 sm:gap-y-6`}>
                  <div className={hasMultipleRounds ? "col-span-2" : ""}>
                    <InfoPill
                      label="Tier"
                      value={event.tier}
                    />
                  </div>
                  <InfoPill
                    label="Prize Pool"
                    value={(event.prizePool !== undefined && event.prizePool > 0) ? `₹${event.prizePool}` : "TBD"}
                  />
                  <InfoPill
                    label="Event Type"
                    value={formatEventType(event.eventType)}
                  />
                  {!hasMultipleRounds && (
                    <>
                      <InfoPill
                        label="Starts"
                        value={
                          event.Schedule?.[0]?.startTime
                            ? formatDateWithTime(event.Schedule[0].startTime)
                            : "TBD"
                        }
                      />
                      <InfoPill
                        label="Ends"
                        value={
                          event.Schedule?.[0]?.endTime
                            ? formatDateWithTime(event.Schedule[0].endTime)
                            : "TBD"
                        }
                      />
                    </>
                  )}

                  <InfoPill
                    label="Team Size"
                    value={formatTeamSize(event.minTeamSize, event.maxTeamSize)}
                  />
                  {!hasMultipleRounds && (
                    <div className="col-span-2 lg:col-span-3">
                      <InfoPill
                        label="Venue"
                        value={
                          event.Schedule?.[0]?.venues &&
                            event.Schedule[0].venues.length > 0
                            ? event.Schedule[0].venues.map((v) => v.name).join(", ")
                            : event.venue ?? "TBA"
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="pt-1 sm:pt-2">
                  {!isArchiveMode && user?.category !== 'SERVICE' && (
                    <EventRegistration
                      eventId={event.id}
                      type={event.eventType}
                      minTeamSize={event.minTeamSize}
                      maxTeamSize={event.maxTeamSize}
                      isRegistrationFull={isRegistrationFull}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="px-2 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-12 space-y-8 sm:space-y-12 lg:space-y-16">
              {(() => {
                if (!hasMultipleRounds || confirmedSchedules.length === 0) {
                  return null;
                }

                return (
                  <>
                    <div className="space-y-3 sm:space-y-8">
                      <div className="flex items-center justify-center gap-4">
                        <h2
                          className="text-base sm:text-2xl font-bold text-white text-center leading-tight"
                          style={{ fontFamily: "'MocoSansRegular', cursive" }}
                        >
                          Rounds
                        </h2>
                      </div>
                      <div className="w-full space-y-1">
                        {confirmedSchedules.map((schedule, index) => {
                          const venueName = schedule?.venues?.[0]?.name ?? schedule?.venue ?? event.venue;

                          return (
                            <div
                              key={index}
                              className="flex gap-4 sm:gap-10 py-6 border-b border-white/5 last:border-0"
                            >
                              {/* Round Side Indicator */}
                              <div className="flex flex-col items-center pt-1 min-w-[45px] sm:min-w-[60px] border-r border-white/10 pr-4 sm:pr-8">
                                <span className="text-2xl sm:text-4xl font-bold text-amber-500/80" style={{ fontFamily: "'MocoSans', cursive" }}>
                                  {index + 1}
                                </span>
                                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Round</span>
                              </div>

                              {/* Content Grid */}
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-8">
                                {/* Date & Time */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Schedule</span>
                                  <div className="flex flex-col">
                                    <span className="text-base sm:text-lg font-semibold text-white/95">
                                      {schedule.startTime ? formatDate(schedule.startTime) : "TBA"}
                                    </span>
                                    <div className="flex flex-wrap gap-x-2 text-sm text-slate-400 mt-0.5 font-medium">
                                      <span>{schedule.startTime && formatTime(schedule.startTime)}</span>
                                      {schedule.startTime && schedule.endTime && <span>-</span>}
                                      <span>{schedule.endTime && formatTime(schedule.endTime)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Venue */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Location</span>
                                  <span className="text-base sm:text-lg font-semibold text-white/95 leading-tight">
                                    {venueName ? venueName : "TBA"}
                                  </span>
                                </div>

                                {/* Info */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Details</span>
                                  <span className="text-base sm:text-lg font-semibold text-white/95 leading-tight">
                                    {schedule.info || "No additional info"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
                  </>
                );
              })()}

              <div className="space-y-3 sm:space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <h2
                    className="text-2xl sm:text-2xl font-bold text-white text-center leading-tight"
                    style={{ fontFamily: "'MocoSansRegular', cursive" }}
                  >
                    Description
                  </h2>
                </div>

                <div
                  className="w-full text-left"
                >
                  <EventDetails details={event.description ?? ""} />
                </div>
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />


              <div className="space-y-3 sm:space-y-8">
                <div className="flex items-center justify-center gap-4">
                  <h2
                    className="text-2xl sm:text-2xl font-bold text-white text-center leading-tight"
                    style={{ fontFamily: "'MocoSansRegular', cursive" }}
                  >
                    Event Coordinators
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-8 max-w-2xl mx-auto">
                  {event.organisers.map((organiser, index) => (
                    <div
                      key={index}
                      className="space-y-1.5 sm:space-y-3 p-2 sm:p-4 rounded-xl border border-white/15 bg-black/40 backdrop-blur-sm hover:border-[#3bc4ba]/40 hover:shadow-[0_0_20px_rgba(59,196,186,0.15)] transition-all duration-300 w-full sm:w-[calc(50%-1rem)] max-w-sm"
                      style={{ fontFamily: "'OutfitRegular', sans-serif" }}
                    >
                      <p className="text-sm sm:text-lg font-semibold text-white">
                        {organiser.name}
                      </p>
                      {organiser.phoneNumber && (
                        <a
                          href={`tel:${organiser.phoneNumber}`}
                          className="flex items-center gap-2 text-[10px] sm:text-sm text-white/80 transition-colors duration-200 group font-moco"
                        >
                          <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-purple-500/30 rounded group-hover:bg-purple-500/50 transition-colors">
                            <AiOutlinePhone className="text-purple-400 text-sm rotate-90" />
                          </span>
                          <span className="transition-colors duration-200">{organiser.phoneNumber}</span>
                        </a>
                      )}
                    </div>
                  ))}
                  {event.organisers.length === 0 && (
                    <div className="w-full text-center text-slate-400 font-moco">
                      No coordinators listed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </section>
    </>
  );
}
function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontFamily: "'OutfitRegular', sans-serif" }}>
      <div className="text-xs sm:text-base text-white/75">{label}</div>
      <div className="mt-1 text-sm sm:text-xl font-semibold text-white/95 whitespace-nowrap">
        {value}
      </div>
    </div>
  );
}

export default EventDetailPage;
