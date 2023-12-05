import React from 'react';
import * as S from './ComponentStyled';

export default function AutoControl() {
  const AutoControlDataToServer = () => {
    // 입력한 값 가져오기
    const starname = document.getElementById('starname').value;
    // 로컬 스토리지에 starname 저장
    localStorage.setItem('starname', starname);
    localStorage.setItem('toggle', true);

    // // 서버로 보낼 데이터 객체 생성
     const data = {
       ra: "90",
       dec: "30"
     };

    // // 서버로 데이터 전송
    fetch('http://127.0.0.1:5000/AutoControl', {
          method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     })
       .then((response) => response.json())
       .then((result) => {
         // 서버로부터 받은 응답 처리
        console.log(result['test']);
       })
      .catch((error) => {
         // 에러 처리
         console.error('Error:', error);
       });
  };

  return (
    <div>
      <S.Title>Auto Control</S.Title>
      <S.GeneralText style={{ fontWeight: 'bold', fontSize: '22px ', marginTop: '5px' }}>
        Input Target Name
      </S.GeneralText>

      <div style={{ display: 'flex', marginTop: '1.5vh', alignItems: 'center' }}>
        <S.GeneralText style={{ marginRight: '2vh', fontSize: '2vh', fontWeight: '500' }}>Name:</S.GeneralText>
        <input
          id='starname'
          style={{ border: '1px solid white', width: '18vh', height: '2.5vh', backgroundColor: '#333', color: 'white' }}
        ></input>
        <S.SubmitBtn style={{ marginLeft: '12.8vh' }} onClick={AutoControlDataToServer}>
          submit
        </S.SubmitBtn>
      </div>
      <S.SeperateLine />
    </div>
  );
}
