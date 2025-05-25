import {
  Wagon,
  type SimpleDeparture,
  type SimpleJourney,
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

export async function getNextJourneys(
  count: number,
  coordinates: string,
  stopArea: string,
  lineIds: string[],
  platforms?: string[]
): Promise<SimpleJourney[]> {
  const departures: SimpleDeparture[] = [];
  const journeys: SimpleJourney[] = [];

  for (const line of lineIds) {
    departures.push(...(await Wagon.departures(coordinates, line, [stopArea])));
  }

  const journeysPattern = new Map<
    string,
    Omit<SimpleJourney, "userStopDeparture">
  >();
  const journeysPerDestination = new Map<string, Set<string>>();

  for (const departure of departures
    .sort((a, b) => a.leavesAt.diff(b.leavesAt))
    // .filter((x) => platforms?.includes(x.platform || "") || !platforms)
    .slice(0, count)) {
    const journey = await Wagon.journey(
      coordinates,
      departure.id,
      departure.vehicleNumber,
      departure.journeyCode,
      stopArea
    );
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

  const hasNonBusLines = journeys.some((journey) => !journey.line.isOnRoad);

  for (const journey of journeys) {
    journey.metadata.direct = journey.nextStops.length === 2;
    if (journey.userStopDeparture.platform === "unknown") {
      journey.metadata.flag = "OUTSIDE_PLATFORM";
    }
    if (journey.closedStops.size > 0) {
      journey.metadata.flag = "MODIFIED_JOURNEY";
    }
    if (journey.line.isOnRoad && hasNonBusLines) {
      journey.metadata.flag = "REPLACEMENT_BUS";
    }
    // fill the via metadata
    const patterns = journeysPerDestination.get(
      journey.userStopDeparture.destination.name
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
      stopsOfOtherJourneys
    );
  }

  return journeys;
}
