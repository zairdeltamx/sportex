import React, { Fragment } from "react";
import {
  Input,
  Span,
  InputBox,
  Title,
  Flex,
  Button
} from "../../components/CustomStyledComponents";
import styled from './profile.module.css'
import img from "../../img/NFT.png";
export const Profile = () => {
  return (
    <Fragment>
      <Flex width="90%" justifyContent="center" alignItems="center" flexDirection="column">
        <Title>You Profile</Title>
        <img
          width="200px"
          height="200px"
          style={{ borderRadius: "50%" }}
          src={img}
          alt=""
        />
        <br />
        <Title size="20px">Avatar</Title>

        <div className={styled.formProfile}>
          <div className={styled.itemProfile}>
            <InputBox>
              <Input required={true} />
              <Span>First ds</Span>
            </InputBox>
          </div>
          <div className={styled.itemProfile}>
            <InputBox>
              <Input required={true} />
              <Span>First ds</Span>
            </InputBox>
          </div>
          <div className={styled.itemProfile}>
            <InputBox>
              <Input required={true} />
              <Span>First ds</Span>
            </InputBox>
          </div>
          <div className={styled.itemProfile}>
            <InputBox>
              <Input required={true} />
              <Span>First ds</Span>
            </InputBox>
          </div>
          <div className={styled.itemProfile}>
            <InputBox>
              <Input required={true} />
              <Span>First ds</Span>
            </InputBox>
          </div>

        </div>
        <Button>
          Save
        </Button>
      </Flex>
    </Fragment>
  );
};
