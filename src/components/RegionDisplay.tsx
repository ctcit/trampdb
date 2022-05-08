import React, { useContext } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RegionContext } from "../App";
import { Region } from "./Region";

export const RegionDisplay = () : JSX.Element =>
{
  const regions = useContext(RegionContext)
  const params = useParams();
  const region = regions && params.id && regions.find((region)=>region.id.toString()==params.id)
  return (
    <React.Fragment>
      { (region) ? <Region region={region} /> : <p>Not found!</p> }
    </React.Fragment>
  )
}
