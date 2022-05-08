import axios from "axios";
import { BaseURL } from "../config"
import IRegion from "../interfaces/IRegion";

class RegionDataService{

    tramp_api = axios.create({
        baseURL: BaseURL,
        headers: {
            "Content-type": "application/json"
        }
    })

    async getAll() : Promise<IRegion[] | undefined> {
        try {
            const response = await this.tramp_api.get('/regions')
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

}

export default new RegionDataService()