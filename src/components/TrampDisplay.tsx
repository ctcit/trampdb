import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ITramp } from "../interfaces/ITramp";
import { ITripReport } from "../interfaces/ITripReport";
import TrampDataService from '../utilities/tramp.service'
import { NearbyTramps } from "./NearbyTramps";
import { Tramp } from "./Tramp";
import { TrampTripReports } from "./TrampTripReports";

export const TrampDisplay = () : JSX.Element =>
{
  const [tramp, setTramp] = useState({} as ITramp)
  const [tripReports, setTripReports] = useState([] as ITripReport[])
  const [nearbyTramps, setNearbyTramps] = useState([] as ITramp[])
  const [gpxs, setGPXs] = useState([] as string[])
  const [status, setStatus] = useState('loading')
  const params = useParams();
  const navigate = useNavigate();

  const id = (params.id) ? parseInt(params.id) : undefined

  React.useEffect( () => {
      if (id) {
          setStatus('loading')
          TrampDataService.get(id).then((retrievedTramp: ITramp | undefined) => {
              if ( retrievedTramp ) {
                setTramp(retrievedTramp)
                setStatus('loaded')
              } else {
                setStatus('failed')
              }
          })
      }
  }, [id] )

  React.useEffect( () => {
      const id = (params.id) ? parseInt(params.id) : undefined
      if (id) {
          TrampDataService.getTripReports(id).then((retrievedTripReports: ITripReport[] | undefined) => {
            if(retrievedTripReports) {
              setTripReports(retrievedTripReports)
              let gpxs: string[] = []
              retrievedTripReports.forEach((tripreport) => {
                tripreport.gpxs.forEach(gpx => {
                  gpxs.push(gpx.gpx)
                })
              })
              setGPXs(gpxs)
            }
          })
      }
  }, [id] )

  React.useEffect( () => {
      const id = (params.id) ? parseInt(params.id) : undefined
      if (id) {
          TrampDataService.getNearby(id).then((retrievedTramps: ITramp[] | undefined) => {
              if (retrievedTramps) {
                setNearbyTramps(retrievedTramps)
              } else {
              }
          })
      }
  }, [id] )

  const onDelete = () => {
    TrampDataService.delete(tramp).then( () => {
      navigate('/')
    } )
  }

  if (status == 'loading') {
      return <p>Loading</p>
  } else if (status == 'failed') {
      return <p>Not found</p>
  }

  return (
    <React.Fragment>
      <Tramp tramp={tramp} gpxs={gpxs}/>
      { nearbyTramps.length > 0 &&
        <>
          <h3>Nearby Tramps</h3>
          <NearbyTramps tramps={nearbyTramps}/>
        </>
      }
      <h3>Linked Trip Reports</h3>
      <TrampTripReports tripReports={tripReports}/>
      <Button onClick={() => navigate('/edit/' + tramp.id)}>Edit</Button>
      <Button className="mx-2" onClick={onDelete} variant='danger'>Delete</Button>
    </React.Fragment>
  )
}
