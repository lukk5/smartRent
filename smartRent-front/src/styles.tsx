import styled from "@emotion/styled/macro";
import { css } from "@emotion/css/macro";
import { FontSize , Color} from "./constants/base";



type BoxProps = {
  messages: string[],
  status: 'success' | 'failure',
}

type BoxColorProps = {
  status: 'success' | 'failure',
}

const Box = styled.div<BoxColorProps>`
  text-align: center;
  color: ${(props: BoxColorProps) => props.status === 'success' ? Color.Success : Color.Failure};
  border: 1px solid ${(props: BoxColorProps) => props.status === 'success' ? Color.Success : Color.Failure};
  padding: 10px;
  font-size: ${FontSize.Small};
  margin: 20px 0;
  background-color: #ae1818
  border-radius: 10px;
`;

const Form = styled.form`
  font-family: Monospace, Lucida Console;
  width: 300px;
  padding: 40px;
`;

const Page = styled.div `
  font-family: Monospace, Lucida Console;
  width: 300px;
  background: #AAE8C5;
  padding: 40px;
`;

const FieldWrapperStyle = css`
  margin: 20px 0;
`;

const InputFieldWrapper = styled.div`
  ${FieldWrapperStyle}
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 650px;
  background-color: #AAE8C5;
`;

const HeaderLogo = styled.img`
  display: block;
  margin-left: 0;
  width: 50%;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end
  align-items: center;
  width: 100%
  height: 50px
  background-color: #AAE8C5;
`;


const Logo = styled.img`
display: block;
margin-left: auto;
margin-right: auto;
width: 70%;
`;

const DropDownItem = styled.option`
width: 100%;
height: 50px;
font-family: Monospace, Lucida Console;
font-size: ${FontSize.Regular};
`;


export {
  Container,
  InputFieldWrapper,
  Page,
  Logo,
  DropDownItem,
  Box,
  HeaderContainer,
  HeaderLogo,
  Form
};  

export type { BoxProps };

