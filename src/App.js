import React, { Component } from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import qs from 'qs';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response:1,
      responseKeycloak: ''
    }
    this.sample_request = this.sample_request.bind(this);
    this.async_request_auth = this.async_request_auth.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          yan To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.sample_request}>hit</button>
        <p>{this.state.response}</p>
        <button onClick={this.async_request}>request supplier</button>
        <FacebookLogin
          appId="753736335083021"
          autoLoad={true}
          fields="name,email,picture"
          callback={this.async_request_auth} />
        <p>{this.state.responseKeycloak}</p>
      </div>
    );
  }

  responseFacebook = (response) => {
    console.log(response);
  }

  sample_request() {
    this.setState({
      response: this.state.response+1
    })
  }

  async test_get_list_of_supplier() {
    const user_token = '50967334ef84db019337318eac60d7a23dfccb4f8a5e6dc9';
    const country = 'ID';
    const locale = 'en';
    const client_version = 3.2;
    const client_type = 'ios';
    const instance = axios.create({
      baseURL: 'https://stage-api.happyfresh.com/api',
      timeout: 1000,
      headers: {
        'X-Spree-Token':user_token,
        'Content-Type':'application/json',
        'Country':country,
        'Locale':locale,
        'X-Happy-Client-Type':client_type
      }
    });

    
    instance
      .get('/suppliers/per_country')
      .then(function (response) {
        // handle success
        console.log(response.data.suppliers);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  async async_request_auth(responseFacebook) {
    const realm = 'demo';
    const instance = axios.create({
      baseURL: 'http://localhost:8081/auth',
      timeout: 300000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const realmClientId = 'account';
    const realmClientName = 'account';
    const realmClientSecret = '9247035a-c44d-4d27-940e-5b06ea61df8a';
    const facebookAccessToken = responseFacebook.accessToken;
    const payload = {
      client_id: realmClientId,
      client_secret: realmClientSecret,
      subject_token: facebookAccessToken,
      audience: realmClientName,
      subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_issuer: 'facebook'
    }

    try{
      const response = await instance.post(`/realms/${realm}/protocol/openid-connect/token`, qs.stringify(payload))
      console.log(response);
      this.setState({
        responseKeycloak: JSON.stringify(response.data)
      });
    } catch (error) {
      console.log(error);
    }
  }

} 

export default App;
