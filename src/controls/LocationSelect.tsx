import { LatLng, LeafletMouseEvent } from "leaflet"
import { FC, useState } from "react"
import { Form } from "react-bootstrap"
import { useMapEvents, Marker } from "react-leaflet"
import { TopoMap } from "../components/TopoMap"

interface ILocationMarkerProps {
  onLocationChange: (latLng: LatLng) => void
  latLng?: LatLng
}
const LocationMarker = (props: ILocationMarkerProps ) => {
  const [position, setPosition] = useState<LatLng|undefined>(props.latLng)
  const map = useMapEvents({
    click(event: LeafletMouseEvent) {
      setPosition(event.latlng)
      props.onLocationChange(event.latlng)
    },
  })

  return position === undefined ? null : (
    <Marker position={position}/>
  )
}

export interface ILocationSelectProps {
  onChange: (latLng: LatLng) => void
  latLng?: LatLng
}

export const LocationSelect : FC<ILocationSelectProps> = (props) => {
  const zoom: number = props.latLng ? 13 : 9
  return (
    <Form.Group>
      <Form.Label>Select approximate location</Form.Label>
      <TopoMap style={{height: '600px'}} className="mb-4" zoom={zoom} latLng={props.latLng}>
         <LocationMarker onLocationChange={props.onChange} latLng={props.latLng}/>
      </TopoMap>
    </Form.Group>
  )
}