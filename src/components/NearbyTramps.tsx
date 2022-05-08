import { ITripReport } from "../interfaces/ITripReport";
import { Table } from "react-bootstrap"
import { Link } from "react-router-dom";
import { ITramp } from "../interfaces/ITramp";


interface INearbyTrampsProps {
  tramps: ITramp[]
}
export const NearbyTramps = ( props: INearbyTrampsProps ) : JSX.Element  => {
  return (
    <div className="py-3">
      <Table striped hover>
        <tbody>
        {props.tramps.map((tramp) =>
            <tr key={'tramp'+tramp.id}>
              <td>
                <Link
                  style={{ display: "block", margin: "1rem 0" }}
                  to={`/tramp/${tramp.id}`}
                  key={tramp.id.toString()}
                >
                  {tramp.name}
                  </Link>
                </td>
            </tr>
        )}
        </tbody>
      </Table>
    </div>
  )
}
