import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
function Recenter({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
}
export default function MapView({ lat, lng, label }) {
    if (!lat || !lng) {
        return <div className="h-96 flex items-center justify-center bg-gray-200 rounded">
            Waiting for live location...
        </div>;
    }
    return (
        <MapContainer center={[lat, lng]} zoom={15} className="h-96 w-full rounded-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]}>
                <Popup>{label || "Bus location"}</Popup>
            </Marker>
            <Recenter lat={lat} lng={lng} />
        </MapContainer>
    );
}
