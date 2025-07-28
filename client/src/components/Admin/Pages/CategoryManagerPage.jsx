import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory } from '../../../store/categoriesSlice';
import { toast } from 'react-toastify';

const CategoryManagerPage = () => {
    const dispatch = useDispatch();
    const { items: categories, status } = useSelector((state) => state.categories);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Category name is required.");
            return;
        }
        dispatch(createCategory({ name, description }))
            .unwrap()
            .then(() => {
                toast.success("Category created successfully!");
                setName('');
                setDescription('');
            })
            .catch((err) => toast.error(`Failed to create category: ${err.message}`));
    };

    return (
        <div>
            <h1>Manage Categories</h1>
            <div className="card">
                <h2>Create New Category</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input style={{ flex: 1 }} type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input style={{ flex: 2 }} type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Create</button>
                </form>
            </div>

            <div className="card">
                <h2>Existing Categories</h2>
                {status === 'loading' && <p>Loading...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td>{cat.name}</td>
                                <td>{cat.description}</td>
                                <td>
                                    <button className="btn btn-secondary">Edit</button>
                                    <button className="btn btn-secondary">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagerPage;