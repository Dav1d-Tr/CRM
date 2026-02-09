import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

interface CountryMapProps {
  markers: { latLng: [number, number]; name: string }[];
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ markers, mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markers={markers}
      markerStyle={{
        initial: { fill: "#8e1a32"},
      }}
      zoomOnScroll={false}
      regionStyle={{
        initial: { fill: mapColor || "#D0D5DD" },
        hover: { fill: "#8e1a32" },
      }}
    />
  );
};

export default CountryMap;
