import React, { useEffect, useRef, useState } from 'react'
import MapView, { MapMarker, Marker, Polyline } from 'react-native-maps'
import { useLocation } from '../hooks/useLocation'
import { LoadingScreen } from '../pages/LoadingScreen'
import { FAB } from './FAB'


interface Props {
  markers?: MapMarker[]
}

export const Map = ({ markers }: Props) => {

  const [showPolyline, setShowPolyline] = useState(true)
  
  const {
    hasLocation,
    initialPosition,
    userLocation,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    routeLines
  } = useLocation()

  const mapViewRef = useRef<MapView>()
  const following = useRef<boolean>(true)

  useEffect(() => {
    followUserLocation()
    return () => {
      stopFollowUserLocation()
    }
  }, [])

  useEffect(() => {
    if (!following.current) return;

    const { latitude, longitude } = userLocation

    mapViewRef.current?.animateCamera({
      center: { latitude, longitude }
    })
  }, [userLocation])

  const centerPosition = async () => {
    const { latitude, longitude } = await getCurrentLocation()

    mapViewRef.current?.animateCamera({
      center: { latitude, longitude }
    })

    following.current = true
  }

  if (!hasLocation) return <LoadingScreen />

  return (
    <>
      <MapView
        ref={(el) => mapViewRef.current = el!}
        showsUserLocation
        style={{ flex: 1 }}
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => following.current = false}
      >
        {
          showPolyline && (
            <Polyline
              coordinates={routeLines}
              strokeColor='blue'
              strokeWidth={3}
            />
          )
        }

        {/* <Marker
          image={require('../assets/custom-marker.png')}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title='Es un titulo'
          description='Descripcion del marker'
        /> */}
      </MapView>

      <FAB  
        iconName='compass-outline'
        onPress={centerPosition}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10
        }}
      />

      <FAB  
        iconName='map-outline'
        onPress={() => setShowPolyline(!showPolyline)}
        style={{
          position: 'absolute',
          bottom: 80,
          right: 10
        }}
      />
    </>
  )
}