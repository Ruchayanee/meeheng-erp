# Database Schema

Meeheng ERP ใช้ Google Sheets เป็นฐานข้อมูลหลัก โดย `setupDatabase` จะสร้าง sheet และ header ให้อัตโนมัติ

## Inventory

เก็บ master รายการสต๊อกและยอดคงเหลือปัจจุบัน

| Field | Description |
| --- | --- |
| item_id | รหัสรายการ |
| item_name | ชื่อรายการ |
| item_type | raw_material, packaging, factory_supply, finished_good |
| category | หมวดสินค้า |
| unit | หน่วยหลัก |
| on_hand | ยอดคงเหลือ |
| reorder_level | จุดเตือนสต๊อกต่ำ |
| active | เปิด/ปิดการใช้งาน |
| updated_at | เวลาอัปเดตล่าสุด |

## Recipes

เก็บสูตรผลิตต่อ 1 ชุดผลิต

| Field | Description |
| --- | --- |
| recipe_id | รหัสสูตรรายวัตถุดิบ |
| product_id | รหัสสินค้าสำเร็จรูป |
| product_name | ชื่อสินค้าสำเร็จรูป |
| version | เวอร์ชันสูตร |
| ingredient_id | รหัสวัตถุดิบ |
| ingredient_name | ชื่อวัตถุดิบ |
| qty_per_batch | จำนวนที่ใช้ต่อชุด |
| unit | หน่วยที่ใช้ในสูตร |

## StockMovements

บันทึก ledger การเคลื่อนไหวสต๊อกทุกครั้ง

| Field | Description |
| --- | --- |
| movement_id | รหัส movement |
| datetime | เวลา |
| type | RECEIVE, PRODUCTION_CONSUME, PRODUCTION_OUTPUT, SALE_OUT, ADJUSTMENT |
| item_id | รหัสรายการ |
| item_name | ชื่อรายการ |
| qty | จำนวนบวก/ลบ |
| unit | หน่วย |
| balance_after | ยอดหลังรายการนี้ |
| ref_type | ประเภทเอกสารอ้างอิง |
| ref_id | รหัสเอกสารอ้างอิง |
| note | หมายเหตุ |
| user | ผู้บันทึก |

## ProductionLogs

บันทึกการผลิตแต่ละครั้ง

| Field | Description |
| --- | --- |
| production_id | รหัสการผลิต |
| datetime | เวลา |
| product_id | รหัสสินค้า |
| product_name | ชื่อสินค้า |
| batches | จำนวนชุดผลิต |
| output_qty | จำนวนสินค้าสำเร็จรูปที่เพิ่ม |
| unit | หน่วยสินค้า |
| status | สถานะ |
| note | หมายเหตุ |
| user | ผู้บันทึก |

## SalesLogs

บันทึกยอดขายและช่องทางขาย

| Field | Description |
| --- | --- |
| sale_id | รหัสขาย |
| datetime | เวลา |
| vendor_name | แม่ค้า/ช่องทาง |
| product_id | รหัสสินค้า |
| product_name | ชื่อสินค้า |
| qty | จำนวนขาย |
| unit | หน่วย |
| unit_price | ราคาต่อหน่วย |
| total | ยอดรวม |
| note | หมายเหตุ |
| user | ผู้บันทึก |

## Expenses

บันทึกค่าใช้จ่ายทั้งหมด

| Field | Description |
| --- | --- |
| expense_id | รหัสค่าใช้จ่าย |
| datetime | เวลา |
| category | หมวดค่าใช้จ่าย |
| description | รายละเอียด |
| amount | ยอดเงิน |
| note | หมายเหตุ |
| ref_type | ประเภทเอกสารอ้างอิง |
| ref_id | รหัสเอกสารอ้างอิง |
| user | ผู้บันทึก |

## Vendors

เก็บรายชื่อช่องทางขายหรือแม่ค้า

| Field | Description |
| --- | --- |
| vendor_id | รหัสช่องทาง |
| vendor_name | ชื่อช่องทาง |
| phone | เบอร์โทร |
| active | เปิด/ปิดการใช้งาน |
