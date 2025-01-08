// Tạo một mảng nốt nhạc và các hợp âm tương ứng
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Hàm để tìm nốt tiếp theo dựa trên số bán âm thay đổi
const transposeNote = (note, semitones) => {
  if (!note) return note; // Nếu không có hợp âm, trả lại nguyên bản

  const noteWithoutModifier = note.match(/[A-G]#?/)[0]; // Tìm nốt cơ bản (C, D, E, v.v.)
  const modifier = note.replace(noteWithoutModifier, ''); // Phần còn lại của hợp âm (7, m, dim, v.v.)
  
  // Tìm vị trí của nốt trong danh sách
  const currentIndex = NOTES.indexOf(noteWithoutModifier);
  
  // Nếu không tìm thấy nốt trong mảng
  if (currentIndex === -1) return note; // Trả lại hợp âm nguyên gốc nếu nốt không hợp lệ

  // Tính chỉ số mới sau khi thay đổi tone
  let newIndex = (currentIndex + semitones) % NOTES.length;
  if (newIndex < 0) newIndex += NOTES.length; // Đảm bảo chỉ số không âm

  return NOTES[newIndex] + modifier; // Trả về nốt mới và phần hợp âm giữ nguyên
};

// Hàm để chuyển đổi toàn bộ hợp âm trong bài hát
const transposeChords = (lyrics, semitones) => {
  if (!lyrics) return lyrics; // Nếu không có lyrics, trả lại nguyên văn

  return lyrics.map((line) => {
    const lines = line.verse.split("\n");
    // Xử lý từng dòng của lời bài hát
    const transposedLines = lines.map((sentence) => {
      // Tách lời và hợp âm ra
      return sentence.split(/(\[.*?\])/g).map((word) => {
        // Nếu là hợp âm (nằm trong [])
        if (word.startsWith('[') && word.endsWith(']')) {
          const chord = word.slice(1, -1); // Loại bỏ dấu [] xung quanh hợp âm
          const transposedChord = transposeNote(chord, semitones); // Chuyển đổi hợp âm
          return `[${transposedChord}]`; // Đặt lại dấu [] sau khi chuyển đổi
        }
        return word; // Nếu không phải hợp âm, trả lại nguyên văn lời bài hát
      }).join('');
    });
    return {
      ...line,
      verse: transposedLines.join("\n"), // Nối lại các dòng sau khi chuyển đổi
    };
  });
};
const chordImages = {
  'A#m': ["/img/Bbm/Bbm1.png", ],
  Bm: ["/img/Bm/Bm1.png", "/img/Bm/Bm2.png"],
  C: ["/img/C/C1.png", "/img/C/C2.png", "/img/C/C3.png"],
  D: ["/img/D/D1.png", "/img/D/D2.png", "/img/D/D3.png"],
  E: ["/img/E/E1.png", "/img/E/E2.png", "/img/E/E3.png"],
  F: ["/img/F/F1.png"],
  F7: ["/img/F/F7.png"],
  G: ["/img/G/G1.png", "/img/G/G2.png"],
  G7: ["/img/G/G7.png"],
  A: ["/img/A/A1.png", "/img/A/A2.png"],
  Em: ["/img/Em/Em1.png", "/img/Em/Em2.png", "/img/Em/Em3.png"],
  Cm: ["/img/Cm/Cm1.png", "/img/Cm/Cm2.png"],
  Dm: ["/img/Dm/Dm1.png", "/img/Dm/Dm2.png"],
  Am: ["/img/Am/Am1.png", "/img/Am/Am2.png"],
  B: ["/img/B/B1.png"],
  Gm: ["/img/Gm/Gm1.png"],
  "C#m": ["/img/Dbm/Dbm.png"],
  "C#": ["/img/D/Db.png"],
  "A#": ["/img/Bb/Bb.png"],
  "D#": ["/img/Eb/Eb.png"],
  "D#m": ["/img/Ebm/Ebm.png"],
  "F#m": ["/img/Gbm/Gbm.png"],
  Fm: ["/img/Fm/Fm1.png"],
  "G#m": ["/img/Abm/Abm.png"],
  "Abm": ["/img/Abm/Abm.png"],
  "Abm": ["/img/Abm/Abm.png"],
  "G#": ["/img/Ab/Ab.png"],
  "D#7": ["/img/Eb/Eb7.png"],
 

  A7: ["/img/A/A7.png"],
  E7: ["/img/E/E7.png","/img/E/E72.png"],
  B7: ["/img/B/B7.png","/img/B/B72.png"],
  C7: ["/img/C/C7.png"],
  D7: ["/img/D/D7.png"],
  "F#": ["/img/Gb/Gb1.png"],
  "F#7": ["/img/Gb/Gb7.png"],
};
const chordSounds = {
        C: ["/Audio/C.wav"],
        Cm: ["/Audio/Cm.wav"],

        D: ["/Audio/D.wav"],
        Dm: ["/Audio/Dm.wav"],

        E: ["/Audio/E.wav"],
        Em: ["/Audio/Em.wav"],
        E7: ["/Audio/E7.wav"],

        F: ["/Audio/F.wav"],
        Fm: ["/Audio/Fm.wav"],
       

        G: ["/Audio/G.wav"],
        Gm: ["/Audio/Gm.wav"],

        A: ["/Audio/A.wav"],
        Am: ["/Audio/Am.wav"],

        B: ["/Audio/B.wav"],
        Bm: ["/Audio/Bm.wav"],

     
    };
export { transposeChords, transposeNote,chordImages,chordSounds };
export default transposeChords;
