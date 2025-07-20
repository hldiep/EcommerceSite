import { createContext, useContext, useState, useEffect } from "react";
import { env } from "./Contraint";

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (token) => {
    try {
        const decoded = parseJwt(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (e) {
        return true;
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token]);

    const login = async (username, password) => {
        const res = await fetch(`${env.url.API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();

        const newToken = data?.data?.token;
        const userData = data?.data?.user;

        if (!newToken || !userData) throw new Error('Token hoặc thông tin người dùng không hợp lệ');

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !isTokenExpired(token);
    const roles = user?.role ? [user.role.replace('ROLE_', '')] : [];

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, roles, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
