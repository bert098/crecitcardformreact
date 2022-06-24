import React from 'react'
import { render } from 'react-dom'
import './styles.css'
import validator from 'validator'

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatName
} from './utils'

import 'react-credit-cards/es/styles-compiled.css'
import CardDisplay from "react-credit-card-display";
import { getCardFromNumber, cardIDs } from 'react-credit-card-display';

export default class App extends React.Component {
  state = {
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    issuer: '',
    focused: '',
    errorMessageNumber: '',
    errorMessageDate: '',
    activeButton: true,
    formData: null
  }

  handleInputChange = async ({ target }) => {
    if (target.name === 'number') {
      target.value = await formatCreditCardNumber(target.value)
      if (validator.isCreditCard(target.value)) {
        this.state.errorMessageNumber = ''
      } else {
        this.state.errorMessageNumber = 'Enter valid CreditCard Number!'
      }
      this.state.issuer = getCardFromNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = await formatExpirationDate(target.value)
      if(target.value.length < 5){
        this.state.errorMessageDate = 'Enter valid Date'
      }else{
        let monthAndYear = target.value.split('/')
        const d = new Date();
        let year = d.getFullYear().toString().slice(-2);
        if(monthAndYear[0] < 1 || monthAndYear[0] > 12){
          this.state.errorMessageDate = 'Enter valid Date'
        }else if(parseInt(year) > monthAndYear[1]){
          this.state.errorMessageDate = 'Enter valid Date'
        }else{

          this.state.errorMessageDate = ''
        }
      }
    } else if (target.name === 'cvc') {
      target.value = await formatCVC(target.value)
    }
    else if (target.name === 'name') {
        target.value = await formatName(target.value)
      }

    this.setState({ [target.name]: target.value })
    this.validate()
  }

  validate = () => {
    if(validator.isCreditCard(this.state.number) && 
    this.state.name != '' && 
    this.state.expiry != '' &&
    this.state.errorMessageDate == '' && 
    this.state.cvc.toString().length == 3){
      this.setState({ ["activeButton"]: false })
    }else{
      this.setState({ ["activeButton"]: true })
    }
  }
    


  render () {
    const {number, issuer, errorMessageNumber, errorMessageDate, activeButton } = this.state

    return (
      <div key='Payment'>
        <div className='App-payment'>
          <h1>Payment</h1>
          <h4>We only accept Master and Visa</h4>
          <div>
            {issuer ? (
                <CardDisplay number={number} expand={true} square={true} />
            ) : (
                <span >
                <CardDisplay number={number} expand={true} square={true} active="visa" />
                <CardDisplay number={number} expand={true} square={true} active="mc" />
                </span>
            )
            }
          </div>
          
          <form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
            <div className='form-group'>

              <input
                type='text'
                name='name'
                className='form-control'
                placeholder='Name On Card '
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className='form-group'>

              <input
                type='tel'
                name='number'
                className='form-control'
                placeholder='Card Number'
                pattern='[\d| ]{16,22}'
                maxLength='19'
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <br/>
            <span style={{
                fontWeight: 'bold',
                color: 'red',
                fontSize: "11px"
                }}>{errorMessageNumber}</span>

            <div className='form-group'>

              <input
                type='tel'
                name='expiry'
                className='form-control'
                placeholder='Valid Thru'
                pattern='\d\d/\d\d'
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <span style={{
                fontWeight: 'bold',
                color: 'red',
                fontSize: "11px"
                }}>{errorMessageDate}</span>
            <div className='form-group'>

              <input
                type='tel'
                name='cvc'
                className='form-control'
                placeholder='CVC'
                pattern='\d{3}'
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className='form-actions'>
            <button style={{
              margin: "10px"
                }}>Close</button>
              <button disabled={activeButton}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
