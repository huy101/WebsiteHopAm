// Tạo một mảng nốt nhạc và các hợp âm tương ứng
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Hàm để tìm nốt tiếp theo dựa trên số bán âm thay đổi
const transposeNote = (note, semitones) => {
  const noteWithoutModifier = note.match(/[A-G]#?/)[0]; // Tìm nốt cơ bản (C, D, E, v.v.)
  const modifier = note.replace(noteWithoutModifier, ''); // Phần còn lại của hợp âm (7, m, dim, v.v.)
  
  // Tìm vị trí của nốt trong danh sách
  const currentIndex = NOTES.indexOf(noteWithoutModifier);
  
  // Tính chỉ số mới sau khi thay đổi tone
  let newIndex = (currentIndex + semitones) % NOTES.length;
  if (newIndex < 0) newIndex += NOTES.length; // Đảm bảo chỉ số không âm

  return NOTES[newIndex] + modifier; // Trả về nốt mới và phần hợp âm giữ nguyên
};

// Hàm để chuyển đổi toàn bộ hợp âm trong bài hát
const transposeChords = (lyrics, semitones) => {
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
export { transposeChords, transposeNote };
export default transposeChords;
