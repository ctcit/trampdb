import React from "react"
import { useState } from "react"
import { Link, RouteProps } from "react-router-dom"
import { ITramp } from "../interfaces/ITramp";
import TrampDataService from '../utilities/tramp.service'
import { TrampLocationsMap } from "./TrampLocationsMap"

interface ITrampListProps extends RouteProps {
  title: string
}

interface ITrampSummaryProps {
  tramp: ITramp
}

export const TrampSummary = ( props: ITrampSummaryProps ) : JSX.Element  => {
  const tramp = props.tramp
  return <div>
          <h2>{tramp.name}</h2>
        </div>
}

export const TrampList = ( props: ITrampListProps) : JSX.Element  => {
  const [tramps, setTramps] = useState([] as ITramp[])
  const [status, setStatus] = useState('loading')

    React.useEffect(() => {
        TrampDataService.getAll().then((retrievedTramp: ITramp[] | undefined) => {
            if (retrievedTramp) {
                setTramps(retrievedTramp)
                setStatus('loaded')
            } else {
                setStatus('failed')
            }
        })
    }, [])

  if (status == 'loading') {
    return <p>Loading..</p>
  } else if (status == 'failed') {
    return <p>Uh oh!</p>
  } else {
    return (
      <div>
        <TrampLocationsMap tramps={tramps} />
        {tramps.map((tramp) =>
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/tramp/${tramp.id}`}
            key={tramp.id.toString()}
          >
            <TrampSummary tramp={tramp} />
          </Link>
        )}
      </div>
    )
  }
}