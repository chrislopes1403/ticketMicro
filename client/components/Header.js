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
                    <Link href={href} >
                        {label}
                    </Link> 
                </li>
     });

     const linearGradient = `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(94,94,245,1) 0%, rgba(0,212,255,1) 43%)`;

    return (<nav className="navbar " style={{color:'white', background:linearGradient}}>
                <div className="container-md">
                    <Link href="/">
                        <a className="navbar-brand" href="/"  style={{color:'white'}}>
                            TickerMasters
                        </a>
                    </Link> 
                    <div className="d-flex justify-content-end">
                        <ul className="nav d-flex align-items-center">
                            {links}
                        </ul>
                    </div>
                </div>    
        </nav>);

}

export default Header;

/* <nav className="navbar navbar-light bg-light" styles={{backgroundColor:'#7A43B6',color:'red'}}>
            <Link href="/">
                TickerMasters
            </Link> 

            <div className="d-fex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>*/