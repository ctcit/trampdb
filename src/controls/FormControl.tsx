import { ElementType } from "react"
import { Form, InputGroup } from "react-bootstrap"

export interface IFormControlProps {
  id: string
  value: string | number
  label: string
  placeholder: string
  type?: ElementType<any>
  onChange: React.ChangeEventHandler<HTMLInputElement>
  inputType?: string
  groupClassName?: string
  controlClassName?: string
  labelClassName?: string
  rows?: number
  required?: boolean
  invalidMessage?: string
  append?: string
}

export const FormControl = (props : IFormControlProps) => {
    return <Form.Group controlId={props.id} className={props.groupClassName}>
        <Form.Label>{props.label}</Form.Label>
        <InputGroup>
            <Form.Control
                className={props.controlClassName}
                type={props.inputType}
                name={props.id}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                as={props.type}
                rows={props.rows}
                required={props.required} />
            {props.append && <InputGroup.Text>{props.append}</InputGroup.Text>}
            {props.invalidMessage && <Form.Control.Feedback type="invalid">{props.invalidMessage}</Form.Control.Feedback>}
        </InputGroup>
    </Form.Group>
}