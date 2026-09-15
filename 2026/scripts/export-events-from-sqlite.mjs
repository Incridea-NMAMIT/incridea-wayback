import { DatabaseSync } from "node:sqlite";
import { mkdir, writeFile } from "node:fs/promises";

const databasePath = new URL("../../archive-data/events.sqlite", import.meta.url);
const outputPath = new URL("../src/archive/generated-events.json", import.meta.url);

const db = new DatabaseSync(databasePath, { readOnly: true });
try {
  const events = db
    .prepare(
      `SELECT id, name, description, image, venue, min_team_size, max_team_size,
              max_teams, event_type, category, tier, prize_pool, is_started
       FROM events ORDER BY name COLLATE NOCASE`,
    )
    .all();
  const schedules = db
    .prepare(
      `SELECT event_id, venue, venues_json, day, start_time, end_time, info, schedule_status
       FROM event_schedules ORDER BY event_id, start_time`,
    )
    .all();
  const rounds = db
    .prepare(
      `SELECT event_id, round_no, date, is_completed
       FROM event_rounds ORDER BY event_id, round_no`,
    )
    .all();
  const organisers = db
    .prepare(
      `SELECT event_id, name FROM event_organisers ORDER BY event_id, name COLLATE NOCASE`,
    )
    .all();

  const byEvent = (rows) =>
    rows.reduce((map, row) => {
      const items = map.get(row.event_id) ?? [];
      items.push(row);
      map.set(row.event_id, items);
      return map;
    }, new Map());
  const schedulesByEvent = byEvent(schedules);
  const roundsByEvent = byEvent(rounds);
  const organisersByEvent = byEvent(organisers);

  const catalog = events.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    image: event.image,
    venue: event.venue,
    minTeamSize: event.min_team_size,
    maxTeamSize: event.max_team_size,
    maxTeams: event.max_teams,
    eventType: event.event_type,
    category: event.category,
    tier: event.tier,
    prizePool: event.prize_pool,
    isStarted: Boolean(event.is_started),
    day: [],
    Schedule: (schedulesByEvent.get(event.id) ?? []).map((schedule) => ({
      venue: schedule.venue,
      venues: JSON.parse(schedule.venues_json),
      day: schedule.day,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      info: schedule.info,
      scheduleStatus: schedule.schedule_status,
    })),
    rounds: (roundsByEvent.get(event.id) ?? []).map((round) => ({
      roundNo: round.round_no,
      date: round.date,
      isCompleted: Boolean(round.is_completed),
    })),
    organisers: (organisersByEvent.get(event.id) ?? []).map((organiser) => ({
      name: organiser.name,
    })),
  }));

  await mkdir(new URL("../src/archive/", import.meta.url), { recursive: true });
  await writeFile(outputPath, JSON.stringify(catalog, null, 2) + "\n");
  console.log("Generated " + catalog.length + " Wayback events from " + databasePath.pathname);
} finally {
  db.close();
}
