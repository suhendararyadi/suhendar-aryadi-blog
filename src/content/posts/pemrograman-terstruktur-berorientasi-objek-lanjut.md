---
title: "Pemrograman Terstruktur & Berorientasi Objek Lanjut: Dari Class, Object, sampai Inheritance"
description: "Materi Pemrograman Berbasis Teks, Grafis, dan Multimedia — Fase F, Kelas XI RPL. Memahami paradigma OOP, Encapsulation, Inheritance, dan Polymorphism."
pubDate: 2026-07-21
author: "Suhendar Aryadi, S.Pd.,Gr."
tags: ["OOP", "Pemrograman", "Java", "RPL", "Class", "Inheritance"]
category: "Web Development"
featured: true
image: "https://cdn.hashnode.com/uploads/covers/6591788256571c18b0eaa950/9f6afff4-c4ed-471a-bf66-e00b80fea353.jpg"
---

Dalam dunia rekayasa perangkat lunak modern, menulis kode yang sekadar "jalan" tidaklah cukup. Kode yang kita bangun harus mudah dipelihara (*maintainable*), mudah dikembangkan (*scalable*), dan dapat digunakan kembali (*reusable*).

Untuk mencapai hal tersebut, para pengembang aplikasi menggunakan paradigma **Object-Oriented Programming (OOP) / Pemrograman Berorientasi Objek**.

---

## Konsep Dasar: Class dan Object

- **Class (Cetakan / Blueprint)**: Rancangan abstrak yang mendefinisikan atribut (property) dan perilaku (method).
- **Object (Wujud Nyata)**: Hasil instansiasi dari sebuah Class.

```java
// Contoh Class di Java
public class Mobil {
    String merk;
    String warna;
    int kecepatanMaks;

    void jalankan() {
        System.out.println("Mobil " + merk + " melaju!");
    }
}
```

---

## 4 Pilar Utama OOP

1. **Encapsulation (Pembungkusan Data)**: Menyembunyikan detail internal objek dan hanya menyediakan akses melalui method getter & setter.
2. **Inheritance (Pewarisan Sifat)**: Kemampuan sebuah class anak (*subclass*) untuk mewarisi atribut dan method dari class induk (*superclass*).
3. **Polymorphism (Banyak Bentuk)**: Kemampuan method untuk memiliki perilaku yang berbeda tergantung pada objek yang memanggilnya (Overriding & Overloading).
4. **Abstraction (Abstraksi)**: Menyembunyikan kompleksitas implementasi dan hanya menampilkan fungsi penting kepada pengguna.

Kuasai konsep OOP ini untuk menjadi pengembang perangkat lunak profesional di industri software house!
