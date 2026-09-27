# URBANSTEP — Interactive Web Application

โปรเจกต์เดี่ยววิชา Discrete Mathematics for IT
แนวคิดหลัก: Graph Theory, Weighted Graph, Dijkstra และ Tree

## ไฟล์
- `index.html` — หน้า Shop / Product Catalog
- `routes.html` — หน้า Route Finder
- `detail.html` — หน้า Order Detail / Path
- `ticket.html` — หน้า E-Ticket
- `style.css` — UI ทั้งระบบ
- `app.js` — Product data, Graph, Dijkstra, cart และ interaction

## Graph
Vertex 7 จุด:
- Warehouse
- HubA
- HubB
- StoreA
- StoreB
- StoreC
- จุดเชื่อมที่ใช้งานผ่าน adjacency list

Edge แต่ละเส้นมี Weight เป็น `time` และ `fare`
ระบบใช้ Dijkstra 3 แบบ:
1. เร็วที่สุด — weight = time
2. ประหยัดที่สุด — weight = fare
3. Recommended — weight = time + fare × 0.25

## Tree
Root: All Locations
- Parent: Hubs
  - Child: North Hub
  - Child: East Hub
- Parent: Stores
  - Leaf: Siam Store
  - Leaf: Ari Store
  - Leaf: Rama IX Store

## วิธีเปิด
ดับเบิลคลิก `index.html` หรือเปิดด้วย Live Server ใน VS Code

## GitHub Pages
อัปโหลดไฟล์ทั้งหมดเข้า repository แล้วเปิด Settings > Pages > Deploy from branch
เลือก branch `main` และ folder `/root`

หมายเหตุ: ระบบตะกร้าและ ticket เป็น demo ฝั่ง browser ไม่ใช่ระบบชำระเงินจริง
