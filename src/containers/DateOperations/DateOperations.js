import React, { Component } from 'react';

import Input from '../../components/UI/Input/Input';
import classes from './DateOperations.css';
import axiosInstance from '../../axiosInstance';

export class DateOperations extends Component {

    state = {
        loading: false,
        isUserAuthenticated: false,
        dateForm: {
            firstDate: {
                elementLabel: 'First Date',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'DD/MM/YYYY'
                },
                value: '',
                validation: {
                    required: true,
                    isDate: true
                },
                valid: false,
                touched: false,
                errorMsg: null
            },
            secondDate: {
                elementLabel: 'Second Date',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'DD/MM/YYYY'
                },
                value: '',
                validation: {
                    required: true,
                    isDate: true
                },
                valid: false,
                touched: false,
                errorMsg: null
            }
        },
        isFormValid: false,
        result: null,
        globalError: null
    };
    errorMsg = null;

    // Dummy Authentication check by calling a REST API
    componentDidMount() {
        axiosInstance.get('/userData.json').then(userData => {
            if (userData.data.userId === 'Test1') {
                this.setState({ isUserAuthenticated: true });
            } else {
                this.setState({ isUserAuthenticated: false });
            }
        });
    }

    // Method called on click of submit button
    dateSubmitHandler = (event) => {
        // To prevent the form from submitting
        event.preventDefault();
        this.setState({ result: null });
        if (this.state.isFormValid) {
            const date1 = this.parseDate(this.state.dateForm.firstDate.value);
            const date2 = this.parseDate(this.state.dateForm.secondDate.value);
            if (date1 < date2) {
                const timeDiff = Math.abs(date2.getTime() - date1.getTime());
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                this.setState({ result: diffDays, globalError: null });
            } else {
                const globalError = 'Second Date should be greater than First Date';
                this.setState({ result: null, isFormValid: false, globalError: globalError });
            }


            // const diff = Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) / (1000 * 60 * 60 * 24));

        }
    };
    // Method to parse date from [DD/MM/YYYY] format to [MM/DD/YYYY]
    parseDate(dateValue) {
        const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        let regs = dateValue.match(regex);
        const day = regs[1];
        const month = regs[2];
        const year = regs[3];
        return new Date(month + '/' + day + '/' + year);
    }
    // Event handler called on change of input elements
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedForm = {
            ...this.state.dateForm
        };
        const updatedFormElement = {
            ...this.state.dateForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = this.checkFormValidity(updatedFormElement.value, updatedFormElement.validation);
        if (updatedFormElement.valid) {
            updatedFormElement.errorMsg = null;
        } else {
            updatedFormElement.errorMsg = this.errorMsg;
        }
        if (!updatedFormElement.value) {
            updatedFormElement.errorMsg = null;
            updatedFormElement.touched = false;
        }
        updatedForm[inputIdentifier] = updatedFormElement;
        let isFormValid = true;
        for (let inputIdentifier in updatedForm) {
            isFormValid = updatedForm[inputIdentifier].valid && isFormValid;
        }
        this.setState({ dateForm: updatedForm, isFormValid: isFormValid });

    }
    // Method to check the validity of the form
    checkFormValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.isDate) {
            isValid = this.validateDate(value);
        }
        return isValid;
    }
    validateDate(value) {
        // regular expression to match required date format
        const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        if (value !== '') {
            let regs = value.match(regex);
            if (value.match(regex)) {
                // day value between 1 and 31
                if (regs[1] < 1 || regs[1] > 31) {
                    this.errorMsg = 'Invalid value for day: ' + regs[1];
                    return false;
                }
                // month value between 1 and 12
                if (regs[2] < 1 || regs[2] > 12) {
                    this.errorMsg = 'Invalid value for month: ' + regs[2];
                    return false;
                }
                // year value between 1902 and 2019
                if (regs[3] < 1900 || regs[3] > (new Date()).getFullYear()) {
                    this.errorMsg = 'Invalid value for year: ' + regs[3] + ' - must be between 1900 and ' + (new Date()).getFullYear()
                    return false;
                }
                // list of days of a month [assuming there is no leap year by default]
                const listOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if ((regs[2] === '1' || regs[2] === '01') || regs[2] > 2) {
                    if (regs[1] > listOfDays[regs[2] - 1]) {
                        this.errorMsg = 'Invalid value for day: ' + regs[1];
                        return false;
                    }
                }

                // If Month is February
                if (regs[2] === '2' || regs[2] === '02') {
                    let leapYear = false;
                    if ((regs[3] % 4 === 0 && regs[3] % 100 !== 0) || (regs[3] % 400 === 0)) {
                        leapYear = true;
                    }
                    if (!leapYear && (regs[1] >= 29)) {
                        this.errorMsg = 'Invalid value for day: ' + regs[1];
                        return false;
                    }
                    if (leapYear && (regs[1] > 29)) {
                        this.errorMsg = 'Invalid value for day: ' + regs[1];
                        return false;
                    }
                }

            } else {
                this.errorMsg = 'Input a valid date [DD/MM/YYYY ]';
                return false;
            }
        } else {
            return false;
        }

        return true;
    }
    render() {
        const formElementsArray = [];
        for (let key in this.state.dateForm) {
            formElementsArray.push({
                id: key,
                config: this.state.dateForm[key]
            });
        }
        let resultDiv = null;
        let globalErrorBlock = null;
        if (this.state.result) {
            resultDiv = <div><h2>Time difference in days: {this.state.result}</h2></div>;
        }
        if (this.state.globalError) {
            globalErrorBlock = <div className={classes.ErrorTextStyle}> {this.state.globalError}</div>
        } else {
            globalErrorBlock = null;
        }
        let form = (
            <form onSubmit={this.dateSubmitHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        touched={formElement.config.touched}
                        errorMsg={formElement.config.errorMsg}
                        globalError={formElement.config.errorMsg}
                        label={formElement.config.elementLabel}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <button className={classes.Button} onClick={this.dateSubmitHandler} disabled={!this.state.isFormValid}>Submit</button>
            </form>
        );
        return <div className={classes.DateOperations}>
            <h2>Calculate difference in days between two dates</h2>
            {globalErrorBlock}
            {form}
            {resultDiv}
        </div>
    }
}

export default DateOperations;