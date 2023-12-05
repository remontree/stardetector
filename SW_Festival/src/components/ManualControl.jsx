import React from 'react';
import * as S from './ComponentStyled';

export default function ManualControl() {

  const ManualControl = () => {
    // 입력한 값 가져오기
    const Latitude = document.getElementById('Latitude').value;
    const Azimuth = document.getElementById('Azimuth').value;
    // 서버로 보낼 데이터 객체 생성
    const data = {
      Latitude: Latitude,
      Azimuth: Azimuth
    };
  
    // 서버로 데이터 전송
    fetch('/ManualControl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      // 서버로부터 받은 응답 처리
      
      console.log(result['test']);
    })
    .catch(error => {
      // 에러 처리
      console.error('Error:', error);
    });
  }

  const ManualControl_Precise = (direction) => {
    // 입력한 값 가져오기
    const Latitude_dec = document.getElementById('L_dec').value;
    const Azimuth_dec = document.getElementById('A_dec').value;
    // 서버로 보낼 데이터 객체 생성
    const data = {
      Latitude_dec: Latitude_dec,
      Azimuth_dec: Azimuth_dec,
      direction: direction
    };
  
    // 서버로 데이터 전송
    fetch('/ManualControl_Precise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      // 서버로부터 받은 응답 처리
      console.log(result['test']);
    })
    .catch(error => {
      // 에러 처리
      console.error('Error:', error);
    });
  }

  return (
    <div>
      <S.Title>Manual Control</S.Title>
      <S.GeneralText style={{ fontWeight: 'bold', fontSize: '22px ', marginTop: '5px' }}>
        Input Coordinate
      </S.GeneralText>

      <div style={{ display: 'flex', marginTop: '1px', marginBottom: '10px' }}>
        <S.GeneralText style={{ fontSize: '17px' }}>Latitude: &nbsp;</S.GeneralText>
        <input id = "Latitude" style={{ border: '1px solid white', width: '18vh', height: '2.5vh',  backgroundColor: "#333", color: "white"}} type='number'></input>
        <S.GeneralText style={{ fontSize: '17px', marginLeft: '3vh' }}>Azimuth: &nbsp;</S.GeneralText>
        <input id = "Azimuth" style={{ border: '1px solid white', width: '18vh', height: '2.5vh',  backgroundColor: "#333", color: "white"}} type='number'></input>
      </div>
      <S.SubmitBtn style={{ position: 'relative', left: '450px' }} onClick={ManualControl}>submit</S.SubmitBtn>

      <S.GeneralText style={{ fontWeight: 'bold', fontSize: '22px ', marginTop: '10px', marginBottom: '5px' }}>
        Precise Control
      </S.GeneralText>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <S.GeneralText style={{ marginRight: '20px' }}>L Dec:</S.GeneralText>
            <input id = "L_dec" style={{ border: '1px solid white', width: '18vh', height: '2.5vh',  backgroundColor: "#333", color: "white"}} type='number'></input>
          </div>
          <div style={{ display: 'flex' }}>
            <S.GeneralText style={{ marginRight: '19px' }}>A Dec:</S.GeneralText>
            <input id = "A_dec" style={{ border: '1px solid white', width: '18vh', height: '2.5vh',  backgroundColor: "#333", color: "white"}} type='number'></input>
          </div>
        </div>

        <div style={{ marginLeft: '10vh' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <S.DirectionBtn onClick={() => ManualControl_Precise("Up")}>▲</S.DirectionBtn>
          </div>
          <div style={{ display: 'inline-flex' }}>
            <S.DirectionBtn onClick={() => ManualControl_Precise("Left")}>◀</S.DirectionBtn>
            <S.DirectionBtn onClick={() => ManualControl_Precise("Down")}>▼</S.DirectionBtn>
            <S.DirectionBtn onClick={() => ManualControl_Precise("Right")}>▶</S.DirectionBtn>
          </div>
        </div>
      </div>
      <S.SeperateLine />
    </div>
  );
}
