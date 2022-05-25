import { LatLng } from "leaflet"
import { Marker, Popup } from "react-leaflet"
import { Link } from "react-router-dom"
import { defaultLat, defaultLong } from "../config"
import { ITramp, TrampGrade, TrampLatLng } from "../interfaces/ITramp"
import { TopoMap } from "./TopoMap"

interface ITrampLocationsMapProps {
    tramps: ITramp[]
}

export const TrampLocationsMap = (props:ITrampLocationsMapProps) => {
    const trampsWithLocation = props.tramps.filter( (tramp) => tramp.northing && tramp.easting)
    const mapCentre = new LatLng(defaultLat, defaultLong)
    if (trampsWithLocation.length > 0) {
        mapCentre.lat = trampsWithLocation.reduce( (sumLat, tramp) => sumLat + TrampLatLng(tramp).lat, 0 ) / trampsWithLocation.length
        mapCentre.lng = trampsWithLocation.reduce( (sumLong, tramp) => sumLong + TrampLatLng(tramp).lng, 0 ) / trampsWithLocation.length
    }
    // PENDING - figure out zoom programatically
    const markers = trampsWithLocation.map( (tramp) => {
        return (
            <Marker position={TrampLatLng(tramp)} key={"trampmarker" + tramp.id}>
                <Popup>
                    <Link to={"/tramp/" + tramp.id}><h3>{tramp.name}</h3></Link>
                    {TrampGrade(tramp)}, {tramp.length} km
                </Popup>
            </Marker>
            ) } )
    return (
           <TopoMap style={{height: '600px', width:'100%'}} className="mb-4" zoom={9} latLng={mapCentre}>
           {markers}
           </TopoMap>
    )
}