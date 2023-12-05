import * as d3 from 'd3';
import React, { useEffect, useState, useRef } from 'react';

// D3와 Celestial 관련 스크립트 파일들은 public 폴더에 넣고 아래와 같이 static 경로로 접근합니다.
const D3_SCRIPT = '/static/d3.min.js';
const D3_GEO_SCRIPT = '/static/d3.geo.projection.min.js';
const CELESTIAL_SCRIPT = '/static/celestial.min.js';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => {
      resolve(true);
    });
    document.body.appendChild(script);
  });
};

const CelestialComponent = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [starname, setStarname] = useState(localStorage.getItem('starname') || '');

  const prevX = useRef(x);
  const prevY = useRef(y);

  useEffect(() => {
    prevX.current = x;
    prevY.current = y;
  }, [x, y]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newLatitude = localStorage.getItem('Latitude');
      const newAzimuth = localStorage.getItem('Azimuth');

      if (newLatitude !== x.toString() || newAzimuth !== y.toString()) {
        setX(Number(newLatitude));
        setY(Number(newAzimuth));
      }
    }, 1000); // 매 초마다 latitude, azimuth 체크

    return () => {
      clearInterval(intervalId); // 컴포넌트 unmount 시에 interval 해제
    };
  }, [x, y]);

  const intervalId = setInterval(() => {
    const newStarname = localStorage.getItem('starname');
    if (newStarname !== starname) {
      setStarname(newStarname);
    }
  }, 1000); // 매 초마다 starname 체크

  useEffect(() => {
    var urlA = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.json';
    d3.json(urlA).then(function (d) {
      for (let i = 0; i < 90; i++) {
        if (d.features[i] && d.features[i].properties && d.features[i].properties.ko) {
          let name = d.features[i].properties.ko;
          console.log(d.features[i].properties.ko);
          if (name === starname) {
            console.log(d.features[i].geometry.coordinates); // 고물자리의 좌표 설정
            let coordint = d.features[i].geometry.coordinates;
            setX(coordint[0]);
            setY(coordint[1]);
            fetch('http://127.0.0.1:5000/AutoControl', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify({ ra: coordint[0], dec: coordint[1] }),
            })
              .then((response) => response.json())
              .then((result) => {
                // 서버로부터 받은 응답 처리
                console.log(coordint);
                console.log(x);
                console.log(y);
              })
              .catch((error) => {
                // 에러 처리
                console.error('Error:', error);
              });
          }
        } else {
          console.log('Undefined or missing property at index', i);
        }
      }
    });
  }, [starname]); // 종속성 배열이 비어 있음

  useEffect(() => {
    if (prevX.current === 12 && prevY.current === 12 && x === 12 && y === 12) {
      return;
    } else if (prevX.current === 0 && prevY.current === 0 && x === 0 && y === 0) {
      return;
    }
    const loadAllScripts = async () => {
      await loadScript(D3_SCRIPT);
      await loadScript(D3_GEO_SCRIPT);
      await loadScript(CELESTIAL_SCRIPT);

      const config = {
        width: 900,
        projection: 'airy',
        center: [x, y], //안드로메다 자리 0.92, 44.72
        form: true,
        background: { fill: '#333', stroke: 'white', opacity: 1, width: 1 },
        formFields: {
          location: false,
          general: false,
          stars: true,
          dsos: false,
          constellations: true,
          lines: false,
          other: true,
        },
        culture: 'ko', // en으로 수정_sja
        container: 'celestial-map',
        datapath: 'https://ofrohn.github.io/data/',
        constellations: {
          show: true, //Show constellations
          names: true, //Show constellation names
          namesType: 'ko', //en으로 수정_ sja
          nameStyle: {
            fill: ['#fec', '#f6c', '#fec'],
            opacity: 0.9,
            font: [
              "bold 14px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
              "18px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
              "14px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
            ],
            align: 'center',
            baseline: 'middle',
          },
          lines: true, //Show constellation lines
          lineStyle: { stroke: ['#99c', '#f6c', '#99c'], width: [2, 2.5, 2], opacity: 0.75 },
          bounds: true, //Show constellation boundaries
          boundStyle: { stroke: '#ffff00', width: 1.0, opacity: 0.7, dash: [8, 4, 2, 4] },
        },
        stars: {
          limit: 5,
          propername: true,
          propernameStyle: {
            fill: '#9999bb',
            font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
            align: 'right',
            baseline: 'bottom',
          },
          propernameLimit: 2.5,
          designation: false,
          designationStyle: {
            fill: '#9999bb',
            font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
            align: 'left',
            baseline: 'top',
          },
          designationLimit: 2.5,
        },
        dsos: {
          show: false,
        },
        mw: {
          style: { fill: '#ffffff', opacity: 0.1 },
        },
        planets: {
          //Show planet locations
          show: false,
        },
      };
      console.log('CENTER바뀜::', [x, y]);
      window.Celestial.display(config);
    };

    loadAllScripts();
  }, [x, y]);

  return (
    //  marginLeft: '100px'으로 celestial 전체 위치 이동_ sja
    <div style={{ marginLeft: '70px' }}>
      <div style={{ overflow: 'hidden' }}>
        <div id='celestial-map'></div>
      </div>
      <div id='celestial-form'></div>
    </div>
  );
};

export default CelestialComponent;
