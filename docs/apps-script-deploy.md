# วิธี Deploy Meeheng ERP บน Google Apps Script

## เตรียมโปรเจกต์

1. ไปที่ Google Apps Script
2. สร้าง project ใหม่ หรือเปิดจาก Google Sheets ที่ต้องการใช้เป็นฐานข้อมูล
3. เพิ่มไฟล์ตามโฟลเดอร์ `apps-script/`
4. ถ้าใช้ manifest ให้เปิด Project Settings แล้วเลือก Show `appsscript.json`
5. วางเนื้อหา `apps-script/appsscript.json`

## ไฟล์ที่ต้องมีใน Apps Script

- `Code.gs`
- `database.gs`
- `recipe.gs`
- `inventory.gs`
- `production.gs`
- `sales.gs`
- `accounting.gs`
- `index.html`
- `appsscript.json`

## ตั้งค่าฐานข้อมูล

1. เลือกฟังก์ชัน `setupDatabase`
2. กด Run
3. อนุญาตสิทธิ์ Google Sheets และ Script storage
4. ระบบจะสร้างหรือผูก Google Sheets พร้อมแท็บหลัก:
   - `Inventory`
   - `Recipes`
   - `StockMovements`
   - `ProductionLogs`
   - `SalesLogs`
   - `Expenses`
   - `Vendors`

## Deploy Web App

1. กด Deploy
2. เลือก New deployment
3. Type เลือก Web app
4. Execute as เลือก Me
5. Who has access เลือกตามการใช้งานจริง เช่น Only myself หรือ Anyone in organization
6. กด Deploy
7. เปิด Web app URL

## Deployment ล่าสุด

- Apps Script project: https://script.google.com/d/169i03_Ix8bd9QP1lWCXqu0atagWnhLH89qWjFua2O5MkaOX_ZVGHO5Kf/edit
- Web app: https://script.google.com/macros/s/AKfycbwptw33KUebRlZiwONLAHXaAxcCXF75LDTn577ysZm7CXZoYlzJywKjEuX_vDD2QLV7eA/exec
- Access: anyone with Google sign-in

## การใช้งานประจำวัน

- แท็บ `รับเข้า`: เพิ่มวัตถุดิบ ของแพ็ค หรืออุปกรณ์โรงงาน
- แท็บ `ผลิต`: เลือกลูกชิ้นหรือหมูยอ แล้วบันทึกจำนวนชุดผลิต
- แท็บ `ขาย`: บันทึกยอดขายหน้าร้านหรือแม่ค้า
- แท็บ `บัญชี`: บันทึกค่าใช้จ่ายเพิ่มเติม เช่น ค่าแก๊ส ค่าแผง ค่าแรง
- แท็บ `สต๊อก`: ตรวจจำนวนคงเหลือและรายการต่ำกว่าเกณฑ์
- แท็บ `สูตร`: ตรวจสูตรที่ระบบใช้ตัดสต๊อก

## หมายเหตุเรื่องหน่วย

สูตรที่ให้มามีบางรายการใช้หน่วย `tbsp` เช่น พริกไทยขาวและพริกไทยดำ ระบบจึงตั้งสต๊อกสองรายการนี้เป็น `tbsp` เพื่อให้ตัดสต๊อกได้ตรงกับสูตรทันที หากต้องการรับซื้อเป็น `kg` ควรเพิ่มอัตราแปลงหน่วยก่อนใช้งานจริงในระดับบัญชีต้นทุนละเอียด
