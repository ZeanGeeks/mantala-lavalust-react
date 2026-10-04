import { useEffect, useState } from "react";
import Login from "./Login";
import ProductList from "./ProductList";
import { logout } from "./services/api";
import "./App.css";

function App() {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    if (!user) {
        return (
            <Login
                onLogin={handleLogin}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
        );
    }

    return (
        <div className={`app ${theme}-theme`}>
            <header className="header">
                <div>
                    <h1>Product Management System</h1>
                    <p>
                        Welcome, {user.username}
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="theme-toggle"
                        type="button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? "Dark mode" : "Light mode"}
                    </button>
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main>
                <ProductList />
            </main>
        </div>
    );
}

export default App;