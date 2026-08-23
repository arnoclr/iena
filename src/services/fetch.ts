import {
  Wagon,
  type SimpleDeparture,
  type SimpleJourney,
  type SimpleNotification,
  type SimpleStop,
} from "./Wagon";

function getUniqueJourneyKey(stops: SimpleStop[]): string {
  return stops
    .map((stop) => stop.id)
    .sort()
    .join("-");
}

function getFirstUniqueElement<T>(of: Set<T>, notIn: Set<T>): T | undefined {
  for (const element of of) {
    if (!notIn.has(element)) {
      return element;
    }
  }
  return undefined;
}

export function getLastNotificationPerThread(
  notifications: SimpleNotification[],
): SimpleNotification[] {
  const latestByThread = new Map<string, SimpleNotification>();
  for (const notification of notifications) {
    if (!notification.threadId || !notification.contentFR) {
      continue;
    }
    const existing = latestByThread.get(notification.threadId);
    if (
      !existing ||
      (notification.publishedAt &&
        (!existing.publishedAt ||
          notification.publishedAt.isAfter(existing.publishedAt)))
    ) {
      latestByThread.set(notification.threadId, notification);
    }
  }
  return Array.from(latestByThread.values());
}

export async function getNextJourneys(
  count: number,
  coordinates: string,
  stopArea: string,
  lineIds: string[],
  /** @ts-ignore */
  platforms?: string[],
  direction?: "0" | "1",
): Promise<{
  journeys: SimpleJourney[];
  notifications: SimpleNotification[];
}> {
  const departures: SimpleDeparture[] = [];
  const journeys: SimpleJourney[] = [];
  const notifications: SimpleNotification[] = [];

  for (const line of lineIds) {
    const { departures: lineDepartures, notifications: lineNotifications } =
      await Wagon.departures(coordinates, line, [stopArea]);
    departures.push(...lineDepartures);
    notifications.push(...lineNotifications);
  }

  const journeysPattern = new Map<
    string,
    Omit<SimpleJourney, "userStopDeparture">
  >();
  const journeysPerDestination = new Map<string, Set<string>>();

  for (const departure of departures
    .sort((a, b) => a.leavesAt.diff(b.leavesAt))
    .filter((departure) => !direction || departure.branchHash === direction)
    // .filter((x) => platforms?.includes(x.platform || "") || !platforms)
    .slice(0, count)) {
    const journey = await Wagon.journey(
      coordinates,
      departure.id,
      departure.vehicleNumber,
      departure.journeyCode,
      stopArea,
    );
    if (departure.destination.name === "(?)" && journey.stops.length > 0) {
      departure.destination.name = journey.stops.at(-1)?.name ?? "";
    }
    journeys.push({
      userStopDeparture: departure,
      ...journey,
    });
    // count the number of journeys per destination
    const journeyPattern = getUniqueJourneyKey(journey.nextStops);
    if (!journeysPerDestination.has(departure.destination.name)) {
      journeysPerDestination.set(departure.destination.name, new Set());
    }
    journeysPerDestination.get(departure.destination.name)?.add(journeyPattern);
    journeysPattern.set(journeyPattern, journey);
  }

  for (const journey of journeys) {
    journey.metadata.direct = journey.nextStops.length === 2;
    if (journey.userStopDeparture.platform === "unknown") {
      journey.metadata.flag = "OUTSIDE_PLATFORM";
    }
    if ((journey.userStopDeparture.platform?.length || 0) > 3) {
      journey.userStopDeparture.platform = undefined;
    }
    if (journey.nextStops.some((stop) => journey.closedStops.has(stop.id))) {
      journey.metadata.flag = "MODIFIED_JOURNEY";
    }
    const isReplacementBusName =
      /^[A-Z]$/.test(journey.line.number) ||
      /^T[0-9]{1,2}$/.test(journey.line.number) ||
      journey.line.number.startsWith("BUS");
    if (
      journey.line.isOnRoad &&
      isReplacementBusName &&
      journey.line.id.includes("IDFM:")
    ) {
      journey.metadata.flag = "REPLACEMENT_BUS";
    }
    // fill the via metadata
    const patterns = journeysPerDestination.get(
      journey.userStopDeparture.destination.name,
    );
    if (patterns?.size === 1) {
      continue;
    }
    const stopsOfOtherJourneys = new Set<string>();
    for (const pattern of patterns ?? []) {
      if (pattern === getUniqueJourneyKey(journey.nextStops)) {
        continue;
      }
      const otherJourney = journeysPattern.get(pattern);
      if (otherJourney) {
        for (const stop of otherJourney.nextStops) {
          stopsOfOtherJourneys.add(stop.name);
        }
      }
    }
    journey.metadata.via = getFirstUniqueElement(
      new Set(journey.nextStops.map((stop) => stop.name)),
      stopsOfOtherJourneys,
    );
  }

  return {
    journeys,
    notifications: getLastNotificationPerThread(notifications),
  };
}
