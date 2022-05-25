import { FC } from "react"
import { Form } from "react-bootstrap"

export interface IFormSelectProps {
  id: string
  label: string
  value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  controlClassName?: string
  required?: boolean
  invalidMessage?: string
}

export const FormSelect : FC<IFormSelectProps> = (props, children) => {
  return (
  <Form.Group controlId={props.id} className="mb-3">
    <Form.Label>{props.label}</Form.Label>
    <Form.Select
      className={props.controlClassName}
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