import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
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
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ height: "92vh", width: "100%" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDPMAUezMKX6JZDClhcBQlAj3BnRGARjus" }}
          defaultZoom={15}
          defaultCenter={{ lat: 34.9, lng: 127.5 }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
        ></GoogleMapReact>
      </div>
    </div>
  );
};
