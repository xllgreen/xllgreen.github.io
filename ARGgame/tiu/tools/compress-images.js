const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const SRC = 'C:/Users/Administrator/Desktop/TIU/backup_png';
const DST = 'C:/Users/Administrator/Desktop/TIU/images';
// ★ 关键词图（图内文字是解谜线索）：q85 保文字清晰；背景图 q75
const KEY = new Set(['11','12','13','14','15','16','17','19','21','22','23','24','25','26','28','30','32','35','39','40']);
(async () => {
  let total = 0, totalOld = 0;
  for (let i = 1; i <= 42; i++) {
    const n = String(i).padStart(2, '0');
    const src = path.join(SRC, n + '.png');
    if (!fs.existsSync(src)) { console.log('缺少原图', n); continue; }
    const key = KEY.has(n);
    const meta = await sharp(src).metadata();
    let img = sharp(src);
    if (meta.width > 1600 || meta.height > 1600) {
      img = img.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
    }
    const out = path.join(DST, n + '.webp');
    const oldSize = fs.existsSync(out) ? fs.statSync(out).size : 0;
    await img.webp({ quality: key ? 85 : 75 }).toFile(out);
    const newSize = fs.statSync(out).size;
    total += newSize; totalOld += oldSize;
    console.log(n, key ? '★' : ' ', (oldSize/1024).toFixed(0)+'KB ->', (newSize/1024).toFixed(0)+'KB');
  }
  console.log('总计:', (totalOld/1024/1024).toFixed(1)+'MB ->', (total/1024/1024).toFixed(1)+'MB');
})();
