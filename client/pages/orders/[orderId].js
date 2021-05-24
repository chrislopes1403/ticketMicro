import {useEffect,useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from './../../hooks/useRequest';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
      url: '/api/payments',
      method: 'post',
      body: {
        orderId: order.id,
      },
      onSuccess: () => Router.push('/orders'),
    });
  
    useEffect(() => {
      const findTimeLeft = () => {
        const msLeft = new Date(order.expiresAt) - new Date();
        setTimeLeft(Math.round(msLeft / 1000));
      };
  
      findTimeLeft();
      const timerId = setInterval(findTimeLeft, 1000);
  
      return () => {
        clearInterval(timerId);
      };
    }, [order]);
  
   
    const renderTimeToPay = () =>
    {
      return (<div className="d-flex flex-column justify-content-between align-items-center">
                <h3>Time left to pay: {timeLeft} seconds</h3>
                <StripeCheckout
                  token={({ id }) => doRequest({ token: id })}
                  stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY_PUBLIC}
                  amount={order.ticket.price * 100}
                  email={currentUser.email}
                />
            </div>
      );
    }


    const renderOrderExpired =() =>{
     return <div>Order Expired</div>
    }
    const format_price = parseFloat(order.ticket.price).toFixed(2);

    return (
      <div className="d-flex justify-content-center mt-3">

      <div className="card" style={{width: "18rem;"}}>
        <div className="card-body d-flex flex-column justify-content-between align-items-center">
          <h4 className="card-title">{order.ticket.title}</h4>
          <h3 className="card-subtitle mb-2 text-muted">${format_price}</h3>
         
          {timeLeft > 0 ? renderTimeToPay() : renderOrderExpired() }

          {errors}
        </div>
      </div>
    
    </div>
    );
  };
  
  OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
  
    return { order: data };
  };
  
  export default OrderShow;