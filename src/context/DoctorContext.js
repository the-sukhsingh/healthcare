"use client"

import { createContext,useState,useEffect,useContext } from "react"

const DoctorContext = createContext()

export const DoctorProvider = ({children}) => {
    
    const [doctors,setDoctors] = useState([])

    useEffect(() => {
        fetch("/api/doctors")
        .then(res => res.json())
        .then(data => setDoctors(data.data))
    },[])

    return (
        <DoctorContext.Provider value={{doctors}}>
            {children}
        </DoctorContext.Provider>
    )
}

export const useDoctor = () => {
    return useContext(DoctorContext)
}