import { useEffect, useState } from "react"
import { Form, Table, Button } from "react-bootstrap"
import { ITramp } from "../interfaces/ITramp"
import { ITripReport } from "../interfaces/ITripReport"
import { Link } from 'react-bootstrap-icons';
import trampService from "../utilities/tramp.service";


export interface ILinkTrampTripReportProps {
    tramp: ITramp
    allTripReports: ITripReport[]
    linkedTripReports: ITripReport[]
    handleTripReportLinked: (tripReport: ITripReport) => void
}

export const LinkTrampTripReport = (props: ILinkTrampTripReportProps) => {
    const [titleFilter, setTitleFilter] = useState(new RegExp(''))

    const handleFilterChanged : React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setTitleFilter(new RegExp(event.target.value, 'i'))
    }

    const handleLinkClick = (tripReport: ITripReport) => {
        trampService.linkTrampTripReport(props.tramp.id, tripReport.id)
        props.handleTripReportLinked(tripReport)
    }

    const tripReportsFilter = (tripReport: ITripReport) => {
        return !props.linkedTripReports.some((linkedTripReport) => tripReport.id == linkedTripReport.id) &&
               tripReport.title.search(titleFilter) >= 0
    }

    return (
        <>
            <Form.Control name="titleFiler" placeholder="Search" onChange={handleFilterChanged}/>
            <div className="overflow-auto" style={{maxHeight: '500px'}}>
                <Table >
                    <tbody>
                        {props.allTripReports.filter(tripReportsFilter)
                            .map((tripreport) =>
                                <tr key={tripreport.id}>
                                    <td>{tripreport.title}</td>
                                    <td>{tripreport.date_display}</td>
                                    <td>{tripreport.uploader_name}</td>
                                    <td><Button onClick={(event) => handleLinkClick(tripreport)}><Link /></Button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
        </>
    )
}