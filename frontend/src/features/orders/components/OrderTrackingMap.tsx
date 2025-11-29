import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import L from "leaflet";
import type { Location } from "../types/order.types";

// Fix for default marker icons in React-Leaflet
// Delete the default icon to prevent Leaflet from trying to load it
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icons for different locations
const restaurantIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const courierIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface OrderTrackingMapProps {
  restaurantLocation?: Location;
  deliveryLocation?: Location;
  courierLocation?: Location;
  restaurantName?: string;
}

// Component to fit bounds and handle map initialization
const MapBoundsUpdater = ({
  restaurantLocation,
  deliveryLocation,
  courierLocation,
}: {
  restaurantLocation?: Location;
  deliveryLocation?: Location;
  courierLocation?: Location;
}) => {
  const map = useMap();

  useEffect(() => {
    // Force invalidate size to ensure proper tile loading
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const bounds: L.LatLngTuple[] = [];

    if (restaurantLocation) {
      bounds.push([restaurantLocation.latitude, restaurantLocation.longitude]);
    }
    if (deliveryLocation) {
      bounds.push([deliveryLocation.latitude, deliveryLocation.longitude]);
    }
    if (courierLocation) {
      bounds.push([courierLocation.latitude, courierLocation.longitude]);
    }

    if (bounds.length > 0) {
      setTimeout(() => {
        map.fitBounds(bounds, { padding: [50, 50] });
      }, 150);
    }
  }, [map, restaurantLocation, deliveryLocation, courierLocation]);

  return null;
};

export const OrderTrackingMap = ({
  restaurantLocation,
  deliveryLocation,
  courierLocation,
  restaurantName,
}: OrderTrackingMapProps) => {
  // Default center (Budapest coordinates as fallback)
  const defaultCenter: L.LatLngTuple = [47.4979, 19.0402];

  // Calculate center based on available locations
  const getCenter = (): L.LatLngTuple => {
    if (deliveryLocation) {
      return [deliveryLocation.latitude, deliveryLocation.longitude];
    }
    if (restaurantLocation) {
      return [restaurantLocation.latitude, restaurantLocation.longitude];
    }
    return defaultCenter;
  };

  // Generate a unique key for the map based on locations
  const mapKey = `${restaurantLocation?.latitude}-${restaurantLocation?.longitude}-${deliveryLocation?.latitude}-${deliveryLocation?.longitude}`;

  return (
    <Box
      height="400px"
      width="100%"
      borderRadius="md"
      overflow="hidden"
      position="relative"
      zIndex={1}
    >
      <MapContainer
        key={mapKey}
        center={getCenter()}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={true}
        preferCanvas={false}
        whenReady={(map) => {
          setTimeout(() => {
            map.target.invalidateSize();
          }, 100);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={1}
          keepBuffer={2}
          updateWhenIdle={false}
          updateWhenZooming={false}
        />

        <MapBoundsUpdater
          restaurantLocation={restaurantLocation}
          deliveryLocation={deliveryLocation}
          courierLocation={courierLocation}
        />

        {restaurantLocation && (
          <Marker
            position={[restaurantLocation.latitude, restaurantLocation.longitude]}
            icon={restaurantIcon}
          >
            <Popup>
              <strong>{restaurantName || "Restaurant"}</strong>
              <br />
              {restaurantLocation.address}
            </Popup>
          </Marker>
        )}

        {deliveryLocation && (
          <Marker
            position={[deliveryLocation.latitude, deliveryLocation.longitude]}
            icon={deliveryIcon}
          >
            <Popup>
              <strong>Delivery Address</strong>
              <br />
              {deliveryLocation.address}
            </Popup>
          </Marker>
        )}

        {courierLocation && (
          <Marker
            position={[courierLocation.latitude, courierLocation.longitude]}
            icon={courierIcon}
          >
            <Popup>
              <strong>Courier</strong>
              <br />
              Current location
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};
