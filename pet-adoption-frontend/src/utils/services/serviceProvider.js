import { createContext, useState } from 'react';
import UserService from './userService';

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {

    // Instantiate all service classes
    const userService = UserService;

    // Store all services in a single object to be provided by context
    const services = {
        userService,
    };

    return (
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    );
};

// Custom hook to use services in components
export const useServices = () => useContext(ServicesContext);