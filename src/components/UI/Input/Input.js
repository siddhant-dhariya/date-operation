import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    let errorBlock = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType) {
        case ('input'):
            if (props.errorMsg) {
                errorBlock = <div className={classes.ErrorTextStyle}>{props.errorMsg}</div>
            } else {
                errorBlock = null;
            }
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
                name = {props.label} />;
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
                name = {props.label} />;
    }
    return (
        <div>
            <div className={classes.Input}>
                <label className={classes.Label}>{props.label}</label>
                {inputElement}
            </div>
            {errorBlock}
        </div>

    );

};

export default input;