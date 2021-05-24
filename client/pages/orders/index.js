

const OrderIndex = ({ orders }) => {
    return (
      <div className="d-flex justify-content-center mt-3">
        <ul className="list-group">
          {orders.map((order) => {
            return (
              <li className="list-group-item" key={order.id}>
                {order.ticket.title} - {order.status}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
  
    return { orders: data };
  };
  
  export default OrderIndex;
  