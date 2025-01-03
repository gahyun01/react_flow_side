import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactFlowProvider } from "reactflow"; // ReactFlowProvider import
import { Flowbuilder } from "./flowbuilder/Flowbuilder"; // Flowbuilder를 import
import Navbar from "./components/Navbar"; // Navbar 컴포넌트 import

function App() {
  return (
    <div className="App">
      <ReactFlowProvider> {/* ReactFlowProvider로 감싸기 */}
        <Router>
          {/* Navbar는 모든 페이지에서 항상 렌더링 */}
          <Navbar />
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
