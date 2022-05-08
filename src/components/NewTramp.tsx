import { useNavigate, useParams } from "react-router-dom";
import { ITramp } from "../interfaces/ITramp";
import TrampDataService from '../utilities/tramp.service'
import { TrampForm } from "./TrampForm";

export const NewTramp = () : JSX.Element => {

  const navigate = useNavigate();

  const handleOnSubmit = (tramp: ITramp): void => {
    TrampDataService.create(tramp)
    navigate('/')
  }
  return <TrampForm handleOnSubmit={handleOnSubmit} submitLabel="Submit" />
}
