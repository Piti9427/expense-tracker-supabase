-- เพิ่ม column type เพื่อแยกรายรับ/รายจ่าย
alter table expenses add column type text default 'expense' check (type in ('income', 'expense'));

-- เพิ่ม column tags สำหรับเก็บป้ายกำกับ (เป็น Array)
alter table expenses add column tags text[] default '{}';

-- เปลี่ยนชื่อตารางให้สื่อความหมายขึ้น (Transaction)
-- หมายเหตุ: ถ้าคุณกังวลเรื่องชื่อเดิม จะใช้ชื่อ expenses ต่อไปก็ได้ แต่ในที่นี้ขอเปลี่ยนเพื่อให้เป็นสากลครับ
-- alter table expenses rename to transactions; 
-- เพื่อความง่ายในตอนนี้ ผมจะใช้ชื่อเดิม 'expenses' แต่เพิ่มคุณสมบัติเข้าไปครับ
