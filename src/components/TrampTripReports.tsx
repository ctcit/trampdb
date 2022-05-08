import { ITripReport } from "../interfaces/ITripReport";
import { TripReportsUrl } from "../config"
import { Button, Table } from "react-bootstrap"


interface ITrampTripReportProps {
  tripReports: ITripReport[]
  deleteFunction?: (triprportId: number) => void
}
export const TrampTripReports = ( props: ITrampTripReportProps ) : JSX.Element  => {
  const handleDelete = (id: number) => {
    if (props.deleteFunction) {
      props.deleteFunction(id)
    }
  }
  return (
    <div className="py-3">
      <Table striped hover>
        <tbody>
        {props.tripReports.map((tripreport) =>
            <tr key={'tripreport'+tripreport.id}>
              <td><a href={TripReportsUrl + tripreport.id}>{tripreport.title}</a></td>
              <td>{tripreport.date_display}</td>
              <td>{tripreport.uploader_name}</td>
              { props.deleteFunction &&
                <td><Button variant="danger" onClick={() => handleDelete(tripreport.id)}>Delete</Button></td>
              }
            </tr>
        )}
        </tbody>
      </Table>
    </div>
  )
}
