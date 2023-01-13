import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvent, Polyline} from "react-leaflet";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import List from "../components/List/List";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const apiBaseUrl = useSelector((state) => state.apiBaseUrl.value);
  const listHeader = ["Personnalité", "Numéro de l'avion","Décollage", "Durée", "Parti de", "Arrivée à", ""];
  const [flights, setFlights] = React.useState([]);
  const [selectedFlight, setSelectedFlight] = React.useState({});
  const [showMoreFlightBtn, setShowMoreFlightBtn] = React.useState(true);
  const [showLoadingRefreshBtn, setShowLoadingRefreshBtn] = React.useState(false);

  const [mapView, setMapView] = React.useState({
    center: [48.8412, 2.3003],
    zoom: 5
  });

  async function getFlights() {
    let findFlights;
    try {
      console.log(flights)
      console.log(flights.length)
      const { data } = await axios.get(apiBaseUrl + "/flight?skip=" + flights.length, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        }, 
      });
      findFlights = data
    } catch (error) {
      console.error(error)
    }
    if(findFlights.length < 10) setShowMoreFlightBtn(false)

    setFlights(flights.concat(findFlights));
  }

  async function onRefreshFlight() {
    try {
      setShowLoadingRefreshBtn(true)
      await axios.put(apiBaseUrl + "/flight/refresh",{}, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        }, 
      });
    } catch (error) {
      setShowLoadingRefreshBtn(false)
      return console.error(error)
    }
    setShowLoadingRefreshBtn(false)
    setSelectedFlight({})
    flights.splice(0, flights.length)
    setFlights([...flights])
    setShowMoreFlightBtn(true)
    return getFlights()
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

  function formatDate(timestamp){
    const date = new Date(timestamp);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
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
      {
        selectedFlight.from && <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
              
              <MapContainer className="h-full w-full rounded" center={mapView.center} zoom={mapView.zoom} scrollWheelZoom={true}>
                <ChangeView center={mapView.center} zoom={mapView.zoom} /> 
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png?api_key=a8e501bc-a838-4718-836e-3f26bc6d6239"
                />
                { selectedFlight && selectedFlight.from && selectedFlight.to ? <Polyline pathOptions={{color: "white"}} positions={[
                    [selectedFlight.from.latitude, selectedFlight.from.longitude],
                    [selectedFlight.to.latitude, selectedFlight.to.longitude]
                  ]} /> : null}
                
              </MapContainer>

            </div>
          </div>
        </div>
      }
  
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mt-5">
        <div className="px-4 sm:px-6 lg:px-0">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Liste des vols</h1>
              <p className="mt-2 text-sm text-gray-700">La liste de tout les derniers vols en jet privée des milliardaires</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              {
                showLoadingRefreshBtn && <button type="button"
                                            className="inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 text-indigo-400 transition duration-150 ease-in-out border-2 border-indigo-400 rounded-md shadow cursor-not-allowed"
                                            disabled="">
                                            <svg className="w-5 h-5 mr-3 -ml-1 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            Rafraichissement en cours...
                                        </button>
              }
              {
                !showLoadingRefreshBtn && <button
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                            onClick={()=> onRefreshFlight()}
                                          >
                                            Rafraichir la liste des vols
                                          </button>
              }
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
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(elem.firstSeen*1000)}</td>
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
                <div className="flex justify-center mt-2 mb-3">
                  {
                    showMoreFlightBtn && <button onClick={()=> {getFlights()}} className="bg-white hover:bg-gray-100 text-gray-600 font-semibold py-2 px-4 rounded shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                            </svg>
                                          </button>
                  }
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;