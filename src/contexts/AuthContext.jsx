import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null); // "MANAGER" hoặc "CUSTOMER"
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ưu tiên MANAGER nếu tồn tại
        const savedManagerUser = localStorage.getItem('MANAGER_user');
        const savedManagerToken = localStorage.getItem('MANAGER_token');

        const savedCustomerUser = localStorage.getItem('CUSTOMER_user');
        const savedCustomerToken = localStorage.getItem('CUSTOMER_token');

        if (savedManagerUser && savedManagerToken) {
            setUser(JSON.parse(savedManagerUser));
            setToken(savedManagerToken);
            setRole('MANAGER');
        } else if (savedCustomerUser && savedCustomerToken) {
            setUser(JSON.parse(savedCustomerUser));
            setToken(savedCustomerToken);
            setRole('CUSTOMER');
        }

        setIsLoading(false);
    }, []);

    const login = (userData, token, role = 'CUSTOMER') => {
        setUser(userData);
        setToken(token);
        setRole(role);

        localStorage.setItem(`${role}_user`, JSON.stringify(userData));
        localStorage.setItem(`${role}_token`, token);
    };

    const logout = (targetRole = role) => {
        localStorage.removeItem(`${targetRole}_user`);
        localStorage.removeItem(`${targetRole}_token`);

        // Chỉ clear nếu logout đúng role hiện tại
        if (targetRole === role) {
            setUser(null);
            setToken(null);
            setRole(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
