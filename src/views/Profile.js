import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";

const Home = () => {
    const apiBaseUrl = useSelector((state) => state.apiBaseUrl.value);
    const [me, setMe] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        status: "",
    });

    async function getMe() {
        try {
            const {data} = await axios.get(apiBaseUrl + "/user/me", {
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                },
            });
            setMe(data)
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }


    async function onSaveProfile(event) {
        event.preventDefault();
        try {
            await axios.put(apiBaseUrl + "/user/me", me, {
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                },
            });
            toast.success("Vous avez modifié votre profil avec succès");
            refreshProfile()
        }
        catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue");
        }
    }


    function refreshProfile() {
        return getMe()
    }

    useEffect(() => {
        getMe();
    }, []);

    return (
        <div>
            <Navbar />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Votre profil</h1>
                </div>
            </header>

            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mt-5">
                <div className="mt-10 sm:mt-0">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Modification de votre profil</h3>
                                <p className="mt-1 text-sm text-gray-600">Gérer votre compte</p>
                            </div>
                        </div>
                        <div className="mt-5 md:col-span-2 md:mt-0">
                            <form onSubmit={onSaveProfile} >
                                <div className="overflow-hidden shadow sm:rounded-md">
                                    <div className="bg-white px-4 py-5 sm:p-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                                    Prénom
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    id="firstname"
                                                    value={me.firstname}
                                                    onChange={(e) => setMe({ ...me, firstname: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                                    Nom
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastname"
                                                    id="lastname"
                                                    value={me.lastname}
                                                    onChange={(e) => setMe({ ...me, lastname: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-4">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Adresse mail
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    value={me.email}
                                                    disabled
                                                    className="disabled:shadow-none disabled:bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>


                                            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    Status
                                                </label>
                                                <input
                                                    type="text"
                                                    name="status"
                                                    id="status"
                                                    value={me.status}
                                                    disabled
                                                    className="disabled:shadow-none disabled:bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Home;