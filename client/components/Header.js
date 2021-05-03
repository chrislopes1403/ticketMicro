import Link from "next/link";

const Header = ({currentUser}) =>
{

    const links =[
        !currentUser && {label:'Sign Up',href:'/auth/signup'},
        !currentUser &&{label:'Sign In',href:'/auth/signin'},
        currentUser && {label:'Sell Tickets',href:'/tickets/new'},
        currentUser && {label:'My Orders',href:'/orders'},
        currentUser && {label:'Sign Out',href:'/auth/signout'}
    ].filter(links=>links) // filter out any statement that is false
     .map(({label,href})=>{
        
        return <li className="nav-item p-1" key={href}>
                    <Link href={href}>
                        {label}
                    </Link> 
                </li>
     });


    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                TickerMasters
            </Link> 

            <div className="d-fex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );

}

export default Header;