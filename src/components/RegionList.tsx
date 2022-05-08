import { useContext } from "react"
import { Link } from "react-router-dom"
import { RegionContext } from "../App"

interface IRegionListProps{

}

export const RegionList = ( props: IRegionListProps)  => {
  const regions = useContext(RegionContext)

  if (regions === undefined) {
    return <p>Loading..</p>
  } else {
    return (
      <div>
        {regions.map((region) =>
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/region/${region.id}`}
            key={region.id.toString()}
          >
          {region.name}
          </Link>
        )}
      </div>
    )
  }
}