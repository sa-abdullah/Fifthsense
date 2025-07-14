import { useContext, createContext, useState, useEffect } from 'react'

const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('overview');


    return (
        <GlobalContext.Provider value={{user, setUser, activeTab, setActiveTab}}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobal = () => useContext(GlobalContext)

