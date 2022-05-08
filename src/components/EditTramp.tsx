import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditTrampTripReports } from "./EditTrampTripReports";
import { ITramp } from "../interfaces/ITramp";
import TrampDataService from '../utilities/tramp.service'
import { TrampForm } from "./TrampForm";

export const EditTramp = () : JSX.Element => {

  const navigate = useNavigate();
  const [tramp, setTramp] = useState({} as ITramp)
  const [status, setStatus] = useState('loading')
  const params = useParams();
  React.useEffect( () => {
      const id = (params.id) ? parseInt(params.id) : undefined
      if (id) {
          TrampDataService.get(id).then((retrievedTramp: ITramp | undefined) => {
              if ( retrievedTramp ) {
                setTramp(retrievedTramp)
                setStatus('loaded')
              } else {
                setStatus('failed')
              }
          })
      }
  }, [] )

  const handleOnSubmit = (tramp: ITramp): void => {
    TrampDataService.update(tramp).then(
      () => navigate('/tramp/'+tramp.id)
    )
  }

  if (status == 'loading') {
      return <p>Loading</p>
  } else if (status == 'loaded') {
    return (
    <React.Fragment>
      <TrampForm handleOnSubmit={handleOnSubmit} tramp={tramp} submitLabel="Save"/>
      <EditTrampTripReports tramp={tramp}/>
    </React.Fragment>
    )
  } else {
      return <p>Not found</p>
  }
}
