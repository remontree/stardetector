import styled from 'styled-components';

// 제목
export const Title = styled.div`
  color: white;
  font-size: 3vh;
  font-weight: bold;
`;

//파란색 체크
export const HighlightText = styled.div`
  color: rgba(96, 229, 219, 1);
  font-weight: bold;
`;

//기본 회색 글꼴
export const GeneralText = styled.div`
  color: #7a7979;
  font-weight: bold;
  line-height: 1.5;
`;

//그라데이션 색상
export const GradientTitle = styled.span`
  background: linear-gradient(to bottom, #60e5db, #8a8a8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
export const GradientDetail = styled.span`
  background: linear-gradient(to bottom, #cccccc, #60e5db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

//회색 구분선
export const SeperateLine = styled.hr`
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: #7a7979;
  height: 2px;
  border: 0;
`;

// Set Telescope
export const Container = styled.div`
  display: grid;
  margin-right: 50px;
  grid-template-columns: 1fr 1fr; /* 2개의 열을 동일한 너비로 설정 */
  grid-template-rows: 1fr 1fr; /* 2개의 행을 동일한 높이로 설정 */
  gap: 5px; /* grid의 각 셀 사이의 간격을 설정 */
`;
export const ContainerItem = styled.button`
  display: flex;
  background-color: white;
  font-size: 2vh;
  width: 13.5vh;
  height: 5vh;
  align-items: center;
  justify-content: center;
  border: 1px solid black; /* grid의 각 셀을 시각적으로 구분하기 위한 테두리 설정 */
  cursor: pointer;
`;

//Manual Control
export const SubmitBtn = styled.button`
  background-color: white;
  font-size: 2vh;
  width: 10vh;
  height: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black; /* grid의 각 셀을 시각적으로 구분하기 위한 테두리 설정 */
  cursor: pointer;
`;

export const DirectionBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 5vh;
  height: 5vh;
  color: black;
  font-size: 4vh;
  cursor: pointer;
`;

//Log Information
export const scrollDiv = styled.div`
  width: 55vh;
  height: 12vh;
  margin-top: 1.1vh;
  overflow-y: scroll;
  color: white;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #60e5db, grey);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(96, 229, 219, 0.3);
  }
`;
