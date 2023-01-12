import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const apiBaseUrl = useSelector((state) => state.apiBaseUrl.value);
  const listHeader = ["", "Prénom", "Nom", ""];
  const [personalities, setPersonalities] = React.useState([]);
  const [selectedPersonality, setSelectedPersonality] = React.useState({});

  const [newPersonality, setNewPersonality] = React.useState({
    firstname: "",
    lastname: "",
    profil_image: ""
  });
  const [showMorePersonalitiesBtn, setShowMorePersonalitiesBtn] = React.useState(true);

  const [showAddPersonality, setShowAddPersonality] = React.useState(false);

  async function getPersonalities() {
    let findPersonalities = [];
    try {
      const { data } = await axios.get(apiBaseUrl + "/personality", {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      findPersonalities = data;
    } catch (error) {
      console.error(error)
    }
    if (findPersonalities.length < 10) setShowMorePersonalitiesBtn(false)

    setPersonalities(personalities.concat(findPersonalities));
  }


  async function onDeletePersonality(id) {
    try {
      await axios.delete(apiBaseUrl + "/personality/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      toast.success("Personalité supprimé avec succès");
      refreshPersonalities()
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  async function onSubmitEditPersonality() {
    try {
      await axios.put(apiBaseUrl + "/personality/" + selectedPersonality.id, selectedPersonality, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      toast.success("Personalité modifié avec succès");
      setSelectedPersonality({});
      refreshPersonalities()
    }
    catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  async function onSubmitCreatePersonality() {
    if (newPersonality.firstname === "" || newPersonality.lastname === "" || newPersonality.profil_image === "") return toast.error("Veuillez remplir tous les champs");
    try {
      await axios.post(apiBaseUrl + "/personality", newPersonality, {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      });
      toast.success("La personnalité a été ajouté avec succès");
      setSelectedPersonality({});
      setShowAddPersonality(false)
      refreshPersonalities()
    }
    catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  function refreshPersonalities() {
    personalities.splice(0, personalities.length)
    setPersonalities([...personalities])
    setShowMorePersonalitiesBtn(true)
    return getPersonalities()
  }

  useEffect(() => {
    getPersonalities();
  }, []);

  return (
    <div>
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Personnalités</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mt-5">
        {
          localStorage.status !== "ADMINISTRATOR" &&
          <div role="alert">
            <div className="border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700">
              <p>Pour pouvoir apporter des modifications vous devez être administrateur.</p>
            </div>
          </div>}
        <div className="px-4 sm:px-6 lg:px-0 mt-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Liste des personnalités</h1>
              <p className="mt-2 text-sm text-gray-700">la liste de toute les personnalités</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => { setShowAddPersonality(!showAddPersonality) }}
                disabled={localStorage.status !== "ADMINISTRATOR"}
              >
                Ajouter une personnalité
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
                        {listHeader.map((elem,i) => (
                          <th key={i} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            {elem}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {personalities.map((elem, i) => (
                        <tr key={i} className={elem.id == selectedPersonality.id ? 'bg-gray-100' : undefined}>
                          <td className="whitespace-nowrap text-gray-900 font-medium px-3 py-4 text-sm"><img className="rounded max-w-none" width="75px" src={elem.profil_image}></img></td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.firstname}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{elem.lastname}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="mr-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                              onClick={() => { setSelectedPersonality(elem) }}
                              disabled={localStorage.status !== "ADMINISTRATOR"}
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md border border-gray-300 bg-red-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                              onClick={() => { onDeletePersonality(elem.id) }}
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
                    showMorePersonalitiesBtn && <button onClick={() => { getPersonalities() }} className="bg-white hover:bg-gray-100 text-gray-600 font-semibold py-2 px-4 rounded shadow">
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
      {selectedPersonality.id ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Modification de : {selectedPersonality.firstname + " " + selectedPersonality.lastname}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setSelectedPersonality({})}
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
                          Image de profil
                        </label>
                        <input
                          type="text"
                          name="profil_image"
                          id="profil_image"
                          value={selectedPersonality.profil_image}
                          onChange={(e) => setSelectedPersonality({ ...selectedPersonality, profil_image: e.target.value })}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />

                      </div>

                    </div>

                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setSelectedPersonality({})}
                  >
                    Fermer
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onSubmitEditPersonality()}
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

      {showAddPersonality ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Ajouter une personnalité
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => { setShowAddPersonality(false); }}
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
                          Photo de profil
                        </label>
                        <input
                          type="text"
                          name="profil_image"
                          id="profil_image"
                          value={newPersonality.profil_image}
                          onChange={(e) => setNewPersonality({ ...newPersonality, profil_image: e.target.value })}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />

                      </div>
                      <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                          <label className="block text-sm font-medium text-gray-700">
                            Prénom
                          </label>
                          <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={newPersonality.firstname}
                            onChange={(e) => setNewPersonality({ ...newPersonality, firstname: e.target.value })}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex flex-col w-1/2 ml-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            value={newPersonality.lastname}
                            onChange={(e) => setNewPersonality({ ...newPersonality, lastname: e.target.value })}
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
                    onClick={() => setShowAddPersonality(false)}
                  >
                    Fermer
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onSubmitCreatePersonality()}
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