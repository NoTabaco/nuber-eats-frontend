import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSuccess: PositionCallback = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError: PositionErrorCallback = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      /* const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(results, status);
        }
      ); */
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);
  const onApiLoaded = ({ map, maps }: { map: google.maps.Map; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const onGetRouteClick = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 3,
        },
      });
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        result => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ height: "50vh", width: "100%" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDPMAUezMKX6JZDClhcBQlAj3BnRGARjus" }}
          defaultZoom={15}
          defaultCenter={{ lat: 34.9, lng: 127.5 }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
        ></GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get route</button>
    </div>
  );
};
