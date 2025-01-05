const TicketShow = (ticket) => {
  return (
    <div>
      <h3>{ticket.title}</h3>
      <h4>Price: {ticket.price}</h4>
      <button></button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
