import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, UserCircleIcon, ArrowRightOnRectangleIcon, ClockIcon, PencilSquareIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../components/ImageUploader';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest, backendStatus }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [newRecipeData, setNewRecipeData] = useState({
    title: '',
    description: '',
    instructions: '',
    cookingTime: 60,
    photo: null
  });

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Recipe').with(['author']).find({ orderBy: 'createdAt', order: 'DESC' });
      setRecipes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipeData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setNewRecipeData(prev => ({ ...prev, photo: file }));
  };

  const resetForm = () => {
    setNewRecipeData({
      title: '',
      description: '',
      instructions: '',
      cookingTime: 60,
      photo: null
    });
    setEditingRecipe(null);
  };

  const openModal = (recipeToEdit = null) => {
    if (recipeToEdit) {
      setEditingRecipe(recipeToEdit);
      setNewRecipeData({ ...recipeToEdit, photo: null }); // Don't re-upload photo unless a new one is selected
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newRecipeData };
      if (!payload.photo) {
        delete payload.photo; // Don't send null if no new photo
      }
      if (editingRecipe) {
        await manifest.from('Recipe').update(editingRecipe.id, payload);
      } else {
        await manifest.from('Recipe').create(payload);
      }
      await fetchRecipes();
      closeModal();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };
  
  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
        try {
            await manifest.from('Recipe').delete(recipeId);
            await fetchRecipes();
        } catch (error) {
            console.error('Failed to delete recipe:', error);
        }
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                Backend Status: <span className={`h-3 w-3 rounded-full ${backendStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
             </div>
            <UserCircleIcon className="h-8 w-8 text-gray-500" />
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Admin Panel</a>
             <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Recipes</h1>
            <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <PlusIcon className="h-5 w-5" />
                <span>New Recipe</span>
            </button>
        </div>

        {isLoading ? (
             <p className="text-gray-500">Loading recipes...</p>
        ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                        <div className="relative">
                           <img className="h-56 w-full object-cover" src={recipe.photo?.thumbnail?.url || `https://via.placeholder.com/400x400.png?text=No+Image`} alt={recipe.title} />
                           <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-gray-700 flex items-center gap-1.5">
                             <ClockIcon className="h-4 w-4" />
                             {recipe.cookingTime} min
                           </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-semibold text-blue-600">By {recipe.author?.name || 'Unknown'}</p>
                            <h3 className="mt-1 text-xl font-semibold text-gray-900 truncate">{recipe.title}</h3>
                            <p className="mt-2 text-gray-600 line-clamp-2 text-sm">{recipe.description}</p>
                        </div>
                        {user.id === recipe.author?.id && (
                            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                                <button onClick={() => openModal(recipe)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                    <PencilSquareIcon className="h-4 w-4" /> Edit
                                </button>
                                <button onClick={() => handleDelete(recipe.id)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors">
                                    <TrashIcon className="h-4 w-4" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new recipe.</p>
            </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-xl font-bold mb-4">{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
                    <div className="space-y-4">
                        <ImageUploader onFileSelect={handleFileChange} existingImage={editingRecipe?.photo?.thumbnail?.url} />
                        <input type="text" name="title" placeholder="Recipe Title" value={newRecipeData.title} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                        <textarea name="description" placeholder="A short description..." value={newRecipeData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md" rows="3"></textarea>
                        <textarea name="instructions" placeholder="Cooking instructions..." value={newRecipeData.instructions} onChange={handleInputChange} className="w-full p-2 border rounded-md" rows="6"></textarea>
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
                           <input type="number" name="cookingTime" placeholder="e.g., 30" value={newRecipeData.cookingTime} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Recipe</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
