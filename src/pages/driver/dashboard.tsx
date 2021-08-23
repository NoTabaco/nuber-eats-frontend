import { gql, useMutation, useSubscription } from "@apollo/client";
import GoogleMapReact from "google-map-react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { cookedOrdersSubscription } from "../../__generated__/cookedOrdersSubscription";
import {
  takeOrderMutation,
  takeOrderMutationVariables,
} from "../../__generated__/takeOrderMutation";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrdersSubscription {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrderMutation($takeOrderInput: TakeOrderInput!) {
    takeOrder(input: $takeOrderInput) {
      ok
      error
    }
  }
`;

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
  const makeRoute = useCallback(() => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
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
  }, [driverCoords.lat, driverCoords.lng, map]);
  const { data: cookedOrdersData } = useSubscription<cookedOrdersSubscription>(
    COOKED_ORDERS_SUBSCRIPTION
  );
  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData, makeRoute]);
  const history = useHistory();
  const onCompleted = (data: takeOrderMutation) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<
    takeOrderMutation,
    takeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, { onCompleted });
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({ variables: { takeOrderInput: { id: orderId } } });
  };

  return (
    <div>
      <Helmet>
        <title>Driver Dashboard | Nuber Eats</title>
      </Helmet>
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
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h4 className="text-center text-2xl font-medium my-3">
              Pick it up soon @ {cookedOrdersData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full mt-5 block text-center"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  );
};
