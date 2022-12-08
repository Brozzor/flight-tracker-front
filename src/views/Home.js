import React from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvent } from 'react-leaflet'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar/Navbar'
import List from '../components/List/List'


const Home = () => {
    const apiBaseUrl = useSelector((state) => state.apiBaseUrl.value)
    const listHeader = ['Personnalité', 'Numéro de l\'avion', 'Durée', "Parti de", "Arrivée à", ""]
    const listBody = [
        [ {value: 'Lindsay Walton', class: 'text-gray-900 font-medium'}, {value: 'JYGUY7'}, {value: '3 heures'}, {value: 'madrid'}, {value: 'Berlin'} ],
        [ {value: 'margery', class: 'text-gray-900 font-medium'}, {value: 'JYGUY8'}, {value: '4 heures'}, {value: 'paris'}, {value: 'los angeles'} ],
      ]
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
                            <MapContainer className="h-full w-full rounded" center={[48.8412, 2.3003]} zoom={5} scrollWheelZoom={false}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
                                />
                                <Marker position={[48.8412, 2.3003]}>
                                    <Popup>
                                        A pretty CSS3 popup. <br /> Easily customizable.
                                    </Popup>
                                </Marker>
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
                            <p className="mt-2 text-sm text-gray-700">
                                La liste de tout les derniers vols en jet privée des milliardaires
                            </p>
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
                    <List header={listHeader} listBody={listBody} />
                </div>

            </div>
        </div>
    );
};

export default Home;