import useRequest from './../../hooks/useRequest';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
      url: '/api/orders',
      method: 'post',
      body: {
        ticketId: ticket.id,
      },
      onSuccess: (order) =>
        Router.push('/orders/[orderId]', `/orders/${order.id}`),
    });
    
    const price_formated = parseFloat(ticket.price).toFixed(2);

    return (
     <div className="d-flex justify-content-center">

       <div className="card mt-3" style={{width: "18rem", height:"15rem"}}>
          <div className="card-body d-flex flex-column justify-content-between  align-items-center">
            <h4 className="card-title text-center">{ticket.title}</h4>
            <h3 className="card-subtitle mb-2 text-muted">${price_formated}</h3>
            <button onClick={() => doRequest()} className="btn btn-lg btn-block btn-primary">
              Purchase Ticket
           </button>
           {errors}
          </div>
        </div>

     </div>
    );
  };
  
  TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
  
    return { ticket: data };
  };
  
  export default TicketShow;

  /*
  
   <div>
        <h1>{ticket.title}</h1>
        <h4>Price: {ticket.price}</h4>
        {errors}
        <button onClick={() => doRequest()} className="btn btn-primary">
          Purchase
        </button>
      </div>
  */