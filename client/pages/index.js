import Link from "next/link";


const LandingPage = ({currentUser,tickets}) =>
{
    const ticketList = tickets.map((ticket)=>{
        return(
            <tr  key={ticket.id}>
                <th scope="row">{ticket.id}</th>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                </Link> 
                </td>
            </tr>
        );

    });
    
    return( 
    <div >
        <h1>Tickets</h1>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col"> Link</th>
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

