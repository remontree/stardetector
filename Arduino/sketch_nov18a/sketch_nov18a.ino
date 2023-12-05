#include "WiFiEsp.h"
#include "ArduinoJson.h"

//----------------------------------------------------------------------------------------------------------------------------------- wifi
// Emulate Serial1 on pins 6/7 if not present
#ifndef HAVE_HWSERIAL1
#include "SoftwareSerial.h"
SoftwareSerial Serial1(6, 7); // RX, TX
#endif

char ssid[] = "Galaxy_S225508";            // your network SSID (name)
char pass[] = "12345678";        // your network password
int status = WL_IDLE_STATUS;

WiFiEspServer server(80);

// use a ring buffer to increase speed and reduce memory allocation
RingBuffer buf(8);

void sendHttpResponse(WiFiEspClient client)
{
  // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
  // and a content-type so the client knows what's coming, then a blank line:
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:text/html");
  client.println();
  client.print("The LED is ");
  client.println("<br>");
  client.println("<br>");
  client.println("Click <a href=\"/H\">here</a> turn the LED on<br>");
  client.println("Click <a href=\"/L\">here</a> turn the LED off<br>");
  client.println();
}

void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  // print where to go in the browser
  Serial.println();
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
  Serial.println();
}

//----------------------------------------------------------------------------------------------------------------------------------- wifi

//----------------------------------------------------------------------------------------------------------------------------------- motor

#define Motor_L_Enable 10
#define Motor_L_Direction 9
#define Motor_L_Step 8

#define Motor_A_Enable 7
#define Motor_A_Direction 6
#define Motor_A_Step 5

int dec_to_time(int dec){
  return dec*1;
}

void turnMotor_Latitude(int dec, int direction){
  Serial.println(dec);
  int decTime = dec_to_time(dec);
  digitalWrite(Motor_L_Direction, direction);
  for(int i=0;i<decTime;i++){
    digitalWrite(Motor_L_Step, HIGH);
    delayMicroseconds(500);
    digitalWrite(Motor_L_Step, LOW);
    delayMicroseconds(500);
  }
  return;
}

void turnMotor_Azimuth(int dec, int direction){
  Serial.println(dec);
  int decTime = dec_to_time(dec);
  digitalWrite(Motor_A_Direction, direction);
  for(int i=0;i<decTime;i++){
    digitalWrite(Motor_A_Step, HIGH);
    delayMicroseconds(1000);
    digitalWrite(Motor_A_Step, LOW);
    delayMicroseconds(1000);
  }
  return;
}


void handleMotorRequest(WiFiEspClient client) {
  String postData = "";

  bool flag = false;
  while (client.available()) {
    char c = client.read(); // 클라이언트에서 바이트를 읽어옵니다.
    if(c=='{') flag = true;
    if(flag==true) postData += c; // 읽은 바이트를 postData 문자열에 추가합니다.
    if(c=='}') flag = false;
  }

  //Serial.println(postData);

  // String을 const char*로 변환합니다.
  const char* jsonString = postData.c_str();

  StaticJsonDocument<200> jsonDocument;
  DeserializationError error = deserializeJson(jsonDocument, (const char*)jsonString);

  // JSON 파싱이 성공적으로 이루어졌는지 확인합니다.
  if (error) {
    Serial.print("JSON 파싱 오류: ");
    Serial.println(error.c_str());
    return; // 파싱 오류 시 함수를 종료합니다.
  }

  // JSON 데이터에서 필요한 값들을 읽어와서 사용할 수 있습니다.
  int Latitude = atoi(jsonDocument["Latitude"].as<String>().c_str()); // "Latitude"에 해당하는 값 읽기
  int Azimuth = atoi(jsonDocument["Azimuth"].as<String>().c_str()); // "Azimuth"에 해당하는 값 읽기
  int direction_l = atoi(jsonDocument["Latitude_Direction"].as<String>().c_str());
  int direction_a = atoi(jsonDocument["Azimuth_Direction"].as<String>().c_str());

  String response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n";
  response += "POST 요청이 성공적으로 처리되었습니다.";
  client.print(response);

  turnMotor_Latitude(Latitude,direction_l);
  turnMotor_Azimuth(Azimuth, direction_a);
}

//----------------------------------------------------------------------------------------------------------------------------------- motor

void setup()
{
  Serial.begin(115200);   // initialize serial for debugging

  //---------------------------------------------------------------------------------------------------------------------------------- motor
  pinMode(Motor_L_Enable, OUTPUT);
  pinMode(Motor_L_Direction, OUTPUT);
  pinMode(Motor_L_Step, OUTPUT);

  digitalWrite(Motor_L_Enable, LOW);

  pinMode(Motor_A_Enable, OUTPUT);
  pinMode(Motor_A_Direction, OUTPUT);
  pinMode(Motor_A_Step, OUTPUT);

  digitalWrite(Motor_A_Enable, LOW);

  //---------------------------------------------------------------------------------------------------------------------------------- motor

  //---------------------------------------------------------------------------------------------------------------------------------- wifi
  Serial1.begin(9600);    // initialize serial for ESP module
  WiFi.init(&Serial1);    // initialize ESP module

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true);
  }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(ssid, pass);
  }

  Serial.println("You're connected to the network");
  printWifiStatus();

  // start the web server on port 80
  server.begin();
  //---------------------------------------------------------------------------------------------------------------------------------- wifi
}


void loop()
{
  WiFiEspClient client = server.available();  // listen for incoming clients
  if (client) {                               // if you get a client,
    Serial.println("New client");             // print a message out the serial port
    buf.init();                               // initialize the circular buffer
    while (client.connected()) {              // loop while the client's connected
      if (client.available()) {               // if there's bytes to read from the client,
        char c = client.read();               // read a byte, then
        buf.push(c);                          // push it to the ring buffer

        if (buf.endsWith("\r\n\r\n")) {
          sendHttpResponse(client);
          break;
        }
        // Check to see if the client request was "GET /H" or "GET /L":

        if(buf.endsWith("GET /Connect")){

          break;
        }


        if(buf.endsWith("GET /Disconnect")){

          break;
        }


        if(buf.endsWith("GET /Park")){

          break;
        }


        if(buf.endsWith("GET /Abort")){

          break;
        }

        if(buf.endsWith("POST /M")){
          handleMotorRequest(client);
          break;
        }

        if(buf.endsWith("POST /ManualControl_Precise")){
          //handleMotorRequest(client);
          break;
        }

        if(buf.endsWith("POST /AutoControl")){
          break;
        }

      }
    }
    // close the connection
    client.stop();
    
    Serial.println("Client disconnected");
  }
}

