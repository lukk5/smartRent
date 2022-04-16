import logo from "../image/smartRent.png";
import {  HeaderLogo } from "../styles";

const Header  = (props: any) => {
    return (
      <header>
        <div>
          <HeaderLogo src={logo} className="logo" alt="logo" />
        </div>
        <div className="subtitle">{props.subtitle}</div>
      </header>
    );
}

export default Header;
