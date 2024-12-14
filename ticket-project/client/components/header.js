import Link from 'next/link';

export default ({currentUser}) => {
    const links = [
        !currentUser && {label: 'Sign Up', href:'/auth/signup'},
        !currentUser && {label: 'Sign In', href:'/auth/signin'},
        currentUser && {label: 'Sign Out', href:'/auth/signout'},
    ]
    .filter(linkDataFilter => linkDataFilter) //gets only true
    .map(({label, href}) => {
        return <li key={href} className='nav-item'>
            <Link href={href}>
                {label}
            </Link>
        </li>
    })
    return (
        <nav>
            <Link className='navbar-brand' href="/"></Link>KvitkiTicket
            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {/* {currentUser ? 'Sign out': 'Sign in/up'} */}
        {links}

                </ul>
            </div>
        </nav>
    )
}