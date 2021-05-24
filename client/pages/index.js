import Link from "next/link";


const LandingPage = ({currentUser,tickets}) =>
{
    const ticketList = tickets.map((ticket)=>{

    const price_formated = parseFloat(ticket.price).toFixed(2);

        return(
            <tr key={ticket.id}>
                <td >{ticket.id.trim()}</td>
                <td>{ticket.title}</td>
                <td>${price_formated}</td>
                <td>
                <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
                        <a>View Ticket</a>
                </Link> 
                </td>
            </tr>
        );

    });
    
    const linearGradient = `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 23%, rgba(0,212,255,1) 55%)`;

    return( 
    <div>
        <h1>Tickets</h1>
        <table  className="table table-striped" style={{borderRadius:'20px'}}>
            <thead className="table-primary" style={{color:'white'}}>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Link</th>
                </tr>
            </thead>
            <tbody>
                {ticketList}
            </tbody>
        </table>

    </div>);

};

//context:{req,res}
LandingPage.getInitialProps= async(context,client_axios,currentUser)=>
{  
    //response.data
    const {data} = await client_axios.get('/api/tickets');

    //rename
   return {tickets:data}
}


export default LandingPage;

