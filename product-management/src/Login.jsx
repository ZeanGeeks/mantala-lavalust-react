import { useState } from "react";
import { login } from "./services/api";

function Login({ onLogin, theme, onToggleTheme }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const data = await login(username, password);

            localStorage.setItem(
                "access_token",
                data.tokens.access_token
            );

            localStorage.setItem(
                "refresh_token",
                data.tokens.refresh_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            onLogin(data.user);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Login failed."
            );
        }
    };

    return (
        <div className="login-page">
            <button
                className="theme-toggle login-theme-toggle"
                type="button"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
                {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
            <form
                className="login-card"
                onSubmit={handleSubmit}
            >
                <h1>Product Management</h1>

                <p>Login to continue</p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <label>Username</label>

                <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;