import axios from "axios";
import { BaseURL } from "../config"
import { ITramp } from "../interfaces/ITramp";
import { ITripReport } from "../interfaces/ITripReport";

class TrampDataService{

    tramp_api = axios.create({
        baseURL: BaseURL,
        headers: {
            "Content-type": "application/json"
        }
    })

    async getAll() : Promise<ITramp[] | undefined> {
        try {
            const response = await this.tramp_api.get('/tramps')
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async get(id: number) : Promise<ITramp | undefined> {
        try {
            const response = await this.tramp_api.get('/tramps/'+id)
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async getNearby(id: number) : Promise<ITramp[] | undefined> {
        try {
            const response = await this.tramp_api.get('/tramps/'+id+'/nearby')
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async getTripReports(id: number) : Promise<ITripReport[] | undefined> {
        try {
            const response = await this.tramp_api.get('/tramps/'+id+'/tripreports')
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async create(tramp: ITramp) : Promise<ITramp|undefined> {
        try {
            const response = await this.tramp_api.post('/tramps', tramp)
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async update(tramp: ITramp) : Promise<ITramp|undefined> {
        try {
            const response = await this.tramp_api.patch('/tramps/'+tramp.id, tramp)
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async linkTrampTripReport(tramp_id: number, tripreport_id: number) : Promise<ITripReport[] | undefined> {
        try {
            const response = await this.tramp_api.post('/tramps/'+tramp_id+'/tripreports', {id: tripreport_id})
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async unlinkTrampTripReport(tramp_id: number, tripreport_id: number) : Promise<ITripReport[] | undefined> {
        try {
            const response = await this.tramp_api.delete('/tramps/'+tramp_id+'/tripreports/'+tripreport_id)
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }

    async delete(tramp: ITramp) : Promise<ITramp|undefined> {
        try {
            const response = await this.tramp_api.delete('/tramps/'+tramp.id)
            // PENDING - check status code
            return response.data;
        } catch( error ) {
            console.log(error);
        }
        return undefined;
    }
}

export default new TrampDataService()