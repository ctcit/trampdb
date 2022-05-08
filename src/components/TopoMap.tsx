import { LatLng } from "leaflet"
import { FC } from "react"
import { MapContainer, TileLayer } from "react-leaflet"

interface ITopoMapProps {
    latLng?: LatLng
    zoom?: number
    className?: string
    style?: any
}

export const TopoMap : FC<ITopoMapProps> = (props) => {
    const latLng = props.latLng ?? new LatLng(-43.5, 172)
    const zoom = props.zoom ?? 9
    return (
        <MapContainer center={latLng} zoom={zoom} className={props.className} style={props.style}>
            <TileLayer
                attribution='<a href=“http://data.linz.govt.nz”>Sourced from LINZ. CC BY 4.0'
                url="http://tiles-{s}.data-cdn.linz.govt.nz/services;key=6076db4a13a14365905f8914ad7e3667/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png"
            />
            {props.children}
        </MapContainer>
    )
}