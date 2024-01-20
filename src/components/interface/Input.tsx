"use client"
import React, { PropsWithoutRef, useEffect, useState } from 'react'
import styled from 'styled-components'

interface inputProps extends React.ComponentProps<"input"> {
  fancy?: any
  inputProps?: any
}

interface DataFancyComponentProps {
  fancy: fancy;
  value?: string | any
}

type fancy = {
  position?: string,
  background?: string,
  backgroundHover?: string,
  text?: string,
  hide?: boolean,
  placeholder?: string
}

const Label = styled.label<DataFancyComponentProps>`
  position: absolute;
  font-size: 13px;
  display: block;
  text-align: ${(props) => (props?.fancy?.position ? props.fancy.position : "center")};
  top: 0px;
  left: 10px;
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
    background: ${(props: DataFancyComponentProps)=>(props?.fancy?.background || 'transparent')};
    border: 1px solid transparent;
    border-radius: 10px;
    color: ${(props: DataFancyComponentProps)=>(props?.fancy?.text ? '#00000000' : '#ffffff')};
    outline: none;
    transition: var(--var-transition);
    &:-webkit-outer-spin-button,
    &:-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
    }
    &:focus{
      border-color: var(--var-link);
      background: ${(props: DataFancyComponentProps)=>(props?.fancy?.backgroundHover || 'transparent')};
      outline: none;
      color: #ffffff;
    }
    &:hover{
      background: ${(props: DataFancyComponentProps)=>(props?.fancy?.backgroundHover || 'transparent')};
      outline: none;
      color: #ffffff;
    }
    &:focus + .label, &:hover + .label{
      opacity: ${(props: inputProps)=>(props?.fancy?.text && !props?.inputProps ? '0' : '1')};
    }
  `

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  left: 0px;
  overflow: hidden;
  right: 0px;
`

const Input:React.FunctionComponent<inputProps> = ({fancy, ...inputProps}) => {
  return(
    <InputWrapper>
      <FancyInput
        {...inputProps}
        value={inputProps.value}
        fancy={fancy}/>
      {fancy
      ? <Label
          htmlFor={inputProps.id}
          className='label'
          value={inputProps.type == "password" ? "•••••••••" : inputProps.value}
          fancy={fancy}>{
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