"use client"
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1); // Distance in km
    };

    useEffect(() => {
        if (userLocation) {
            const service = new window.google.maps.places.PlacesService(
                document.createElement("div")
            )
            service.nearbySearch(
                {
                    location: userLocation,
                    radius: 5000,
                    type: ["hospital"],
                },
                (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        // Get details for each place to fetch phone numbers
                        results.forEach((place, index) => {
                            service.getDetails(
                                { placeId: place.place_id },
                                (placeDetails, detailStatus) => {
                                    if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                                        results[index] = {
                                            ...place,
                                            phoneNumber: placeDetails.formatted_phone_number,
                                            distance: calculateDistance(
                                                userLocation.lat,
                                                userLocation.lng,
                                                place.geometry.location.lat(),
                                                place.geometry.location.lng()
                                            )
                                        };
                                        
                                        // Update places when all details are fetched
                                        if (index === results.length - 1) {
                                            setPlaces(results.sort((a, b) => a.distance - b.distance));
                                        }
                                    }
                                }
                            );
                        });
                    }
                }
            );
        }
    }, [userLocation]);

    const handleCall = (phoneNumber) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    const containerStyle = {
        width: "100%",
        height: "400px",
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="w-full md:w-1/2 h-96">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={userLocation || { lat: -34.397, lng: 150.644 }}
                        zoom={15}
                    >
                        {userLocation && <Marker position={userLocation} />}
                        {places.map((place, index) => (
                            <Marker
                                key={index}
                                position={{
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng(),
                                }}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
            
            <div className="w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-4">Nearby Hospitals</h2>
                <div className="space-y-4">
                    {places && places.map((place, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold">{place.name}</h3>
                            <p className="text-gray-600">{place.vicinity}</p>
                            <p className="text-blue-600">Distance: {place.distance} km</p>
                            {place.rating && (
                                <p className="text-yellow-600">Rating: {place.rating} ⭐</p>
                            )}
                            {place.phoneNumber ? (
                                <button
                                    onClick={() => handleCall(place.phoneNumber)}
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Call Hospital
                                </button>
                            ) : (
                                <p className="text-gray-500 mt-2">No phone number available</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
