import React from 'react'
import './button.scss'

const Button = ({title, ...rest}:any) => {
  return (
    <button type = "button" {...rest} className='button'>{title}</button>
  )
}

Button.defaultProps = {
  title:'<No Title>'
}

export default Button