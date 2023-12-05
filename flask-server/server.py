from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time
from asto_data_process import ETH, HA

class Telescope:
    current_angle = 12 #현재 지구 자기장을 기준으로 얼마만큼 망원경이 회전해서 놓여있는가 (dec)

    current_latitude = 234 #현재 위도 (dec)
    current_azimuth = 12 #현재 방위각 (dec)

    current_Latitude = 37.24080
    current_Longitude = 127.0796


    current_latitude_motor_angle = 0.0 #현재 위도 모터 각도 (dec)
    current_azimuth_motor_angle = 0.0 #현재 방위각 모터 각도 (dec)

    target_arduino_server_ip = "" #타깃 아두이노 서버의 ip주소

    is_connect = False #망원경에 세팅된 값이 있으면 True, 아니면 False

    #-------------------------------------------------------------------------------------------

    def __init__(self):
        pass

    def connect(self, ip):
        self.target_arduino_server_ip = ip
        self.current_angle = 0
        self.current_latitude = 0
        self.current_azimuth = 0
        connect_Data = {'current_angle': self.current_angle, 'current_latitude': self.current_latitude, 'current_azimuth': self.current_azimuth}
        self.current_latitude_motor_angle = 0.0
        self.current_azimuth_motor_angle = 0.0
        return connect_Data

    def disconnect(self):
        self.target_arduino_server_ip = ""
        
        self.current_angle = 0

        self.current_latitude = '-'
        self.current_azimuth = '-'

        self.current_latitude_motor_angle = 0
        self.current_azimuth_motor_angle = 0

        connect_Data = {'current_angle': self.current_angle, 'current_latitude': self.current_latitude, 'current_azimuth': self.current_azimuth}
        return connect_Data



    def TurnMotor(self, latitude, azimuth):
        temp_latitude_angle = self.current_latitude_motor_angle - float(latitude)
        temp_azimuth_angle = self.current_azimuth_motor_angle - float(azimuth)

        direction_l = None
        direction_a = None
        if temp_latitude_angle<0:
            direction_l = 0
        else:
            direction_l = 1

        if temp_azimuth_angle <0:
            direction_a = 1
        else:
            direction_a = 0

        
        self.current_latitude_motor_angle = float(latitude)
        self.current_azimuth_motor_angle = float(azimuth)
        
        current_motor = {'Latitude': abs(temp_latitude_angle), 'Azimuth': abs(temp_azimuth_angle), 'Latitude_Direction': direction_l, 'Azimuth_Direction': direction_a}
        return current_motor


    def Park(self):
        pass

    def Abort(self):
        pass

    # 지구 자전 맞춰 GOTO

class CommandLogReport:
    pass

telescope = Telescope()
log = CommandLogReport()

app = Flask(__name__)
CORS(app) 

@app.route('/connect_to_telescope', methods=['GET'])
def connect_to_telescope():
    try:
        result = telescope.connect("http://192.168.32.108")
        return jsonify(result)
    except:
        pass

@app.route('/disconnect_to_telescope', methods=['GET'])
def disconnect_to_telescope():
    try:
        result = telescope.disconnect()
        return jsonify(result)
    except:
        pass

@app.route('/abort', methods = ["GET"])
def abort():
    try:
        result = telescope.Abort()
        return jsonify(result)
    except:
        pass

@app.route('/park', methods = ['GET'])
def park():
    print("wow")
    angle_data = HA(float(telescope.current_latitude), float(telescope.current_azimuth), float(telescope.current_Latitude), float(telescope.current_Longitude))
    for i in range(10):

        altitude, azimuth = ETH(float(angle_data[0]), float(angle_data[1]), telescope.current_Latitude, telescope.current_Longitude)
        altitude = float(altitude)
        azimuth = float(azimuth)

        print(altitude, type(altitude), azimuth, type(azimuth))
        angle_data_process = telescope.TurnMotor(altitude, azimuth)
        response = requests.post("http://192.168.32.108/M", json=angle_data_process)
        telescope.disconnect()
        telescope.connect("http://192.168.32.108")
        time.sleep(0.5)
    result = telescope.Park()
    return jsonify({"data":1})

@app.route("/AutoControl", methods = ['POST'])
def auto_control():
    data = request.get_json()
    print(data)
    result2 = {"test":1}
    print(result2)
    print(float(data['ra']))
    altitude, azimuth = ETH(float(data['ra']),  float(data['dec']), telescope.current_Latitude, telescope.current_Longitude)
    altitude = float(altitude)
    azimuth = float(azimuth)

    print(altitude, type(altitude), azimuth, type(azimuth))
    angle_data = telescope.TurnMotor(altitude, azimuth)
    response = requests.post("http://192.168.32.108/M", json=angle_data)

    return jsonify(result2)

@app.route("/ManualControl", methods = ['POST'])
def manual_control():
    data = request.get_json()
    print(data['Latitude'])
    print(data['Azimuth'])
    
    angle_data = telescope.TurnMotor(data['Latitude'], data['Azimuth'])

    response = requests.post("http://192.168.32.108/M", json=angle_data)
    return jsonify(data)

@app.route('/ManualControl_Precise', methods = ['POST'])
def manual_control_precise():
    data = request.get_json()
    print(data)
    if data['direction'] == "Right" or data['direction'] == 'Left':
        if data['direction'] == "Right":
            angle_data = {"Latitude": 0, "Azimuth": data['Azimuth_dec'], "Latitude_Direction": 0, "Azimuth_Direction": 0}
        else:
            angle_data = {"Latitude": 0, "Azimuth": data['Azimuth_dec'], "Latitude_Direction": 0, "Azimuth_Direction": 1}
    else:
        if data['direction'] == "Right":
            angle_data = {"Latitude": data['Latitude_dec'], "Latitude_Direction": 0, "Azimuth_Direction": 0}
        else:
            angle_data = {"Latitude": data['Latitude_dec'], "Latitude_Direction": 1, "Azimuth_Direction": 0}
    response = requests.post("http://192.168.32.108/M", json=angle_data)
    return jsonify(data)
# 특정한 파이썬 함수의 예시

if __name__ == '__main__':
    app.run(debug=True)