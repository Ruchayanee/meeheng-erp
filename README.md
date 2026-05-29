# Meeheng ERP

ระบบ ERP สำหรับโรงงานมีเฮงฟู้ด (Meeheng Food) บน Google Apps Script และ Google Sheets

## สถานะล่าสุด

เวอร์ชันนี้พร้อมใช้เป็นระบบปฏิบัติงานชุดแรกแล้ว:

- ตั้งค่าฐานข้อมูล Google Sheets อัตโนมัติ
- รับวัตถุดิบ/ของเข้า และบันทึกต้นทุนเป็นค่าใช้จ่ายได้
- ผลิตลูกชิ้นและหมูยอตามสูตรที่ให้ไว้ พร้อมเช็กสต๊อกก่อนตัด
- ตัดวัตถุดิบและเพิ่มสินค้าสำเร็จรูปอัตโนมัติ
- บันทึกยอดขาย พร้อมตัดสต๊อกสินค้าสำเร็จรูป
- บันทึกค่าใช้จ่าย และสรุปกำไรเบื้องต้นรายเดือน
- Dashboard สำหรับยอดขาย การผลิต และรายการสต๊อกต่ำกว่าเกณฑ์

## Core Modules

- Inventory
- Production
- Vendor Sales
- Accounting
- Owner Dashboard

## Tech Stack

- Google Apps Script
- Google Sheets
- HTML/CSS/JS
- GitHub

## ใช้งานครั้งแรก

Web app ที่ deploy แล้ว:
https://script.google.com/macros/s/AKfycbwptw33KUebRlZiwONLAHXaAxcCXF75LDTn577ysZm7CXZoYlzJywKjEuX_vDD2QLV7eA/exec

1. เปิด Google Apps Script project ใหม่ หรือ project ที่ผูกกับ Google Sheets
2. คัดลอกไฟล์ทั้งหมดใน `apps-script/` เข้า Apps Script project
3. รันฟังก์ชัน `setupDatabase` หนึ่งครั้งเพื่อสร้าง sheet และ seed ข้อมูลตั้งต้น
4. Deploy เป็น Web app
5. เปิด URL ของ Web app แล้วเริ่มใช้งานจากหน้า Meeheng Food ERP

ดูรายละเอียดเพิ่มที่ `docs/apps-script-deploy.md`

## Business Flow

รับวัตถุดิบ → ผลิต → ตัดสต๊อก → เพิ่มสินค้าสำเร็จรูป → แม่ค้า/หน้าร้านขาย → Dashboard realtime → สรุปกำไรขาดทุน
