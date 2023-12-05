import React from 'react';
import * as S from './ComponentStyled';

export default function LogInformation() {
  return (
    <div>
      <S.Title>How to use</S.Title>
      <S.scrollDiv>
        <p style={{fontSize: '2.2vh'}}>1. Click the connect button</p>
        <p style={{fontSize: '2.2vh'}}>2. Typing Constellation Name in Auto Control or you can also typing Latitude and Azimuth in Manual Control</p>
        <p style={{fontSize: '2.2vh'}}>3. When you submit, constellation on web move to that position</p>
        <p style={{fontSize: '2.2vh'}}>4. Also, Telescope is moving toward the constellation</p>
      </S.scrollDiv>
    </div>
  );
}