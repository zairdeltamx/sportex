import React from "react";
import styled from "styled-components";

const colorPrimary = "#14141f";
const colorSecondary = "#00dfc4";
const colorBack = "#1d2b3a";

export const Button = styled.button`
  background: #1d2b3a;
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid ${colorSecondary};
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #fff;
  text-align: center;
  transition: all 0.2s;
  &:hover {
    color: cyan;
    box-shadow: 4px gray;
  }
`;
export const Title = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "bold")};
  color: ${(props) =>
    props.secondary ? colorSecondary : props.color ? props.color : "white"};
  font-size: ${(props) => (props.size ? props.size : "35px")};
`;

export const Title2 = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "bold")};
  color: ${(props) =>
    props.secondary ? colorSecondary : props.color ? props.color : "white"};
  font-size: ${(props) => (props.size ? props.size : "35px")};
`;

export const Paragraph = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "100")};
  color: ${(props) => (props.color ? props.color : "white")};
  font-size: ${(props) => (props.size ? props.size : "20px")};
`;

export const Paragraph2 = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: ${(props) => (props.weight ? props.weight : "100")};
  color: ${(props) => (props.color ? props.color : "white")};
  font-size: ${(props) => (props.size ? props.size : "20px")};
`;

export const InputBox = styled.div`
  position: relative;
  width: ${(props) => (props.w ? props.w : "auto")};
  height: ${(props) => (props.h ? props.h : "auto")};
  :nth-child(2) :valid ~ span,
  :nth-child(2) :focus ~ span {
    background: #00dfc4;
    color: #1d2b3a;
    border-radius: 2px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background-color: #1d2b3a;
  border-radius: 5px;
  outline: none;
  color: #fff;
  font-size: 1em;
  transition: 0.5s;
  margin-bottom: 1rem;

  :valid ~ span,
  :focus ~ span {
    color: #00dfc4;
    transform: translateX(10px) translateY(-7px);
    font-size: 0.65em;
    padding: 0 10px;
    background: #00dfc4;
    color: #1d2b3a;
    border-radius: 2px;
    letter-spacing: 0.2em;
  }

  :valid,
  :focus {
    border: 1px solid #00dfc4;
  }
`;

export const Span = styled.span`
  position: absolute;
  left: 0;
  padding: 10px;
  pointer-events: none;
  font-size: 1em;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
  transition: 0.5s;
`;

export const Flex = styled.div`
  width: ${(props) => (props.width ? props.width : "90%")};
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
  height: ${(props) => (props.height ? props.height : "auto")};
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "auto"};
  flex-direction: ${(props) =>
    props.flexDirection ? props.flexDirection : "auto"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "auto")};
`;
export const ContentNFT = styled.div`
  width: 280px;
  height: 610px;
  background-color: #16253e;
  border-radius: 10px;
  margin: auto;
  padding: 20px;
`;
export const ImgNft = styled.img`
  border-radius: 10px;

  width: 100%;
  height: 340px;
`;
export const CardNft = styled.div`
  color: white;
  margin: auto;
  width: 100%;
  height: 100%;
  overflow: hidden;

`;

export const GridNFTs = styled.div`
width:100%;
  display:grid;
  gap:20px;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
`
