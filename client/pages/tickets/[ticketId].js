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
  

    const format_price = parseFloat(ticket.price).toFixed(2);

    return (
    <div className="d-flex justify-content-center mt-3">

      <div className="card" style={{width: "18rem",height:"20rem"}}>
        <div className="card-body d-flex flex-column justify-content-between align-items-center">
          <h4 className="card-title">{ticket.title}</h4>
          <h2 className="card-subtitle mb-2 text-muted">${format_price}</h2>
          {errors}
          <button onClick={() => doRequest()} className="btn btn-lg btn-primary">
            Purchase
          </button>
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
