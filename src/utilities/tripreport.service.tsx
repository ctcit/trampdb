import axios from "axios";
import { BaseURL } from "../config"
import IRegion from "../interfaces/IRegion";
import { ITripReport } from "../interfaces/ITripReport";

class TripReportDataService{

    tramp_api = axios.create({
        baseURL: BaseURL,
        headers: {
            "Content-type": "application/json"
        }
    })

    async getAll() : Promise<ITripReport[] | undefined> {
        try {
            const response = await this.tramp_api.get('/tripreports?limit=99999')
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

}

export default new TripReportDataService()