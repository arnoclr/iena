import dayjs, { Dayjs } from "dayjs";

export interface SimpleLine {
  id: string;
  number: string;
  backgroundColor: string;
  textColor: string;
  pictoSvg?: string;
  numberShapeSvg?: string;
  importance: number;
  isOnRoad: boolean;
}

export interface SimpleStop {
  id: string;
  name: string;
  position: Position;
  lines: SimpleLine[];
}

export interface Position {
  lat: number;
  long: number;
}

export interface SimpleDeparture {
  destination: {
    name: string;
    averagePosition: Position;
  };
  source: {
    id: string;
  };
  leavesAt: Dayjs;
  arrivesAt: Dayjs;
  id: string;
  branchHash?: string;
  journeyCode?: string;
  vehicleLength?: "SHORT" | "LONG";
  vehicleNumber?: string;
  platform?: string;
}

export type SimpleJourney = {
  id: string;
  line: SimpleLine;
  userStopDeparture: SimpleDeparture;
  stops: SimpleStop[];
  nextStops: SimpleStop[];
  closedStops: Set<string>;
  skippedStops: Set<string>;
  metadata: {
    via?: string;
    direct?: boolean;
    flag?: "REPLACEMENT_BUS" | "OUTSIDE_PLATFORM" | "MODIFIED_JOURNEY";
  };
};

function processSVG(svg: string): string {
  return svg
    .replace(/width="[^"]+"/, "")
    .replace(/height="[^"]+"/, `height="100%"`)
    .replace('font-family="', 'font-weight="bold" font-family="Achemine, ')
    .replace('font-weight="normal"', 'font-weight="bold"');
}

export class Wagon {
  private static BASE_URL = "https://api-wagon.arno.cl/gantry/";

  private static get baseUrl(): string {
    return Wagon.BASE_URL;
  }

  private static get apiKey(): string {
    return "spad";
  }

  private static positionFromDTO(positionDto: any): Position {
    return {
      lat: positionDto[0],
      long: positionDto[1],
    };
  }

  private static stopFromDTO(stopDto: any, lines: SimpleLine[]): SimpleStop {
    const linesIds = Array.from(
      new Set(
        stopDto.stops
          .map((stop: any) => stop.lines.map((line: any) => line))
          .flat()
      )
    );
    return {
      id: stopDto.id,
      name: stopDto.name,
      position: this.positionFromDTO(stopDto.averagePosition),
      lines: lines.filter((line) => linesIds.includes(line.id)),
    };
  }

  private static lineFromDTO(lineDto: any): SimpleLine {
    return {
      id: lineDto.id,
      number: lineDto.number,
      backgroundColor: lineDto.backgroundColor,
      textColor: lineDto.textColor,
      pictoSvg: processSVG(lineDto.modeSvg ?? ""),
      numberShapeSvg: processSVG(lineDto.numberShapeSvg ?? ""),
      importance: lineDto.importance,
      isOnRoad: lineDto.isOnRoad,
    };
  }

  public static async departures(
    coordinates: string,
    lineId: string,
    stopIds: string[],
    /** @deprecated */
    isTerminus: boolean = false
  ): Promise<SimpleDeparture[]> {
    let params = new URLSearchParams({
      action: "departures",
      coordinates,
      compatibilityDate: "2025-01-21",
      apiKey: this.apiKey,
      line: lineId,
      stops: `[${stopIds.map((id) => `"${id}"`).join(",")}]`,
      isTerminus: isTerminus ? "1" : "0",
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch departures");
    }

    const json = await response.json();

    return json.data.departures
      .map((departure: any) => {
        return {
          destination: {
            name: departure.destinationLabel,
            averagePosition: this.positionFromDTO(
              departure.destination.averagePosition
            ),
          },
          source: {
            id: departure.source.id,
          },
          leavesAt: dayjs(
            departure.departure?.realTime ||
              departure.departure?.theoretical ||
              "invalid"
          ),
          arrivesAt: dayjs(
            departure.arrival?.realTime ||
              departure.arrival?.theoretical ||
              "invalid"
          ),
          id: departure.journeyId,
          branchHash: departure.branchHash,
          journeyCode: departure.journeyCode,
          vehicleLength: departure.vehicleLength,
          platform: departure.platform,
          vehicleNumber: departure.vehicleNumber,
        };
      })
      .filter(
        (departure: SimpleDeparture) =>
          departure.leavesAt.isValid() && departure.leavesAt.isAfter(dayjs())
      );
  }

  public static async journey(
    coordinates: string,
    journeyId: string,
    vehicleNumber?: string,
    journeyCode?: string,
    userStopAreaId?: string
  ): Promise<Omit<SimpleJourney, "userStopDeparture">> {
    let params = new URLSearchParams({
      action: "journey",
      coordinates,
      compatibilityDate: "2025-01-21",
      apiKey: this.apiKey,
      journeyId,
      vehicleNumber: vehicleNumber ?? "",
      journeyCode: journeyCode ?? "",
      userStopAreaId: userStopAreaId ?? "",
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch journey");
    }

    const json = await response.json();

    const stops = json.data.stops.map((stop: any) => {
      return this.stopFromDTO(stop.stop, []);
    });

    const line = this.lineFromDTO(json.data.line);
    const skippedStops = new Set<string>(
      json.data.stops.filter((x: any) => x.isSkipped).map((x: any) => x.stop.id)
    );
    const closedStops = new Set<string>(
      json.data.stops.filter((x: any) => x.isClosed).map((x: any) => x.stop.id)
    );

    return {
      id: journeyId,
      stops,
      nextStops: [...stops]
        .slice(stops.findIndex((stop: any) => stop.id === userStopAreaId))
        .filter((x) => skippedStops.has(x.id) === false),
      line,
      closedStops,
      skippedStops,
      metadata: {},
    };
  }
}
