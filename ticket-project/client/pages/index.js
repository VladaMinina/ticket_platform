import Link from "next/link";

const Landing = ({ currentUser, tickets }) => {
  console.log("tickets:", tickets);
  console.log(currentUser);
  const ticketList = (tickets || []).map((ticket) => {
    return (
      <tr>
        <td>
          <Link href={`/tickets/[ticketId]`} as={`/tickets/${ticket.id}`}>
            {ticket.title}
          </Link>
        </td>
        <td>{ticket.price}</td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};
//context -> add in addition headers and others props from the browser
Landing.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get("/api/tickets");
    console.log("Tickets were fetched");
    return { tickets: data };
  } catch (err) {
    console.error("Error fetching tickets:", err.message);
    return { tickets: [] }; // Return an empty list if the API call fails
  }
};

export default Landing;
