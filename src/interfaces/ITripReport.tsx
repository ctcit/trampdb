
export interface IGPX
{
    id: number
    name: string
    gpx: string
}

export interface ITripReport
{
  id: number
  title: string
  date_display: string
  uploader_name: string
  gpxs: IGPX[]
}
