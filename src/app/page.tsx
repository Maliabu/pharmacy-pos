/* eslint-disable @next/next/no-img-element */
"use client"

import { Mail, PhoneCall } from "lucide-react"
import StepWise from "./stepWise"
import { useEffect, useState } from "react";
// import logo from '@/app/assets/next.svg'

export default function Login(){
    const [address, setAddress] = useState('')
    useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('User location:', latitude, longitude);
            
            // Call the reverse geocoding API using fetch (Google Maps Geocoding API)
            const apiKey = 'pk.74c3a03289b55a18ff66b39b1fee869b'
            // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
            const url = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&`
            fetch(url)
              .then(response => response.json())
              .then(data => {
                if (data.place_id !== '') {
                  const address = data.address.city+" "+data.address.country+", "+data.address.neighbourhood+" - "+data.address.suburb;
                  setAddress(address);
                } else {
                  console.log('No address found');
                }
              })
              .catch(error => console.error('Error during reverse geocoding:', error));
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true, // Try to get a more accurate location
            timeout: 5000, // Maximum time to wait for the location
            maximumAge: 0 // Don't use cached location
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    }, [])
      
    return( 
        <div>
    <StepWise address={address}/>
    <div className="text-xs sm:p-6 p-4 absolute bottom-0 bg-background w-full sm:flex sm:justify-between">
                    &copy;copyright.newfeelventures.com@{new Date().getFullYear()}
                    <div className="flex sm:block hidden"><Mail size={16} className="mr-3"/> | support@newfeelventures.com</div>
                    <div className="flex sm:block hidden"><PhoneCall size={16} className="mr-3"/> | 0701062621</div>
                    <div className="">AllRightsReserved</div>
                    </div>
        </div>
    )
}