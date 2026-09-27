# JERSEY LAB — Interactive Web Application

โครงงานเดี่ยววิชา Discrete Mathematics for IT: ร้านเสื้อฟุตบอลจำลองที่นำ Graph Theory และ Tree มาใช้จริงในระบบ

## 4 หน้าจอ
1. `index.html` — Shop / Tree category picker
2. `compare.html` — เปรียบเทียบเส้นทางจัดส่งด้วย Dijkstra
3. `detail.html` — รายละเอียดสินค้า + Path + ค่าส่ง
4. `ticket.html` — E‑Ticket / สรุป Weight รวม

## การแมปกับโจทย์
### Tree
Root = JERSEY LAB  
Level 1 = ประเภทสินค้า  
Level 2 = ลีก/รายการ  
Level 3 = เสื้อ (Leaf)

ดังนั้น Root → Category → League → Jersey เป็น Path จาก Root ไป Leaf

### Weighted Graph
Vertex = Warehouse / Distribution Hub / Customer  
Edge = ช่วงการขนส่งระหว่าง Vertex  
Weight = เวลา (นาที) และค่าใช้จ่าย (บาท)

มี Vertex มากกว่า 6 จุด และ Edge มากกว่า 7 เส้น พร้อม Adjacency List ใน `app.js`

### Dijkstra
ระบบคำนวณ 3 แบบ:
- FASTEST: weight = เวลา
- CHEAPEST: weight = ค่าส่ง
- BALANCED: weight = เวลา + 0.65 × ค่าส่ง

จึงเห็นผลของการเปลี่ยนความหมายของ Weight ต่อ Shortest Path

## ราคาและค่าส่ง
ราคาสินค้าในเดโมอิงจากรายการเสื้อฟุตบอลบน Nike Thailand ที่ค้นพบล่าสุด:
- Stadium หลายรุ่น: ฿2,900
- Authentic/Match หลายรุ่น: ฿4,600
- บางรายการลดราคา เช่น Brazil 2026 Stadium Home: ฿1,740
ค่าส่งมาตรฐานอิง Nike Thailand:
- ฿150 เมื่อยอดต่ำกว่า ฿5,500
- ฟรีเมื่อยอดตั้งแต่ ฿5,500
ข้อมูลนี้เป็น "ราคาอ้างอิงเพื่อการศึกษา" ไม่ใช่ร้าน Nike และเว็บนี้ไม่ใช่ระบบสั่งซื้อจริง

## Prompt AI 3 ตัวอย่างสำหรับรายงาน
1. "ออกแบบ Interactive Web Application ร้านเสื้อฟุตบอล 4 หน้าจอ โดยต้องใช้ Tree และ Weighted Graph ตามเกณฑ์วิชา Discrete Mathematics for IT"
2. "เขียน JavaScript Adjacency List และ Dijkstra ที่คำนวณเส้นทางเร็วที่สุด ประหยัดที่สุด และแบบสมดุล พร้อมอธิบายแต่ละ Step"
3. "ตรวจสอบว่าโครงงานมี Vertex ≥ 6, Edge ≥ 7, Tree ≥ 3 ระดับ, Root/Parent/Child/Leaf และ Path ครบหรือไม่ และเสนอวิธีสาธิตในห้อง"

## วิธีเปิด
เปิด `index.html` ใน browser หรืออัปโหลดทั้งโฟลเดอร์ขึ้น GitHub Pages

> หมายเหตุ: ภาพเสื้อเป็น SVG mockup ที่สร้างในโค้ดเพื่อหลีกเลี่ยงการดึงภาพสินค้าจริงจากผู้ให้บริการโดยตรง แต่ใช้ชื่อรุ่น/ราคาอ้างอิงเพื่อให้ระบบสาธิตสมจริง
