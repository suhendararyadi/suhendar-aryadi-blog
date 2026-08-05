---
title: "Ringkasan Konsep Dasar Pemrograman ESP32: Sistem Deteksi Suhu & Kebocoran Gas IoT"
description: "Mengembangkan sistem Internet of Things (IoT) berbasis mikrokontroler ESP32, sensor DHT11/MQ-2, dan Wi-Fi communication."
pubDate: 2025-07-29
author: "Suhendar Aryadi, S.Pd.,Gr."
tags: ["ESP32", "IoT", "Internet of Things", "Sensor", "C++"]
category: "Internet of Things (IoT)"
featured: false
image: "https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/NEqR20e6eY4/upload/e0d7f97d9a1a454bf01510eb8e59161e.jpeg"
---

Mikrokontroler **ESP32** adalah salah satu chip paling populer untuk membangun proyek **Internet of Things (IoT)** karena telah dilengkapi modul Wi-Fi dan Bluetooth bawaan dengan harga yang sangat terjangkau.

Artikel ini merangkum cara membangun sistem deteksi suhu dan kebocoran gas menggunakan ESP32 dan Arduino IDE.

---

## Komponen Hardware yang Dibutuhkan

- **ESP32 NodeMCU Board**
- **Sensor Suhu DHT11 / DHT22**
- **Sensor Kebocoran Gas MQ-2 / MQ-5**
- **Buzzer Alarm 5V & LED Indikator**
- **Breadboard & Kabel Jumper Dupont**

---

## Kode Program Sederhana (Arduino C++)

```cpp
#include <WiFi.h>
#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT11
#define MQ2PIN 34

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(MQ2PIN, INPUT);
  Serial.println("ESP32 IoT Sensor Ready!");
}

void loop() {
  float temp = dht.readTemperature();
  int gasVal = analogRead(MQ2PIN);
  
  Serial.print("Suhu: "); Serial.print(temp);
  Serial.print(" °C | Gas Level: "); Serial.println(gasVal);
  delay(2000);
}
```

Proyek IoT berbasis ESP32 ini sangat menarik untuk dijadikan bahan Proyek Tugas Akhir siswa RPL & Elektronika!
