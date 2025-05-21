import { Wagon, type SimpleJourney, type SimpleStop } from "./Wagon";

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
  stopArea: string,
  lineIds: string[]
): Promise<SimpleJourney[]> {
  // TODO: faire plusieurs fetchs pour chacune des lignes
  const departures = await Wagon.departures(lineIds[0], [stopArea]);
  const journeys: SimpleJourney[] = [];

  const journeysPattern = new Map<
    string,
    Omit<SimpleJourney, "userStopDeparture">
  >();
  const journeysPerDestination = new Map<string, Set<string>>();

  for (const departure of departures.slice(0, 5)) {
    const journey = await Wagon.journey(
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
    const journeyPattern = getUniqueJourneyKey(journey.stops);
    if (!journeysPerDestination.has(departure.destination.name)) {
      journeysPerDestination.set(departure.destination.name, new Set());
    }
    journeysPerDestination.get(departure.destination.name)?.add(journeyPattern);
    journeysPattern.set(journeyPattern, journey);
  }

  for (const journey of journeys) {
    const patterns = journeysPerDestination.get(
      journey.userStopDeparture.destination.name
    );
    if (patterns?.size === 1) {
      continue;
    }
    // fill the via metadata
    const stopsOfOtherJourneys = new Set<string>();
    for (const pattern of patterns ?? []) {
      if (pattern === getUniqueJourneyKey(journey.stops)) {
        continue;
      }
      const otherJourney = journeysPattern.get(pattern);
      if (otherJourney) {
        for (const stop of otherJourney.stops) {
          stopsOfOtherJourneys.add(stop.name);
        }
      }
    }
    journey.metadata = {
      via: getFirstUniqueElement(
        new Set(journey.stops.map((stop) => stop.name)),
        stopsOfOtherJourneys
      ),
    };
  }

  return journeys;
}
