import { useEffect, useState } from "react";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "./services/api";

function ProductList() {
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        product_name: "",
        description: "",
        price: "",
        quantity: ""
    });

    const [editingId, setEditingId] = useState(null);

    // Load products when the page opens
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };

        loadProducts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateProduct(editingId, form);
            } else {
                await createProduct(form);
            }

            setForm({
                product_name: "",
                description: "",
                price: "",
                quantity: ""
            });

            setEditingId(null);

            // Reload product list
            const data = await getProducts();
            setProducts(data.products || []);

        } catch (error) {
            console.error("Error saving product:", error);

            alert(
                error.response?.data?.error ||
                "Operation failed."
            );
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);

        setForm({
            product_name: product.product_name,
            description: product.description || "",
            price: product.price,
            quantity: product.quantity
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(id);

            // Reload product list
            const data = await getProducts();
            setProducts(data.products || []);

        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Delete failed.");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);

        setForm({
            product_name: "",
            description: "",
            price: "",
            quantity: ""
        });
    };

    return (
        <div className="products-page">

            <section className="form-card">
                <h2>
                    {editingId
                        ? "Edit Product"
                        : "Add Product"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="product-name">Product name</label>
                    <input
                        id="product-name"
                        name="product_name"
                        placeholder="e.g. Wireless keyboard"
                        value={form.product_name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="product-description">Description</label>
                    <textarea
                        id="product-description"
                        name="description"
                        placeholder="Add a short description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <label htmlFor="product-price">Price</label>
                    <input
                        id="product-price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="product-quantity">Quantity</label>
                    <input
                        id="product-quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-actions">
                        <button className="primary-action" type="submit">
                            {editingId ? "Update Product" : "Add Product"}
                        </button>

                        {editingId && (
                            <button
                                className="secondary-action"
                                type="button"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </form>
            </section>

            <section className="products-card">

                <h2>Product List</h2>

                <div className="table-container">
                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id}>

                                        <td>
                                            {product.id}
                                        </td>

                                        <td>
                                            {product.product_name}
                                        </td>

                                        <td>
                                            {product.description}
                                        </td>

                                        <td>
                                            ₱{product.price}
                                        </td>

                                        <td>
                                            {product.quantity}
                                        </td>

                                        <td className="actions-cell">
                                            <button
                                                className="edit-action"
                                                onClick={() =>
                                                    handleEdit(product)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-action"
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </section>

        </div>
    );
}

export default ProductList;