import { LatLng, LeafletMouseEvent } from "leaflet"
import React, { ElementType, FC, useContext, useState } from "react"
import { Form, Button } from "react-bootstrap"
import { Marker, useMapEvents } from "react-leaflet"
import { RegionContext } from "../App"
import { ITramp, EmptyTramp, TrampLatLngIfValid, SetTrampLatLng, TrampDescription } from "../interfaces/ITramp";
import { TopoMap } from "./TopoMap"
import { Editor, EditorState } from 'react-draft-wysiwyg';
import { convertFromRaw, RawDraftContentState } from 'draft-js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface IFormControlProps {
  id: string
  value: string
  label: string
  placeholder: string
  type?: ElementType<any>
  onChange: React.ChangeEventHandler<HTMLInputElement>
  inputType?: string
  className?: string
  rows?: string
  required?: boolean
  invalidMessage?: string
}

const FormControl = (props : IFormControlProps) => {
  return (
  <Form.Group controlId={props.id} className="mb-3">
    <Form.Label>{props.label}</Form.Label>
    <Form.Control
      className={props.className}
      type={props.inputType}
      name={props.id}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      as={props.type}
      rows={props.rows}
      required={props.required}
    />
      {props.invalidMessage && <Form.Control.Feedback type="invalid">{props.invalidMessage}</Form.Control.Feedback>}
  </Form.Group>
  )
}

interface IFormSelectProps {
  id: string
  label: string
  value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  className?: string
  required?: boolean
  invalidMessage?: string
}

const FormSelect : FC<IFormSelectProps> = (props, children) => {
  return (
  <Form.Group controlId={props.id} className="mb-3">
    <Form.Label>{props.label}</Form.Label>
    <Form.Select
      className={props.className}
      name={props.id}
      value={props.value}
      onChange={props.onChange}
      required={props.required}
      >
        <option></option>
        {props.children}
      </Form.Select>
      {props.invalidMessage && <Form.Control.Feedback type="invalid">{props.invalidMessage}</Form.Control.Feedback>}
  </Form.Group>
  )
}

interface ILocationMarkerProps {
  onLocationChange: (latLng: LatLng) => void
  latLng?: LatLng
}
const LocationMarker = (props: ILocationMarkerProps ) => {
  const [position, setPosition] = useState<LatLng|undefined>(props.latLng)
  const map = useMapEvents({
    click(event: LeafletMouseEvent) {
      setPosition(event.latlng)
      props.onLocationChange(event.latlng)
    },
  })

  return position === undefined ? null : (
    <Marker position={position}/>
  )
}

interface ILocationSelectProps {
  onChange: (latLng: LatLng) => void
  latLng?: LatLng
}

const LocationSelect : FC<ILocationSelectProps> = (props) => {
  const zoom: number = props.latLng ? 13 : 9
  return (
    <Form.Group>
      <Form.Label>Select approximate location</Form.Label>
      <TopoMap style={{height: '600px'}} className="mb-4" zoom={zoom} latLng={props.latLng}>
         <LocationMarker onLocationChange={props.onChange} latLng={props.latLng}/>
      </TopoMap>
    </Form.Group>
  )
}

interface IDescriptionEditorProps {
  description: RawDraftContentState | undefined
  onStateChanged: (contentState: RawDraftContentState) => void
}

const DescriptionEditor = (props: IDescriptionEditorProps) => {
  return <Editor
         initialContentState={props.description}
         onContentStateChange={props.onStateChanged} />
}

interface ITrampFormProps {
  tramp?: ITramp
  submitLabel: string
  handleOnSubmit: (tramp: ITramp) => void
}


export const TrampForm = ( props: ITrampFormProps ) : JSX.Element  => {
  const regions = useContext(RegionContext)
  const [tramp, setTramp] = useState(props.tramp ? props.tramp : EmptyTramp())
  //const [validationMsgs, setValidationMsgs] = useState(
  //  Object.keys(tramp).map((key) => [key, '']))
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
      route_description: JSON.stringify(description)
    }))
  }

  const latLng = TrampLatLngIfValid(tramp)

  //const initialDescription = ( props.tramp !== undefined ) ? props.tramp.route_description : {} as RawDraftContentState

      /* <FormControl type="textarea" rows="10" id="route_description" label="Description" required invalidMessage="Must enter a description"
       value={tramp.route_description} placeholder="Detailed route description and any other useful information such as access permissions needed" onChange={handleInputChanged} /> */

  return (
    <Form noValidate validated={validated} onSubmit={handleOnSubmit}>
      <FormControl id="name" label="Name" value={tramp.name} required
        placeholder="Name of the tramp" onChange={handleInputChanged} invalidMessage="Name is required"/>
      <FormControl id="summary" label="Summary" value={tramp.summary}
        placeholder="A brief summary" onChange={handleInputChanged} />
      <DescriptionEditor description={TrampDescription(tramp)} onStateChanged={handleDescriptionChanged} />
      <FormSelect label="Grade" id="grades" value={tramp.grades} onChange={handleSelectChanged} required>
        <option>Easy</option>
        <option>Moderate</option>
        <option>Hard</option>
      </FormSelect>
      <FormSelect label="Type" id="type" value={tramp.type} onChange={handleSelectChanged} required>
        <option>Day</option>
        <option>Weekend</option>
        <option value="multiday">Multiday</option>
        <option value="basecamp">Base Camp</option>
      </FormSelect>
      <FormSelect label="Region" id="region" value={tramp.region.toString()} onChange={handleSelectChanged} required
       invalidMessage="Must select a region">
      { regions && regions.map((region) => <option value={region.id.toString()} key={"region"+region.id}>{region.name}</option>) }
      </FormSelect>
      <FormControl inputType="number" id="length" label="Length" value={tramp.length}
        placeholder="Approximate length in km" onChange={handleInputChanged} />
      <LocationSelect onChange={handleLocationChanged} latLng={latLng}/>
      <Button type="submit" variant="primary">{props.submitLabel}</Button>
    </Form>
  )
}
