"use client";

import { useState } from "react";
import Navbar from "../components/navBar";

export default function ImagesPage() {
  const [images, setImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // État pour gérer la modal
  const [newCategoryName, setNewCategoryName] = useState<string>(""); // Nom de la nouvelle catégorie

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = () => {
    if (newCategoryName && !categories.includes(newCategoryName)) {
      setCategories((prevCategories) => [...prevCategories, newCategoryName]);
      setSelectedCategory(newCategoryName);
    }
    setNewCategoryName(""); // Réinitialiser l'input
    setIsModalOpen(false); // Fermer la modal
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar activeSection="images" />

      {/* Content */}
      <div className="flex-1 bg-gray-50 py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Gestion des Images</h1>

          {/* Formulaire d'Upload */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Uploader une Image</h2>
            <form className="flex items-center space-x-4">
              <input
                type="file"
                className="flex-1 py-2 px-4 bg-gray-100 rounded-md shadow-md"
              />
              <select
                className="py-2 px-4 bg-gray-100 rounded-md shadow-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>
                  Choisir une catégorie
                </option>
                {categories.length === 0 ? (
                  <option value="" disabled>
                    Aucune catégorie disponible
                  </option>
                ) : (
                  categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))
                )}
                <option value="add-new-category">Ajouter une nouvelle catégorie</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300"
              >
                Uploader
              </button>
            </form>

            {/* Ouvrir la modal pour ajouter une nouvelle catégorie */}
            {selectedCategory === "add-new-category" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300"
              >
                Ajouter une catégorie
              </button>
            )}
          </div>

          {/* Modal pour ajouter une nouvelle catégorie */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Ajouter une Nouvelle Catégorie</h3>
                <input
                  type="text"
                  className="w-full py-2 px-4 mb-4 bg-gray-100 rounded-md shadow-md"
                  placeholder="Nom de la catégorie"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filtre par Catégorie */}
          <div className="mb-8 flex space-x-4">
            <button
              onClick={() => handleFilter("")}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === "" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Tout
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilter(category)}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === category ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gestion des Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images
              .filter((image) =>
                selectedCategory ? image.category === selectedCategory : true
              )
              .map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">{image.name}</h3>
                    <p className="text-gray-600">{image.category}</p>

                    <div className="flex space-x-4 mt-4">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-300">
                        Télécharger
                      </button>
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all duration-300">
                        Modifier
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
