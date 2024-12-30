import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactFlowProvider } from "reactflow"; // ReactFlowProvider import
import { Flowbuilder } from "./flowbuilder/Flowbuilder"; // Flowbuilder를 import
import './styles/globals.css'; // 글로벌 스타일 시트 불러오기
import './styles/styles.css';  // 추가 스타일 시트 불러오기

function App() {
  return (
    <div className="App">
      <ReactFlowProvider> {/* ReactFlowProvider로 감싸기 */}
        <Router>
          <Routes>
            {/* 홈 페이지 라우팅 */}
            <Route path="/" element={<Flowbuilder />} />
          </Routes>
        </Router>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
