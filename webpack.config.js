const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),  // 'src' 폴더를 '@'로 설정
    },
  },
};
