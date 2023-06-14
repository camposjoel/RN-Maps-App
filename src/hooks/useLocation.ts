import { useEffect, useState, useRef } from 'react'
import Geolocation from '@react-native-community/geolocation'
import { Location } from '../interfaces/AppInterfaces'

const initialState: Location = { latitude: 0, longitude: 0 }

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false)

  const [routeLines, setRouteLines] = useState<Location[]>([])

  const [initialPosition, setInitialPosition] = useState<Location>(initialState)

  const [userLocation, setUserLocation] = useState<Location>(initialState)

  const watchId = useRef<number>()
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  
  useEffect(() => {

    getCurrentLocation()
      .then(location => {
        if (!isMounted.current) return;
        setInitialPosition(location)
        setUserLocation(location)
        setRouteLines( (routes) => [...routes, location] )
        setHasLocation(true)
      })
      
  }, [])


  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
    
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude
          })
        },
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    })
  }

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({ coords }) => {
        const location: Location = {
          latitude: coords.latitude,
          longitude: coords.longitude
        }

        setUserLocation(location)
        setRouteLines( (routes) => [...routes, location] )
      },
      console.log,
      { enableHighAccuracy: true, distanceFilter: 10 }
    )
  }

  const stopFollowUserLocation = () => {
    if (watchId.current)
      Geolocation.clearWatch(watchId.current)
  }

  return {
    hasLocation,
    initialPosition,
    routeLines,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation
  }
}