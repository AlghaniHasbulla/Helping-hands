import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/api'; 
import { toast } from 'react-toastify'; 

const CategoryManagementPage = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null); 

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError(err.message || 'Failed to load categories');
            toast.error(`Error fetching categories: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreateUpdateCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim() || !categoryDescription.trim()) {
            toast.error("Category Name and Description cannot be empty.");
            return;
        }
        setIsLoading(true);
        try {
            if (editingCategory) {
                
                await api.patch(`/admin/categories/${editingCategory.id}`, {
                    name: categoryName,
                    description: categoryDescription,
                });
                toast.success('Category updated successfully!');
                setEditingCategory(null);
            } else {
                
                await api.post('/admin/categories', {
                    name: categoryName,
                    description: categoryDescription,
                });
                toast.success('Category created successfully!');
            }
            setCategoryName('');
            setCategoryDescription('');
            fetchCategories(); 
        } catch (e) {
            console.error("Error adding/updating category: ", e);
            toast.error(`Error creating/updating category: ${e.response?.data?.error || e.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                await api.delete(`/admin/categories/${id}`);
                toast.success('Category deleted successfully!');
                fetchCategories(); 
            } catch (e) {
                console.error("Error deleting category: ", e);
                toast.error(`Error deleting category: ${e.response?.data?.error || e.message || 'Unknown error'}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Error Loading Categories</h2>
                <p>{error}</p>
                <button
                    onClick={fetchCategories}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h1>

            
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">{editingCategory ? 'Edit Category' : 'Create New Category'}</h2>
                <form onSubmit={handleCreateUpdateCategory} className="space-y-4">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Education, Healthcare"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="categoryDescription"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Brief description of the category"
                            rows="3"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCategory(null);
                                    setCategoryName('');
                                    setCategoryDescription('');
                                }}
                                className="flex-1 px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Categories</h2>
                {categories.length === 0 ? (
                    <p className="text-gray-600">No categories found. Create one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">ID</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Description</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-700">{cat.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{cat.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{cat.description}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditCategory(cat)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagementPage;
