import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DateOperations } from './DateOperations';
configure({ adapter: new Adapter() });

describe('<DateOperations/>', () => {
    let wrapper;
    let instance;
    const rules = {
        isDate: true,
        required: true,
    };
    const initialState =
    {
        loading: false,
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
    }
    beforeEach(() => {
        wrapper = shallow(<DateOperations />);
        instance = wrapper.instance();
    });
    it('should return true for input 12/8/2004', () => {
        const formValid = instance.checkFormValidity('12/04/2004', rules);
        expect(formValid).toEqual(true);
    });
    it('should return false for input 12/8/101', () => {
        const formValid = instance.checkFormValidity('12/04/101', rules);
        expect(formValid).toEqual(false);
    });
    it('should return false if month value is greater that 12', () => {
        const formValid = instance.checkFormValidity('12/14/2019', rules);
        expect(formValid).toEqual(false);
    });

    it('should return false if date value is greater that 31', () => {
        const formValid = instance.checkFormValidity('32/3/2019', rules);
        expect(formValid).toEqual(false);
    });

    it('should return false if date value is greater that 29 in a leap year', () => {
        const formValid = instance.checkFormValidity('30/2/2016', rules);
        expect(formValid).toEqual(false);
    });
    it('should return true if date value is 29 in month of feb in a non leap year', () => {
        const formValid = instance.checkFormValidity('29/2/2016', rules);
        expect(formValid).toEqual(true);
    });
    it('should return false if year value is invalid', () => {
        let formValid = instance.checkFormValidity('29/2/qwerty', rules);
        expect(formValid).toEqual(false);
        formValid = instance.checkFormValidity('29/2/201', rules);
        expect(formValid).toEqual(false);
    });
    it('should return false if year value is less than 1900', () => {
        let formValid = instance.checkFormValidity('29/2/1800', rules);
        expect(formValid).toEqual(false);
    });
    it('should return true if year value is betwen 1900 and 2019', () => {
        let formValid = instance.checkFormValidity('29/2/2000', rules);
        expect(formValid).toEqual(true);
    });
    it('If form is invalid error message property should have some value', () => {
        // wrapper.find('input').simulate('change');
        const event = {
            target: {
                value: '12/02/12'
            }
        };

        instance.inputChangedHandler(event, 'firstDate');
        const state = wrapper.state();
        expect(state.dateForm.errorMsg).not.toBeNull();

    });


});