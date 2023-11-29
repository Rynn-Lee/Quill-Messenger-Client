"use client"
import React from 'react'
import styled from 'styled-components'

interface inputProps extends React.ComponentProps<"input"> {
  fancy?: any
  inputProps?: string
}

interface DataFancyComponentProps {
  datafancy: {
    text?: string
    hide?: boolean
    placeholder?: boolean
    position?: string
  };
  value?: string | any
}

const Label = styled.label<DataFancyComponentProps>`
  position: absolute;
  font-size: 13px;
  display: block;
  text-align: ${(props) => (props?.datafancy?.position ? props.datafancy.position : "center")};
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  opacity: 1;
  padding: 10px 0px;
  overflow: hidden;
  pointer-events: none;
  transition: var(--var-transition);
  color: #ffffff90;
  word-wrap: none;
  word-break: none;
  overflow: hidden;
`

const FancyInput = styled.input<DataFancyComponentProps>`
    padding: 10px 15px;
    width: 100%;
    font-size: 13px;
    background: var(--var-input);
    border: 1px solid transparent;
    border-radius: 10px;
    color: ${(props: any)=>(props?.datafancy?.text ? '#00000000' : '#ffffff')};
    outline: none;
    transition: var(--var-transition);
    &:-webkit-outer-spin-button,
    &:-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
    }
    &:focus{
      border-color: var(--var-link);
      background: var(--var-input-hover);
      color: #ffffff;
    }
    &:hover{
      background: var(--var-input-hover);
      color: #ffffff;
    }
    &:focus + .label, &:hover + .label{
      opacity: ${(props: any)=>(props?.datafancy?.text && !props?.inputProps ? '0' : '1')};
    }
  `

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  left: 0px;
  right: 0px;
`

const Input:React.FunctionComponent<inputProps> = ({fancy, ...inputProps}) => {
  return(
    <InputWrapper>
      <FancyInput
        {...inputProps}
        value={inputProps.value}
        datafancy={fancy}/>
      {fancy
      ? <Label
          htmlFor={inputProps.id}
          className='label'
          value={inputProps.value}
          datafancy={fancy}>{
          fancy.hide
            ? fancy.text
            : fancy.placeholder
              ? `${fancy.text}: ${inputProps.value ? inputProps.value : "nothing..."}`
              : `${inputProps.value ? inputProps.value : ""}`}
            </Label> 
          : <></>}
    </InputWrapper>
  )
}

export default Input