import React from 'react';
import * as S from './ComponentStyled';


export default function SetTelescope() {

  const connect_to_telescope = async () => {
    try {
      await fetch('http://localhost:5000/connect_to_telescope', { method: "GET" }).then(response => response.json())
      .then(result => {
        // 서버로부터 받은 응답 처리
        let l = document.getElementById("L_Value");
        let a = document.getElementById("A_Value");
        l.innerText = "L:" + result['current_latitude'] + "dec";
        a.innerText = "A:" + result['current_azimuth'] + "dec";
        console.log(result['current_angle']);
      })
    } catch (error) {
      console.error('Error calling Flask API:', error);
    }
  };

  const disconnect_to_telescope = async () => {
    try {
      await fetch('http://localhost:5000/disconnect_to_telescope', { method: "GET" }).then(response => response.json())
      .then(result => {
        // 서버로부터 받은 응답 처리
        let l = document.getElementById("L_Value");
        let a = document.getElementById("A_Value");
        l.innerText = "L:" + result['current_latitude'] + "dec";
        a.innerText = "A:" + result['current_azimuth'] + "dec";
        console.log(result['current_angle']);
      })
    } catch (error) {
      console.error('Error calling Flask API:', error);
    }
  };

  const Park = async () => {
    try {
      await fetch('http://localhost:5000/park', { method: "GET" }).then(response => response.json())
      .then(result => {
        // 서버로부터 받은 응답 처리
        console.log(result);
      })
    } catch (error) {
      console.error('Error calling Flask API:', error);
    }
  };
  

  return (
    <div style={{ marginBottom: '10px' }}>
      <S.Title>Set Telescope</S.Title>

      <div style={{ display: 'flex', marginTop: '15px' }}>
        <S.Container>
          <S.ContainerItem onClick={connect_to_telescope}>connect</S.ContainerItem>
          <S.ContainerItem onClick={disconnect_to_telescope}>disconnect</S.ContainerItem>
          <S.ContainerItem onClick={Park}>park</S.ContainerItem>
          <S.ContainerItem style={{ color: 'white', backgroundColor: '#fa4040' }}>abort</S.ContainerItem>
        </S.Container>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <S.HighlightText>V&nbsp;&nbsp;</S.HighlightText>
            <S.GeneralText>Connected: khuscopev1</S.GeneralText>
          </div>
          <div style={{ display: 'flex' }}>
            <S.HighlightText>V&nbsp;&nbsp;</S.HighlightText>
            <S.GeneralText>
              Current Coordinate:
              <br />
              <a id = "L_Value">L: 302 dec</a>
              <br />
              <a id = "A_Value">L: 302 dec</a>
            </S.GeneralText>
          </div>
        </div>
      </div>
      <S.SeperateLine />
    </div>
  );
}
