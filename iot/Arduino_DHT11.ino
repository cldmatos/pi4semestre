#include <dht.h>

const int pinoDHT11 = A2;
dht DHT;

const int totalLeituras = 30;

void setup() {
  Serial.begin(9600);
  delay(2000);
}

void loop() {
  for (int i = 0; i < totalLeituras; i++) {
    DHT.read11(pinoDHT11);
    float temperatura = DHT.temperature;
    float umidade = DHT.humidity;
    
    // Envia a leitura no formato "temperatura,umidade"
    Serial.print(temperatura, 0);
    Serial.print(",");
    Serial.println(umidade, 0);
    
    delay(2000);
  }

  // Trava o loop após 90 leituras
  while (true);
}
