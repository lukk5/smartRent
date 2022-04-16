import { useEffect, useState } from "react";
import { User, UserProp } from "../models/userModel";
import  Header  from "../main-page/header"
import { HeaderContainer, Container } from "../styles";

const DashBoard: React.FC<UserProp> = (props) => {

    const [ user, setUser ] = useState<User>();

    useEffect( () => {
        loadUserIfNotExist();
    }, []);

    const getDashBoardData = () => {
        console.log(user);
    };

    const loadUserIfNotExist = () => {
        
        if(user !== undefined ) return;

        const userString = window.localStorage.getItem("user");

        if(userString === null) throw Error('User not exist in local storage.'); 

        let userr = JSON.parse(userString);

        setUser(userr);
    };

    getDashBoardData();

    return (
            <HeaderContainer>
                 <Header subtitle="Meniu"></Header>
            </HeaderContainer>
    );
};

export default DashBoard;