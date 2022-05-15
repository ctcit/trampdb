import { useEffect, useState } from "react"
import { Button, Form, Table } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { TripReportsUrl } from "../config"
import { ITramp } from "../interfaces/ITramp"
import { ITripReport } from "../interfaces/ITripReport"
import reportWebVitals from "../reportWebVitals"
import TrampDataService from '../utilities/tramp.service'
import tripreportService from "../utilities/tripreport.service"
import { LinkTrampTripReport } from "./LinkTrampTripReport"
import { TrampTripReports } from "./TrampTripReports"

export interface ICreateFromTripReportsProps {
}

class TripReportGroup {
    reports: ITripReport[]

    constructor(reports:ITripReport[]) {
        this.reports = reports
    }

    count() {
        return this.reports.length
    }

    label() {
        return this.count()>0 ? `${this.reports[0].title}` : "Empty Group"
    }
}

export const CreateFromTripReports = ( props: ICreateFromTripReportsProps ) => {
    const [titleFilter, setTitleFilter] = useState(new RegExp(''))
    const [allTripReports, setAllTripReports] = useState([] as ITripReport[])
    const [groupedTripReports, setGroupedTripReports] = useState([] as TripReportGroup[])
    const navigate = useNavigate();

    useEffect(() => {
        tripreportService.getAll().then(retrievedTripReports => {
            if (retrievedTripReports) {
                setAllTripReports(retrievedTripReports)
                processTripReports(retrievedTripReports)
            }
        })
    }, [])

    const processTripReports = (tripReports: ITripReport[]) => {
        const ignore = ['the', 'and', 'to', 'trip']
        const summary = tripReports.map((tr): {id:number, words:string[], report:ITripReport} => {
            return {
                id: tr.id,
                words: tr.title.toLowerCase().split(' ').filter((word) => !ignore.includes(word)),
                report: tr
            }
        })
        const usedIds = allTripReports.map((tripReport) => tripReport.id)
        const groups:TripReportGroup[] = []

        summary.forEach( (tripReport) => {
            if (!usedIds.includes(tripReport.id)) {
                const reports: ITripReport[] = [tripReport.report]
                usedIds.push(tripReport.id)
                summary.forEach( (otherTripReport) => {
                    if (!usedIds.includes(otherTripReport.id)) {
                        const union = new Set( tripReport.words.concat( otherTripReport.words ) ).size
                        const intersection: number = tripReport.words.filter(x => otherTripReport.words.includes(x)).length
                        const overlap = (union) ? intersection / union : 0
                        if (overlap > 0.75) {
                            usedIds.push(otherTripReport.id)
                            reports.push(otherTripReport.report)
                        }
                    }
                })
                groups.push(new TripReportGroup(reports))
            }
        })
        groups.sort((a, b) => b.count() - a.count() )
        setGroupedTripReports(groups)
    }

    const handleFilterChanged : React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setTitleFilter(new RegExp(event.target.value, 'i'))
    }

    const tripReportsFilter = (group: TripReportGroup) => {
        return group.reports[0].title.search(titleFilter) >= 0
    }

    return (
        <div>
            <h3>Grouped Trip Reports</h3>
            <Form.Control name="titleFiler" placeholder="Search" onChange={handleFilterChanged} />
            {groupedTripReports.filter(tripReportsFilter).map((group) =>
                <div key={group.reports[0].id}>
                    <h4>{group.label()}</h4>
                    <Table >
                        <tbody>
                            {group.reports.map((tripreport) =>
                                <tr key={tripreport.id}>
                                    <td><a href={TripReportsUrl + tripreport.id}>{tripreport.title}</a></td>
                                    <td>{tripreport.date_display}</td>
                                    <td>{tripreport.uploader_name}</td>
                                    <td>{tripreport.tramps.map((id) =>
                                        <Button onClick={() => navigate('/tramp/' + id)} key={id}>{id}</Button>
                                    )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    )
}