import styled from "styled-components";

const colors = {
  colorPrimary: "#16253e",
  button: "#5042ac",
  buttonHover: "#5052ac",
  border: "#325083",
  colorSecondary: "#E3F0FF",
  colorText: "#D8A31A",
  colorTextSecondary: "#919090",
  backDisabled: "#393942",
  errors: "#b31616",
};
export const GroupInputWithButton = styled.div`
  display: flex;
  align-items: center;
`;
export const ContainerInput = styled.div`
  width: 100%;
  height: 120px;
  text-align: start;

  /* display: flex; */
  /* flex-direction: column;
  justify-content: start;
  align-items: start; */
`;
export const Label = styled.label`
  color: black;
`;
export const InputWithButton = styled.input`
  min-height: 50px;
  width: 100%;
  padding: 0 1rem;
  color: black;
  font-size: 15px;
  border: 1px solid ${colors.border};
  border-radius: 6px 0 0 6px;
  background-color: transparent;

  &:focus,
  &:focus-visible {
    border-color: #3898ec;
    outline: none;
  }
`;
export const Input = styled.input`
  min-height: 50px;
  width: 100%;
  padding: 0 1rem;
  color: black;
  font-size: 15px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background-color: transparent;
  &:focus,
  &:focus-visible {
    border-color: #3898ec;
    outline: none;
  }
`;
export const TextArea = styled.textarea`
  min-height: 50px;
  width: 100%;
  max-height: 108px;
  padding: 0 1rem;
  color: black;
  font-size: 15px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background-color: transparent;
  margin-bottom: 10px;
  &:focus,
  &:focus-visible {
    border-color: #3898ec;
    outline: none;
  }
`;
export const ButtonWithSubmit = styled.button`
  min-height: 50px;
  padding: 0.5em 1em;
  border: none;
  border-radius: 0 6px 6px 0;
  background-color: ${colors.button};
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  font-size: 20px;
  &:hover {
    background-color: ${colors.buttonHover};
  }
  &:disabled {
    background-color: ${colors.backDisabled};
    cursor: not-allowed;
  }
`;
export const Button = styled.button`
  background: ${colors.button};
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid ${colors.border};
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  max-height: 100px;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #fff;
  text-align: center;
  transition: all 0.2s;
  &:hover {
    background: ${colors.buttonHover};
  }
  &:disabled {
    background-color: ${colors.backDisabled};
    cursor: not-allowed;
  }
`;
export const Title = styled.h2`
  word-break: break-all;
  font-family: "Montserrat", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "bold")};
  color: ${(props) =>
    props.secondary
      ? colors.colorTextSecondary
      : props.primary
      ? colors.colorText
      : props.black
      ? "black"
      : "white"};
  font-size: ${(props) => (props.size ? props.size : "35px")};
`;

export const Title2 = styled.h2`
  font-family: "Poppins", sans-serif;
  word-break: break-all;
  font-weight: ${(props) => (props.weight ? props.weight : "bold")};
  color: ${(props) =>
    props.secondary
      ? colors.colorTextSecondary
      : props.primary
      ? colors.colorText
      : props.black
      ? "black"
      : "white"};
  font-size: ${(props) => (props.size ? props.size : "35px")};
`;

export const Paragraph = styled.h2`
  word-break: break-all;
  font-family: "Montserrat", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "100")};
  color: ${(props) =>
    props.secondary
      ? colors.colorTextSecondary
      : props.primary
      ? colors.colorText
      : props.black
      ? "black"
      : "white"};
  font-size: ${(props) => (props.size ? props.size : "20px")};
`;

export const Paragraph2 = styled.h2`
  word-break: break-all;
  font-family: "Poppins", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "100")};
  color: ${(props) =>
    props.secondary
      ? colors.colorTextSecondary
      : props.primary
      ? colors.colorText
      : props.black
      ? "black"
      : "white"};
  font-size: ${(props) => (props.size ? props.size : "20px")};
`;

export const AppContainer = styled.div`
  text-align: ${(props) =>
    props.textCenter
      ? "center"
      : props.textStart
      ? "start"
      : props.textEnd
      ? "end"
      : "none"};
  background: ${(props) =>
    props.bgSecondary ? colors.colorSecondary : props.bg ? props.bg : "none"};
  width: ${(props) => (props.w ? props.w : props.wAuto ? "100%" : "100vh")};
  padding: ${(props) => (props.p20 ? "20px" : props.p10 ? "10px" : "none")};
  margin-bottom: 30px;
  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 3px;
  height: ${(props) => (props.h ? props.h : props.hAuto ? "100%" : "none")};
`;
export const ContainerPagination = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
  padding-top: 30px;
`;
export const Errors = styled.span`
  color: ${colors.errors};
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 0px;
  font-family: "Montserrat", sans-serif;
`;
export const ContentNFT = styled.div`
  width: 330px;
  height: 650px;
  background-color: ${colors.colorPrimary};
  border-radius: 10px;
  margin: auto;
  padding: 20px;
`;
export const TextNFT = styled.div`
  text-align: start;
  color: white;
`;
export const ImgNft = styled.img`
  border-radius: 10px;
  width: 100%;
  height: 340px;
`;
export const CardNft = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const GridNFTs = styled.div`
  width: 100%;
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
`;
