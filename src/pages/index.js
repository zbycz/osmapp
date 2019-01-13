import * as React from "react";
import styled from "styled-components";
import Panel from "../components/Panel/Panel";
import Map from "../components/Map/Map";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  width: 100%;
  height: 100%;

  & > div {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
`;

const Index = () => (
    <Wrapper>
      <Panel />
      <Map />
    </Wrapper>
);

export default Index;
