import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const SearchControl = ({ onResult }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: "bar",
            showMarker: false,
            retainZoomLevel: false,
            autoClose: true,
            searchLabel: "Enter address",
            keepResult: true,
        });

        map.addControl(searchControl);

        map.on("geosearch/showlocation", (result) => {
            onResult(result.location);
        });

        return () => {
            map.removeControl(searchControl);
        };
    }, [map, onResult]);

    return null;
};

export default SearchControl;