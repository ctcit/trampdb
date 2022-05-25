import L, { LatLng } from "leaflet"
import  "leaflet-gpx"
import { Marker, useMap } from "react-leaflet"
import { ITramp, TrampDescriptionHtml, TrampGrade, TrampLatLngIfValid, TrampTimeOfYear, TrampType } from "../interfaces/ITramp";
import { TopoMap } from "./TopoMap"
import { RegionContext } from "../App"
import React, { useContext, useEffect } from "react"
import DOMPurify from "dompurify";
import { Badge } from "react-bootstrap";

interface IGPXProps {
  gpx: string
}
export const GPX = (props: IGPXProps) => {
  const map = useMap()
  useEffect(() => {
    map.whenReady(() => {
      const track = new L.GPX(props.gpx.trim(), {
        async:true,
        marker_options: {
          startIconUrl: '/pin-icon-start.png',
          endIconUrl: '/pin-icon-end.png',
          shadowUrl: '/pin-shadow.png'
        }
      })
      .on("loaded", (e) => {
        console.log(e.target)
        map.fitBounds(e.target.getBounds())
      }).on('error', function(e) {
        console.log('Error loading file: ' + e.target.error);
      }).addTo(map)
    })
  }, [map])

  return null
}

interface ITrampProps {
  tramp: ITramp
  gpxs: string[]
}
export const Tramp = ( props: ITrampProps ) : JSX.Element  => {
  const regions = useContext(RegionContext)

  const tramp = props.tramp
  const latLng = TrampLatLngIfValid(props.tramp)
  const region = (regions) ? regions.find((region) => region.id == tramp.region) : undefined
  return <div>
          <h1>{tramp.name}</h1>
          <div className="pb-1">{(tramp.caveats != '') && tramp.caveats.split(',').map(c => <Badge bg="success" className="mx-1" key={c}>{c}</Badge>) }</div>
          <p><i>{tramp.summary}</i></p>
          <dl>
            <dt>Grade</dt>
            <dd>{TrampGrade(tramp)}
            </dd>
            <dt>Time Of Year</dt>
            <dd>{TrampTimeOfYear(tramp)}
            { (tramp.seasonalityDescription !== "") && <>. <i>{tramp.seasonalityDescription}</i></> }
            </dd>
            <dt>Type</dt>
            <dd>{TrampType(tramp)}</dd>
            <dt>Approximate length</dt>
            <dd>{tramp.length} km</dd>
            {region && <React.Fragment>
            <dt>Region</dt>
            <dd>{region.name}</dd></React.Fragment>
            }
          </dl>
          <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(TrampDescriptionHtml(tramp))}}/>
          { latLng && (
           <TopoMap style={{height: '600px'}} className="mb-4" zoom={13} latLng={latLng}>
            <Marker position={latLng}/>
            { props.gpxs.map((gpx, i) => <GPX gpx={gpx} key={"gpx"+i}/>)}
           </TopoMap>
          ) }
        </div>
}
