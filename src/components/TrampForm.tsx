import { LatLng } from "leaflet"
import React, { useContext, useState } from "react"
import { Form, Button, Row, InputGroup } from "react-bootstrap"
import { RegionContext } from "../App"
import { ITramp, EmptyTramp, TrampLatLngIfValid, SetTrampLatLng, TrampDescription, TrampLengthUnits, TrampLengthRelevant } from "../interfaces/ITramp";
import { DescriptionEditor } from "./DescriptionEditor"
import { RawDraftContentState } from "draft-js"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FormControl } from "../controls/FormControl"
import { FormSelect } from "../controls/FormSelect"
import { LocationSelect } from "../controls/LocationSelect";
import { CaveatsSelect } from "../controls/CaveatsSelect";
import { TimeOfYearSelector } from "../controls/TimeOfYearSelector";

interface ITrampFormProps {
  tramp?: ITramp
  submitLabel: string
  handleOnSubmit: (tramp: ITramp) => void
}

export const TrampForm = ( props: ITrampFormProps ) : JSX.Element  => {
  const regions = useContext(RegionContext)
  const [tramp, setTramp] = useState(props.tramp ? props.tramp : EmptyTramp())
  const [validated, setValidated] = useState(false)

  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const valid = form.checkValidity()
    setValidated(true);

    if (valid) {
      props.handleOnSubmit(tramp)
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleInputChanged: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target
    setTramp((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSelectChanged: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { name, value } = event.target
    const dummyTramp = EmptyTramp()
    let parsedValue: string|number  = value
    if (typeof dummyTramp[name as keyof ITramp] === 'number') {
      parsedValue = parseInt(value)
    }

    setTramp((prevState) => ({
      ...prevState,
      [name]: parsedValue
    }));
  }

  const handleLocationChanged = (latLng: LatLng) => {
    console.log("Lat "+latLng.lat+" Long "+latLng.lng)
    setTramp((prevState) => SetTrampLatLng(prevState, latLng) );
  }

  const handleDescriptionChanged = (description: RawDraftContentState) => {
    setTramp((prevState) => ({
      ...prevState,
      routeDescription: JSON.stringify(description)
    }))
  }

  const handleLengthIsRangeChanged: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.checked
    console.log(value)
    setTramp((prevState) => ({
      ...prevState,
      timeHigh: (value) ? 0 : -1
    }));
  }

  const latLng = TrampLatLngIfValid(tramp)
  const handleStyle:React.CSSProperties = {width:20, height:20}
  const markStyle:React.CSSProperties = {
    fontSize: "var(--bs-body-font-size)",
    color: "var(--bs-body-color)"
  }

  const marks:any = {
    0: {
      style: markStyle,
      label: 'Easy'
    },
    2: {
      style: markStyle,
      label: 'Moderate'
    },
    4: {
      style: markStyle,
      label: 'Hard'
    },
  }

  const gradeMap = new Map<string, number>([
    ["Easy", 0],
    ["Easy-Moderate", 1],
    ["Moderate", 2],
    ["Moderate-Hard", 3],
    ["Hard", 4],
  ])

  const gradeText = (grade: number | undefined) : string => {
    if (grade !== undefined) {
      for(const [key, value] of gradeMap) {
        if (value == grade) {
          return key
        }
      }
    }
    return ""
  }

  const toGradeRange = (tramp:ITramp): number[]  => {
    const gradeLow = gradeMap.get(tramp.gradeLow)
    const gradeHigh = gradeMap.get(tramp.gradeHigh)
    if (gradeLow === undefined && gradeHigh !== undefined) {
      return [gradeHigh, gradeHigh]
    } else if (gradeHigh === undefined && gradeLow !== undefined) {
      return [gradeLow, gradeLow]
    } else if (gradeHigh !== undefined && gradeLow !== undefined) {
      return [gradeHigh, gradeLow]
    }
    return [2,2]
  }


  const handleGradeChanged = (grade: number|number[]) => {
    console.log(grade)
    if (Array.isArray(grade) && grade.length>1) {
      console.log(gradeText(grade[0]) + ' '+gradeText(grade[1]))
      setTramp((prevState) => ({
        ...prevState,
        gradeLow: gradeText(grade[0]),
        gradeHigh: gradeText(grade[1])
      }))
    } else if (typeof grade == "number") {
      console.log(gradeText(grade))
      setTramp((prevState) => ({
        ...prevState,
        gradeLow: gradeText(grade),
        gradeHigh: ""
      }))
    }
  }

  const handleSeasonalityChanged :React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value != 'on') {
      return
    }
    const selected = e.target.id
    if (selected == 'summerOnly') {
      setTramp((prevState) => ({
        ...prevState,
        goodInSummer: true,
        goodInWinter: false,
      }))
    } else if (selected == 'winterOnly') {
      setTramp((prevState) => ({
        ...prevState,
        goodInSummer: false,
        goodInWinter: true,
      }))
    } else if (selected == 'anyTimeOfYear') {
      setTramp((prevState) => ({
        ...prevState,
        goodInSummer: true,
        goodInWinter: true,
      }))
    }
  }

  const handleCaveatsChanged = (value: string) => {
    setTramp((prevState) => ({
      ...prevState,
      caveats: value
    }));
  }

  return (
    <Row className="justify-content-center">
      <Form noValidate validated={validated} onSubmit={handleOnSubmit} className="col-lg-9">
        <FormControl id="name" label="Name" value={tramp.name} required groupClassName="mb-4"
          placeholder="Name of the tramp" onChange={handleInputChanged} invalidMessage="Name is required" />
        <FormControl id="summary" label="Summary" value={tramp.summary} groupClassName="mb-4"
          placeholder="A brief summary" onChange={handleInputChanged} />
        <FormSelect label="Type" id="type" value={tramp.type} onChange={handleSelectChanged} required controlClassName="col-md-4">
          <option>Day</option>
          <option>Overnight</option>
          <option value="multiday">Multiday</option>
          <option value="basecamp">Base Camp</option>
        </FormSelect>
        <FormSelect label="Region" id="region" value={tramp.region.toString()} onChange={handleSelectChanged} required
          invalidMessage="Must select a region">
          {regions && regions.map((region) => <option value={region.id.toString()} key={"region" + region.id}>{region.name}</option>)}
        </FormSelect>
        <Form.Group className="mb-4">
          <Form.Label className="form-label">Description</Form.Label>
          <DescriptionEditor description={TrampDescription(tramp)} onStateChanged={handleDescriptionChanged} />
        </Form.Group>
        <Form.Group className="mb-4" >
          <Form.Label className="form-label">Grade</Form.Label>
          <div className="px-5 mb-5">
            <Slider range allowCross={true} min={0} max={4} value={toGradeRange(tramp)}
              onChange={handleGradeChanged}
              step={1} marks={marks}
              handleStyle={[handleStyle, handleStyle]} />
          </div>
          <CaveatsSelect value={tramp.caveats} handleValueChanged={handleCaveatsChanged} />
        </Form.Group>
        <FormControl id="access" label="Access Notes" value={tramp.access} type="textarea" groupClassName="mb-4"
          placeholder="Notes on any access permissions required" onChange={handleInputChanged} rows={3} />
        <Form.Group className="mb-4">
          <Form.Label className="form-label">Time Of Year</Form.Label>
          <Row>
            <div className="col-md-4">
              <TimeOfYearSelector goodInSummer={tramp.goodInSummer} goodInWinter={tramp.goodInWinter}
                handleSeasonalityChanged={handleSeasonalityChanged} />
            </div>
            <div className="col-md-8">
              <Form.Control
                name='seasonalityDescription'
                value={tramp.seasonalityDescription}
                placeholder={'Optionally enter some notes on what times of year this tramp is good at'}
                onChange={handleInputChanged}
                as='textarea'
                rows={2}
              />
            </div>
          </Row>
        </Form.Group>
        <Row>
          <FormControl inputType="number" id="length" label="Distance" value={tramp.length || ""} groupClassName="mb-4 col-md-6"
            placeholder="Approximate return distance" append={"km"} onChange={handleInputChanged} required />
          {TrampLengthRelevant(tramp) &&
            <Form.Group controlId="length" className="mb-4 col-md-6">
              <Form.Label>Length</Form.Label>
              <Form.Check
                className="d-inline-block mx-2"
                type="switch"
                id="lengthRange"
                label="Range"
                checked={(tramp.timeHigh != -1)}
                onChange={handleLengthIsRangeChanged}
              />
              <InputGroup>
                <Form.Control
                  className=""
                  type="number"
                  name="timeLow"
                  value={tramp.timeLow || ""}
                  placeholder=""
                  onChange={handleInputChanged}
                  required />
                { (tramp.timeHigh != -1 ) && <><InputGroup.Text>{" to"}</InputGroup.Text>
                <Form.Control
                  className=""
                  type="number"
                  name="timeHigh"
                  value={tramp.timeHigh || ""}
                  placeholder=""
                  onChange={handleInputChanged}
                  /></> }
                <InputGroup.Text>{TrampLengthUnits(tramp)}</InputGroup.Text>
                <Form.Control.Feedback type="invalid">Must enter at least one length</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          }
        </Row>
        <LocationSelect onChange={handleLocationChanged} latLng={latLng} />
        <Button type="submit" variant="primary">{props.submitLabel}</Button>
      </Form>
    </Row>
  )
}
