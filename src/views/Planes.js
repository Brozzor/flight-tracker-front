import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const apiBaseUrl = useSelector((state) => state.apiBaseUrl.value);
  const listHeader = ["Personnalité", "Numéro de l'avion", "Modèle", "ICAO", "Prix", ""];
  const [planes, setPlanes] = React.useState([]);
  const [personalities, setPersonalities] = React.useState([]);
  const [selectedPlane, setSelectedPlane] = React.useState({});

  const [newPlane, setNewPlane] = React.useState({
    personality: "",
    registration: "",
    model: "",
    icao: "",
    price: 0,
  });
  const [showMorePlanesBtn, setShowMorePlanesBtn] = React.useState(true);

  const [showAddPlane, setShowAddPlane] = React.useState(false);

  async function getPlanes() {
    let findPlanes = [];
    try {
      const { data } = await axios.get(apiBaseUrl + "/plane?skip=" + planes.length, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      findPlanes = data
    } catch (error) {
      console.error(error)
    }
    if (findPlanes.length < 10) setShowMorePlanesBtn(false)

    setPlanes(planes.concat(findPlanes));
  }

  async function getPersonalities(){
    try {
      const { data } = await axios.get(apiBaseUrl + "/personality", {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      setPersonalities(data);
      console.log(data)
    }catch (error) {
      console.error(error)
    }
  }


  async function onDeletePlane(id) {
    try {
      await axios.delete(apiBaseUrl + "/plane/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      toast.success("Avion supprimé avec succès");
      refreshPlanes()
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  async function onSubmitEditPlane() {
    try {
      selectedPlane.personality = selectedPlane.personality.id
      await axios.put(apiBaseUrl + "/plane/" + selectedPlane.id, selectedPlane, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      toast.success("L'avion modifié avec succès");
      setSelectedPlane({});
      refreshPlanes()
    }
    catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  async function onSubmitCreatePlane() {
    if (!newPlane.personality) newPlane.personality = personalities[0].id
    try {
      await axios.post(apiBaseUrl + "/plane", newPlane, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      toast.success("L'avion a été ajouté avec succès");
      setSelectedPlane({});
      setShowAddPlane(false)
      refreshPlanes()
    }
    catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  function refreshPlanes() {
    planes.splice(0, planes.length)
    setPlanes([...planes])
    setShowMorePlanesBtn(true)
    return getPlanes()
  }

  useEffect(() => {
    getPlanes();
  }, []);

  return (
    <div>
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Avions</h1>
        </div>
      </header>
      
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mt-5">
      {
        localStorage.status !== "ADMINISTRATOR" && 
        <div role="alert">
          <div class="border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700">
            <p>Pour pouvoir apporter des modifications vous devez etre administrateur.</p>
          </div>
        </div> }
        <div className="px-4 sm:px-6 lg:px-0 mt-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Liste des avions</h1>
              <p className="mt-2 text-sm text-gray-700">La liste de tous les avions enregistrer et tracké sur la plateforme</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => {getPersonalities();setShowAddPlane(!showAddPlane)}}
                disabled={localStorage.status !== "ADMINISTRATOR"}
              >
                Ajouter un avion
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
                      {planes.map((elem, i) => (
                        <tr key={i} className={elem.id == selectedPlane.id ? 'bg-gray-100' : undefined}>
                          <td className="text-gray-900 font-medium px-3 py-4 text-sm">{elem.personality.firstname + " " + elem.personality.lastname}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.registration}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.model}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.icao}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.price}$</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="mr-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                              onClick={() => { setSelectedPlane(elem) }}
                              disabled={localStorage.status !== "ADMINISTRATOR"}
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md border border-gray-300 bg-red-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                              onClick={() => { onDeletePlane(elem.id) }}
                              disabled={localStorage.status !== "ADMINISTRATOR"}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
                <div className="flex justify-center mt-2 mb-3">
                  {
                    showMorePlanesBtn && <button onClick={() => { getPlanes() }} className="bg-white hover:bg-gray-100 text-gray-600 font-semibold py-2 px-4 rounded shadow">
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
      {selectedPlane.id ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Modification de l'avion {selectedPlane.registration}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setSelectedPlane({})}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="my-4 text-slate-500 text-lg leading-relaxed">
                    <div className="flex flex-col">
                      <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                          <label className="block text-sm font-medium text-gray-700">
                            Modèle
                          </label>
                          <input
                            type="text"
                            name="model"
                            id="model"
                            value={selectedPlane.model}
                            onChange={(e) => setSelectedPlane({ ...selectedPlane, model: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-1/2 ml-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Prix
                          </label>
                          <input
                            type="text"
                            name="price"
                            id="price"
                            value={selectedPlane.price}
                            onChange={(e) => setSelectedPlane({ ...selectedPlane, price: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setSelectedPlane({})}
                  >
                    Fermer
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onSubmitEditPlane()}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {showAddPlane ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Ajouter un avion
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {setShowAddPlane(false); }}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="my-4 text-slate-500 text-lg leading-relaxed">
                    <div className="flex flex-col">
                      <div className="flex flex-col">
                        
                          <label className="block text-sm font-medium text-gray-700">
                            Personnalité
                          </label>
                          <select onChange={(e) => setNewPlane({ ...newPlane, personality: e.target.value })} defaultValue={personalities.length ? personalities[0].id : null} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {
                              (() => {
                                const listItmes = []
                                personalities.map((personality) => {
                                  listItmes.push(<option key={personality.id} value={personality.id}>{personality.firstname + " " + personality.lastname}</option>)
                                })
                                return listItmes
                              })()
                            }
                            
                          </select>
                        
                      </div>
                      <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                          <label className="block text-sm font-medium text-gray-700">
                            Numéro de l'avion
                          </label>
                          <input
                            type="text"
                            name="registration"
                            id="registration"
                            value={newPlane.registration}
                            onChange={(e) => setNewPlane({ ...newPlane, registration: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-1/2 ml-2">
                          <label className="block text-sm font-medium text-gray-700">
                            ICAO
                          </label>
                          <input
                            type="text"
                            name="icao"
                            id="icao"
                            value={newPlane.icao}
                            onChange={(e) => setNewPlane({ ...newPlane, icao: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                          <label className="block text-sm font-medium text-gray-700">
                            Modèle
                          </label>
                          <input
                            type="text"
                            name="model"
                            id="model"
                            value={newPlane.model}
                            onChange={(e) => setNewPlane({ ...newPlane, model: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-1/2 ml-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Prix
                          </label>
                          <input
                            type="text"
                            name="price"
                            id="price"
                            value={newPlane.price}
                            onChange={(e) => setNewPlane({ ...newPlane, price: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowAddPlane(false)}
                  >
                    Fermer
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onSubmitCreatePlane()}
                  >
                    Créer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default Home;