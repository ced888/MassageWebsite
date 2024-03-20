import axios from 'axios';

const checkAuthentication = async () =>{
    try {
        const res = await axios.get('http://localhost:3000/checkauth', { withCredentials: true });
        return res.data.authenticated;
    } catch (err) {
        throw err;
    }
}

export default checkAuthentication;