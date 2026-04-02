export type RouteCoordinate = [number, number];

export type TaxiRoute = {
  id: string;
  name: string;
  coordinates: RouteCoordinate[];
};