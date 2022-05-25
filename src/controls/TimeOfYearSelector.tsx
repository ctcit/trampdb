import { Form } from "react-bootstrap"

export interface ITimeOfYearSelectorProps {
  handleSeasonalityChanged: React.ChangeEventHandler<HTMLInputElement>
  goodInSummer: boolean
  goodInWinter: boolean
}

export const TimeOfYearSelector = (props: ITimeOfYearSelectorProps) => {
    return <>
        <Form.Check
            type={"radio"}
            name="timeOfYear"
            label={"Best in Summer"}
            id={`summerOnly`}
            checked={props.goodInSummer && !props.goodInWinter}
            onChange={e => props.handleSeasonalityChanged(e)}
        />
        <Form.Check
            type={"radio"}
            name="timeOfYear"
            label={"Better in Winter"}
            id={`winterOnly`}
            checked={!props.goodInSummer && props.goodInWinter}
            onChange={e => props.handleSeasonalityChanged(e)}
        />
        <Form.Check
            type={"radio"}
            name="timeOfYear"
            label={"Great at any time of year"}
            id={`anyTimeOfYear`}
            checked={props.goodInSummer && props.goodInWinter}
            onChange={e => props.handleSeasonalityChanged(e)}
        />
    </>
}