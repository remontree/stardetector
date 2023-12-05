import React from 'react';
import './sidereal_min.css';
import './index_c.js';
import './set_defaults_min.js';
import $ from 'jquery';
window.$ = $;

class Sphere extends React.Component {
    render() {
        return (
            <div id="wrapper">
                <div id="riseSetArea"></div>
                <br />
                <div id="starCharts">
                    <h1>Local Star Charts</h1>
                    <p>Location 1: <span id="place1"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Longitude: <span id="long1"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Latitude: <span id="lat1"></span></p>
                    <div id="warning1"></div>
                    <p>Local Time: <span id="time1"></span>,&nbsp;&nbsp;&nbsp; Sidereal Time: <span id="siderealTime1"></span></p>
                    <div className="canvaswrapper">
                        <canvas id="loc1" width="800" height="800">CANVAS NOT SUPPORTED IN THIS BROWSER!</canvas>
                        <div id="tip1" className="tip">
                            <div className="close" onClick={() => this.closePopup("tip1")}>&#10005;</div>
                            <div id="tip1text"></div>
                        </div>
                    </div>
                    <div className="control">
                        <p>Show/Hide: <button id="showPlanets1" className="active" onClick={() => this.showHide(1, "Planets")}>Sun, Moon, Planets</button> {/* ... */}</p>
                        <p>Azimuth at the top = <input type="number" name="rotation" id="rotate1" style={{width: '40px'}} /> degrees.
                            <input type="submit" value="Submit" onClick={() => this.rotInput(1)} /></p>
                        <div id="errRotate1"></div>
                    </div>
                    <p className="animate"><button className="setupAnimate" onClick={() => this.displayAnimationSetup(1)}>Animation Setup</button> {/* ... */}</p>
                    <div id="animationSetup1"></div>
                    <br /><br /><br />
                </div>
                <br /><br />
                <footer>
                    <hr />
                    <p style={{textAlign: 'center'}}>&copy; 2018&ndash;2023 by Yuk Tung Liu</p>
                </footer>
            </div>
        );
    }
}

export default Sphere;
