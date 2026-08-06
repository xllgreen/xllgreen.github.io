/*
 * 闪卡（Flashcards）数据
 * 卡组 key 与 SkillPage/*.html 文件名一一对应（去掉 .html）。
 * 每套卡组可填 {q, a} 数组；空缺的学科保持空数组，页面会提示"暂未录入"。
 * 你只需在各 deck 里补充自己的题目即可。
 */
window.FLASHCARDS = {
  // ===== 示例学科（已预填几题，方便先看效果） =====
  "Physiology-PMPH-10edition": [
    { q: "静息电位主要由哪种离子的跨膜浓度差和平衡电位决定？", a: "K⁺（钾离子）。静息时膜对 K⁺ 通透性最高，静息电位接近 K⁺ 平衡电位（Ek）。" },
    { q: "动作电位的「全或无」(all-or-none) 是指什么？", a: "刺激达到阈值后，动作电位幅度不随刺激强度增大而增大；未达阈值则不产生动作电位。" },
    { q: "心肌细胞动作电位平台期（2期）主要由哪种离子流形成？", a: "Ca²⁺ 缓慢内流（L型钙通道）与 K⁺ 外流相平衡，形成平台。" },
    { q: "肾小球滤过率（GFR）指的是什么？", a: "单位时间内（每分钟）两肾生成的超滤液量，正常约 125 mL/min。" },
    { q: "突触传递中，突触前膜释放神经递质依赖于哪种离子内流？", a: "Ca²⁺ 内流触发突触小泡与前膜融合、释放递质。" }
  ],
  "Biochemistry-and-Molecular-Biology-PMPH-10edition": [
    { q: "三羧酸循环（TCA）的三个限速酶是什么？", a: "柠檬酸合酶、异柠檬酸脱氢酶、α-酮戊二酸脱氢酶复合体。" },
    { q: "ATP 中高能磷酸键水解的标准自由能大约是多少？", a: "约 -30.5 kJ/mol（ΔG°′ ≈ -7.3 kcal/mol）。" },
    { q: "DNA 复制的方向性如何描述？", a: "新链按 5′→3′ 方向合成；前导链连续、后随链以冈崎片段不连续合成。" },
    { q: "Watson-Crick 双螺旋中，碱基配对原则是什么？", a: "A=T（2个氢键），G≡C（3个氢键）。" }
  ],

  // ===== 其余学科（待你录入题目） =====
  "Chinese-Medicine-10edition": [],
  "Diagnostics-PMPH-10edition": [],
  "Histology-and-Embryology-PMPH-10edition": [],
  "Internal-Medicine-PMPH-10edition": [],
  "Medical-Cell-Biology-PMPH-7edition": [],
  "Medical-Genetics-8edition": [],
  "Medical-Imaging-9thEdition": [],
  "Medical-Microbiology-PMPH-10edition": [],
  "Obstetrics-And-Gynecology-PMPH-10edition": [],
  "Pathology-PMPH-10edition": [],
  "Pathophysiology-PMPH-10edition": [],
  "Pediatrics-PMPH-10edition": [],
  "Pharmacology-PMPH-10edition": [],
  "Surgery-PMPH-10edition-": [],
  "systematic-anatomy-10edition": []
};

/* 学科显示名（用于卡组选择器）。缺省用 key 原样。 */
window.FLASHCARD_TITLES = {
  "Physiology-PMPH-10edition": "生理学（第10版）",
  "Biochemistry-and-Molecular-Biology-PMPH-10edition": "生物化学与分子生物学（第10版）",
  "Chinese-Medicine-10edition": "中医学（第10版）",
  "Diagnostics-PMPH-10edition": "诊断学（第10版）",
  "Histology-and-Embryology-PMPH-10edition": "组织学与胚胎学（第10版）",
  "Internal-Medicine-PMPH-10edition": "内科学（第10版）",
  "Medical-Cell-Biology-PMPH-7edition": "医学细胞生物学（第7版）",
  "Medical-Genetics-8edition": "医学遗传学（第8版）",
  "Medical-Imaging-9thEdition": "医学影像学（第9版）",
  "Medical-Microbiology-PMPH-10edition": "医学微生物学（第10版）",
  "Obstetrics-And-Gynecology-PMPH-10edition": "妇产科学（第10版）",
  "Pathology-PMPH-10edition": "病理学（第10版）",
  "Pathophysiology-PMPH-10edition": "病理生理学（第10版）",
  "Pediatrics-PMPH-10edition": "儿科学（第10版）",
  "Pharmacology-PMPH-10edition": "药理学（第10版）",
  "Surgery-PMPH-10edition-": "外科学（第10版）",
  "systematic-anatomy-10edition": "系统解剖学（第10版）"
};
