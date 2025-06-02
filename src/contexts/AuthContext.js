import React, { createContext, useContext, useState, useEffect } from "react";
import fetchModel from "../lib/fetchModelData";

// Tạo context object, các component sử dụng để đọc/ghi dữ liệu
// Giá trị mặc định là null, sẽ được ghi đè bởi Provider
export const AuthContext = createContext(null);

// Tạo AuthProvider component để cung cấp giá trị context cho các component con
export const AuthProvider = ({ children }) => {
    // State luu user da login
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // sate luu token JWT
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userData._id);
        setAuthToken(token);
        setUserId(userData._id);
        // Luu user data vao state
        setUser(userData);
        setIsLoggedIn(true);
    }
    // logout thi xoa thong tin luu trong context
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setAuthToken(null);
        setUserId(null);
        setUser(null);
        setIsLoggedIn(false);
    }
    // chay lan dau mount va khi token thay doi
    useEffect(() => {
        if (authToken && userId) {
            try {
                const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
                setUser({
                    _id: decodedToken._id,
                    first_name: decodedToken.first_name,
                    last_name: decodedToken.last_name,
                    login_name: decodedToken.login_name,
                });
                setIsLoggedIn(true);
            } catch (err) {
                console.error("Error decoding token on startup:", err);
                logout();
            }
        } else {
            logout();
        }
    }, [authToken, userId]);

    const authContextValue = {
        user,
        isLoggedIn,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children} {/* children là các component được bọc bởi AuthProvider */}
        </AuthContext.Provider>
    )
}