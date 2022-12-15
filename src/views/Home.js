import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvent, Polyline} from "react-leaflet";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import List from "../components/List/List";
import axios from "axios";

const Home = () => {
  const apiBaseUrl = useSelector((state) => state.apiBaseUrl.value);
  const [listHeader, setListHeader] = React.useState(["Personnalité", "Numéro de l'avion", "Durée", "Parti de", "Arrivée à", ""]);
  const [flights, setFlights] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [selectedFlight, setSelectedFlight] = React.useState({});
  const [mapView, setMapView] = React.useState({
    center: [48.8412, 2.3003],
    zoom: 5
  });

  async function getFlights() {
    const { data: flights } = await axios.get(apiBaseUrl + "/flight?skip=" + offset, {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    });
    setFlights(flights);
  }

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  function formatSeconds(seconds){
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 16);
  }

  useEffect(() => {
    getFlights();
  }, []);

  return (
    <div>
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vols</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
              <MapContainer className="h-full w-full rounded" center={mapView.center} zoom={mapView.zoom} scrollWheelZoom={true}>
                <ChangeView center={mapView.center} zoom={mapView.zoom} /> 
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
                />
                { selectedFlight && selectedFlight.from && selectedFlight.to ? <Polyline pathOptions={{color: "white"}} positions={[
                    [selectedFlight.from.latitude, selectedFlight.from.longitude],
                    [selectedFlight.to.latitude, selectedFlight.to.longitude]
                  ]} /> : null}
                
              </MapContainer>
            </div>
          </div>
        </div>
      </main>

      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Liste des vols</h1>
              <p className="mt-2 text-sm text-gray-700">La liste de tout les derniers vols en jet privée des milliardaires</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Rafraichir la liste des vols
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {listHeader.map((elem) => (
                          <th key={elem} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            {elem}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {flights.map((elem, i) => (
                        <tr key={i} className={elem.id == selectedFlight.id ? 'bg-gray-100' : undefined}>
                          <td className="text-gray-900 font-medium px-3 py-4 text-sm">{elem.plane.personality.firstname + " " + elem.plane.personality.lastname}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.plane.registration}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatSeconds(elem.duration)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.from ? elem.from.name : null}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.to ? elem.to.name : null}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                              onClick={() => {setSelectedFlight(elem); setMapView({center: [elem.from.latitude, elem.from.longitude], zoom: 5})}}
                              disabled={!elem.from || !elem.to}
                            >
                              Voir sur la carte
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;