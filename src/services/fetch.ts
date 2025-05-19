import { SIMPLE_LINE } from "../mock";
import { Wagon, type SimpleJourney } from "./Wagon";

export async function getNextJourneys(
  stopArea: string,
  lineIds: string[]
): Promise<SimpleJourney[]> {
  // TODO: faire plusieurs fetchs pour chacune des lignes
  const departures = await Wagon.departures(lineIds[0], [stopArea]);
  const journeys: SimpleJourney[] = [];

  for (const departure of departures.slice(0, 2)) {
    const journey = await Wagon.journey(departure.id);
    journeys.push({
      userStopDeparture: departure,
      ...journey,
    });
  }

  for (const departure of departures.slice(2, 5)) {
    journeys.push({
      userStopDeparture: departure,
      id: departure.id,
      line: journeys.at(0)?.line ?? SIMPLE_LINE,
      closedStops: new Set<string>(),
      skippedStops: new Set<string>(),
      stops: [],
    });
  }

  return journeys;
}
