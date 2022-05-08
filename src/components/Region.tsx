import React, { useContext } from "react"
import { useState } from "react"
import { Table } from "react-bootstrap"
import { Link, RouteProps } from "react-router-dom"
import IRegion from "../interfaces/IRegion"
import { ITramp } from "../interfaces/ITramp";
import TrampDataService from '../utilities/tramp.service'

interface IRegionProps extends RouteProps {
  region: IRegion
}

export const Region = ( props: IRegionProps) : JSX.Element  => {
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
        <h1>{props.region.name}</h1>
        <Table>
          <thead>
            <th>Name</th>
            <th>Type</th>
            <th>Grade</th>
          </thead>
          <tbody>
            {tramps.filter((tramp) => tramp.region == props.region.id).map((tramp) =>
              <tr>
                <td>
                  <Link
                    to={`/tramp/${tramp.id}`}
                    key={tramp.id.toString()}
                  >
                    {tramp.name}
                  </Link>
                </td>
                <td>{tramp.type}</td>
                <td>{tramp.grades}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }
}