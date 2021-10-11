import { useEffect, useState } from 'react';
import { Container } from '@chakra-ui/react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';

type Owner = {id: string, username:  string}
type Organization = {id: number,name: string, owner: Array<Owner>}

const Dashboard = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [jwtToken, setToken] = useState('');
    const [userOrganizations, setUserOrganizations] = useState<Array<Organization>>();

    const fullname = user?.nickname as string;
    const img = user?.img as string;

    const getToken = async () => {
        const resp = await getAccessTokenSilently({
            audience: "https://devboards/api",
            scope: "read:current_user",
        });
        setToken(resp);
        
        /* Eventually replace endpoint with /users/me/organizations for org count */
        /* Getting CORS error here */
        const bearer = `Bearer ${resp}`;
        fetch('http://localhost:8080/users/me/organizations', {
            headers: {
                'Authorization': bearer,
            }
        }).then(response => response.json()).then(setUserOrganizations);
    }

    useEffect(() => {
        if( !jwtToken ){
            getToken();
        }
    }, []);

    if( !userOrganizations?.length ){
        /* User has no organizations, prompt to make one */
        return (<div>no orgs</div>);
    }

    return (
        <Container maxW='' px='0' pt='5px'>
            <Navbar fullname={fullname} img={img} />
            {user?.given_name}
            <br/>
            {user?.nickname}
            <br/>
            {user?.email}
            <br/>
            {user?.sub}
            <br/>
        </Container>
    );
}

export default withAuthenticationRequired(Dashboard);