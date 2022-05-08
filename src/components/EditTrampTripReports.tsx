import { useEffect, useState } from "react"
import { ITramp } from "../interfaces/ITramp"
import { ITripReport } from "../interfaces/ITripReport"
import TrampDataService from '../utilities/tramp.service'
import tripreportService from "../utilities/tripreport.service"
import { LinkTrampTripReport } from "./LinkTrampTripReport"
import { TrampTripReports } from "./TrampTripReports"

export interface IEditTrampTripReportsProps {
    tramp: ITramp
}

export const EditTrampTripReports = ( props: IEditTrampTripReportsProps ) => {
    const [tripReports, setTripReports] = useState([] as ITripReport[])
    const [allTripReports, setAllTripReports] = useState([] as ITripReport[])
    useEffect(() => {
        const id = props.tramp.id
        TrampDataService.getTripReports(id).then((retrievedTripReports: ITripReport[] | undefined) => {
            if (retrievedTripReports) {
                setTripReports(retrievedTripReports)
            }
        } )
    }, [props.tramp] )

    useEffect(() => {
        tripreportService.getAll().then(retrievedTripReports => {
            if (retrievedTripReports) {
                setAllTripReports(retrievedTripReports)
            }
        })
    }, [])

    const unlinkTripReport = (id: number) => {
        console.log("delete "+id)
        TrampDataService.unlinkTrampTripReport(props.tramp.id, id).then((tripReports) => {
            if (tripReports !== undefined) {
                setTripReports(tripReports)
            }
        })
    }

    const handleTripReportLinked = (tripReport: ITripReport) => {
        setTripReports([tripReport, ...tripReports])
    }

    return (
        <div>
            <h3>Linked Trip Reports</h3>
            <TrampTripReports tripReports={tripReports} deleteFunction={unlinkTripReport}/>
            <LinkTrampTripReport tramp={props.tramp} allTripReports={allTripReports}
                                handleTripReportLinked={handleTripReportLinked}
                                linkedTripReports={tripReports}/>
        </div>
    )
}