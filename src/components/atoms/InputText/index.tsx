import React, { useEffect, useRef, useState } from 'react'
import './InputText.scss'
import {svgCustom} from '../../../utils/svgcustom'

const InputText = (
                    props
                    // {placehold = "", heightType = "medium", inputType = "text",
                    // maxLengthInput = -1, name = "", focusProp = false, outChange, ...props}
                    ) => {
    // heightType => medium / large
    // inputType => text / password
    // focusProp => focus pada input

    const [text, setText] = useState('');
    const [focused, setFocused] = useState(false);
    const [heightTypeState, setHeightTypeState] = useState("");
    const [showText, setShowText] = useState(false);

    const refName = useRef<HTMLInputElement|null>(null);

    const { value, placehold, heightType, inputType, maxLengthInput, name, focusProp, focusRun, outChange, disabled, outKeyUp } = props;

    // focusProp -> focus di awal
    // focusRun -> focus berjalan

    useEffect(()=>{
        switch(heightType)
        {
            case 'large': setHeightTypeState('large'); break;
            case 'medium': setHeightTypeState('medium'); break;
            default: setHeightTypeState('medium');break;
        }

        if (focusProp){
          if (refName.current){
            refName.current.focus();
          }
        }

    },[])

    useEffect(()=>{
      // focusRun -> hanya focus pada saat berjalan, misal ada error login maka focus ke 'username'
      if (focusRun){
        if (refName.current){
          refName.current.focus();
        }
      }
    }, [focusRun])

    useEffect(()=>{
        // set default text
        if (value != null && value != ""){
            setText(value)
            setFocused(true)
            outChange({value, name})
        }
    }, [value])
    
    const handleFocus = () => {
        setFocused(true);
    }

    
    const handleBlur = () => {
        if (text == ''){
            setFocused(false);
        }

    }

    const handleChange = (event) => {
        setText(event.target.value)
        outChange({value: event.target.value, name})

    }

    const handleKeyUp = (event) => {
      if (event.keyCode == 13){
        outKeyUp({value: event.target.value, name})
      }
    }

    
    const handleClickIconPassword = () => {
        if (showText){ // password
            setShowText(false)
        }
        else{
            setShowText(true)
        }
    }
    

    return (
        <div className={`box-input ${focused ? 'focused' : ''} ${heightTypeState}`}>
            {
                inputType == 'text' &&
                <input className={`form-control input-style ${heightTypeState}`} 
                        type = "text" 
                        maxLength={maxLengthInput}
                        onFocus={handleFocus} onBlur={handleBlur} 
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        name = {name}
                        value={text}
                        ref={refName}
                        disabled={disabled}
                />
            }
            {
                inputType == 'password' &&
                (
                    <div className='password-container'>
                        <input className={`form-control input-style ${heightTypeState} input-password`} 
                                // type = "password" 
                                type = {`${showText ? 'text':'password'}`}
                                maxLength={maxLengthInput}
                                onFocus={handleFocus} onBlur={handleBlur} 
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                                name = {name}
                                value={text}
                                ref={refName}
                                disabled={disabled}
                        />

                        <div className='password-hideshow-icon' 
                            onClick={handleClickIconPassword}>

                            <div className = {`monkey ${showText ? 'show' : ''}`}>
                                <svg>
                                    <use xlinkHref="#monkey" />
                                </svg>
                            </div>

                            <div className={`monkey-hands ${showText ? 'show' : ''}`}>
                                <svg>
                                    <use xlinkHref="#monkey-hands" />
                                </svg>
                            </div>
                            
                            
                        </div>
                        {
                            svgCustom('monkey_and_hands')
                        }
                    </div>
                )
                
            }
            <span className='input-title'>{placehold}</span>
        </div>
    )
}

export default InputText