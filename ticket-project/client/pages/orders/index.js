const OrderIndex = ({ orders }) => {
  return (
    <div>
      Order Index
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (AmpContext, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
