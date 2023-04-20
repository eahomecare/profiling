import { useState } from "react"

const DescriptionField = () => {
    const [inputValue, setInputValue] = useState('')
    const [textHidden, setTextHidden] = useState(true)
    const [isEnterPressed, setIsEnterPressed] = useState(false)
    const handleKeyPress = (e: any) => {
        if (e.key == 'Enter') {
            setTextHidden(false)
            setIsEnterPressed(true)
        }
        if (e.key === 'Backspace' || 'Space') {
            e.stopPropagation()
        }
        console.log('inputValue', inputValue)
    }
    const handleTextClick = () => {
        setTextHidden(true)
    }
    const handleInputBlur = (e: any) => {
        setTextHidden(false)
        setIsEnterPressed(true)
    }
    return (
        <>
            <input
                type={'text'}
                hidden={!textHidden}
                // autoFocus={isEnterPressed ? false : true}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDownCapture={(e) => { handleKeyPress(e) }}
                onBlur={handleInputBlur}
            />
            <div
                hidden={textHidden}
                onClick={handleTextClick}
            >{inputValue}</div>
        </>
    )
}

export default DescriptionField