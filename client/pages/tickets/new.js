import {useState} from 'react';
import Router from 'next/router';
import useRequest from './../../hooks/useRequest';
import Link from "next/link";


const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest({
      url: '/api/tickets',
      method: 'post',
      body: {
        title,
        price,
      },
      onSuccess: () => Router.push('/'),
    });
  
    const onSubmit = (event) => {
      event.preventDefault();
  
      doRequest();
    };
  
    const onBlur = () => {
      const value = parseFloat(price); //if not a number returns NaN
  
      if (isNaN(value)) { // check for NaN
        return;
      }
  
      setPrice(value.toFixed(2)); //set decimal to 2
    };
  
    return (
      <div>
        <h1>Create a Ticket</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  };
  
  export default NewTicket;

//when a use click into an input and then clicks out this is clalled a blur. onBlur is called with this happens
