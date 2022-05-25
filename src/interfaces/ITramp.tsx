import { ContentState, convertFromRaw, convertToRaw, RawDraftContentState } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import { LatLng } from "leaflet"
import proj4 from "proj4"

const EPSG2193 = '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'

export interface ITramp
{
  id: number
  name: string
  summary: string
  routeDescription: string
  length: number
  timeLow: number
  timeHigh: number
  goodInSummer: boolean,
  goodInWinter: boolean,
  seasonalityDescription: string,
  access: string,
  caveats: string,
  gradeLow: string
  gradeHigh: string
  type: string
  northing: number
  easting: number
  region: number
}

export const EmptyTramp = () : ITramp => {
    return {
      id: 0,
      name:'',
      summary:'',
      routeDescription: '',
      length: 0,
      timeLow: 0,
      timeHigh: 0,
      goodInSummer:false,
      goodInWinter:false,
      seasonalityDescription:'',
      access:'',
      caveats:'',
      gradeLow:'',
      gradeHigh:'',
      type:'',
      northing: 0,
      easting: 0,
      region: 0,
    }
}

export const TrampLatLng = (tramp:ITramp) : LatLng => {
  if (tramp.northing === 0) {
    console.log("Lat Lng default")
    return new LatLng(-43.5495582523578, 172.64698390574108)
  }
  const latLng = proj4(EPSG2193, 'WGS84', [tramp.northing, tramp.easting])
  // proj4 uses the convention [longitude, latitude] for co-ordinate order
  console.log("Lat Lng " + latLng[1] + " " + latLng[0])
  return new LatLng(latLng[1], latLng[0])
}

export const SetTrampLatLng = (tramp:ITramp, latLng:LatLng) : ITramp => {
  // proj4 uses the convention [longitude, latitude] for co-ordinate order
  const northEast = proj4('WGS84', EPSG2193, [latLng.lng, latLng.lat])
  tramp.northing = northEast[0]
  tramp.easting = northEast[1]
  console.log("Set N E "+northEast[0]+" "+northEast[1]+" from "+latLng.lat+" "+latLng.lng)
  return tramp
}

export const TrampLatLngIfValid = (tramp:ITramp) : LatLng|undefined => {
  return (tramp.northing && tramp.easting) ? TrampLatLng(tramp) : undefined
}

export const TrampDescription = (tramp:ITramp) : RawDraftContentState => {
  try {
    const description = JSON.parse(tramp.routeDescription) as RawDraftContentState
    // This is to trigger an exception if the RawDraftContentState is invalid
    // so we can fall back to the code in catch
    convertFromRaw(description)
    return description
  } catch {
    return convertToRaw(ContentState.createFromText(tramp.routeDescription))
  }
}

export const TrampDescriptionHtml = (tramp:ITramp) => {
  return stateToHTML(convertFromRaw(TrampDescription(tramp)))
}

export const TrampGrade = (tramp: ITramp) => {
  let grade = tramp.gradeLow
  if (tramp.gradeHigh != "") {
    grade += " to "+tramp.gradeHigh
  }
  return grade
}

type TrampType = { label: string, value: string }
export const TrampTypes: TrampType[] = [
  { label: "Day", value: "day" },
  { label: "Overnight", value: "overnight" },
  { label: "Multiday", value: "multiday" },
  { label: "Base Camp", value: "basecamp" },
]

export const TrampType = (tramp: ITramp): string  => {
  var trampType = TrampTypes.find( t => t.value == tramp.type.toLowerCase() )
  if (!!trampType) {
    return trampType.label
  }
  return ""
}

export const TrampTimeOfYear = (tramp: ITramp) => {
  if (tramp.goodInSummer && !tramp.goodInWinter) {
    return "Better in Summer"
  } else if (!tramp.goodInSummer && tramp.goodInWinter) {
    return "Better in Winter"
  } else {
    return "Good at any time of year"
  }
}

export const TrampLengthRelevant = (tramp: ITramp) => {
  return (tramp.type != "basecamp")
}

export const TrampLengthUnits = (tramp: ITramp) => {
  return (tramp.type == "multiday") ? "days" : "hours"
}
