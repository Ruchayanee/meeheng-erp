# Meeheng ERP Overview

Meeheng ERP เป็นระบบจัดการโรงงานมีเฮงฟู้ดบน Google Apps Script และ Google Sheets

ระบบชุดแรกครอบคลุมงานประจำวันตั้งแต่รับวัตถุดิบ ผลิต ตัดสต๊อก ขาย บันทึกค่าใช้จ่าย และดู Dashboard

## Modules

- Inventory
- Production
- Vendor Sales
- Accounting
- Owner Dashboard

## Data Source

Google Sheets เป็นฐานข้อมูลหลัก โดย Apps Script จะสร้าง sheet และ header ให้อัตโนมัติผ่านฟังก์ชัน `setupDatabase`

## Product Recipes

สูตรตั้งต้นมี 2 สินค้า:

- ลูกชิ้นสูตรใหญ่
- หมูยอสูตรหลัก
