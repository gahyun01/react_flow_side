// React와 React의 상태 관리(useState), 메모이제이션(useCallback) 훅을 가져옴 
import React, { useState, useCallback } from "react";

// React Flow의 주요 구성 요소와 유틸리티를 가져옴
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
  addEdge,
  MarkerType,
  updateEdge,
  useReactFlow,
  SelectionMode,
} from "reactflow";

// 노드 선택을 위한 모달 컴포넌트 가져오기
import SelectNodeModal from "../flowbuilder/SelectNodeModal";

// 노드 타입, 초기 엣지 및 노드 데이터를 가져옴
import { NodeTypes, initialEdges, initialNodes } from "../flowbuilder/Utils";

// 노드 선택 탭 컴포넌트 가져오기
import NodeSelectTab from "../flowbuilder/NodeSelectTab";

// Flowbuilder 전용 커스텀 훅 가져오기
import useFlowBuilder from "../hooks/useFlowBuilder";

// 사이드바 컴포넌트 가져오기
import SideBar from "../components/sideBar";

// DOM 요소의 크기를 가져오는 커스텀 훅 가져오기
import useElementSize from "../hooks/useElementSize";

import { v4 as uuidv4 } from "uuid";
// import _ from "lodash";
import './styles.css'; // 
import '../styles/styles.css';
import '../styles/flowbuilder.css';
import "reactflow/dist/style.css";

// Flowbuilder 컴포넌트 정의
const Flowbuilder = () => {

  // 커스텀 훅에서 상태와 메서드들을 가져옴
  const {
    stepActionHandle,
    stepBlankNode,
    setIsModalOpen,
    setCurrentNode,
    setCurrentSideData,
    isModalOpen,
    currentSideData,
    nodeTypes,
    edgeTypes,
  } = useFlowBuilder();

  // React Flow의 화면 좌표를 플로우 좌표로 변환하는 메서드
  const { screenToFlowPosition } = useReactFlow();

  // 'onlySteps' 상태 관리 (특정 조건에서만 작동 여부를 설정)
  const [onlySteps, setOnlySteps] = useState(false);

  // 사이드바 열림 여부를 관리하는 상태와 메서드
  const [openSidebar, setOpenSidebar] = useState(false);

  // DOM 요소의 크기를 측정하는 커스텀 훅 사용
  const [size, ref] = useElementSize();

  // 노드 상태를 관리하는 React Flow 훅 사용
  const [nodePosition, setNodePosition] = useState({});

  // 노드와 엣지 상태를 관리하는 React Flow 훅 사용
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  // React Flow 인스턴스를 저장하기 위한 상태와 메서드
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // React Flow의 프로 옵션 설정 (크레딧 표시 숨김)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // React Flow의 프로 옵션 설정 (크레딧 표시 숨김)
  const proOptions = { hideAttribution: true };

  const handleNodeClick = useCallback(
    (event, node) => {

      // 노드 클릭 시 동작을 정의하는 함수
      const tagName = event.target?.tagName;

      // 클릭된 요소의 태그 이름 확인
      if (tagName !== "DIV" && node.type === NodeTypes.FloatNode) {
        setCurrentNode(node);
        setIsModalOpen(true);
        setOnlySteps(false);
      } 
      // 특정 타입의 노드는 동작을 무시
      else if (node.type === NodeTypes.FloatNode) {
        return;
      } 
      // 사이드 데이터 업데이트 및 사이드바 열기
      else {
        setCurrentSideData(node);
        setOpenSidebar(true);
      }
    },
    [setCurrentNode, setIsModalOpen, setOnlySteps, setCurrentSideData]
  );

  // 현재 노드와 엣지를 JSON 형식으로 저장 ( JSON == Dictionary )
  const extractedJsonStructure = { nodes, edges };

  // 초기 뷰포트(화면의 중심 좌표와 줌 수준) 설정
  const defaultViewport = {
    x: size.width / 2 || 750,
    y: 20,
    zoom: 1,
  };

  // 엣지 연결 시 동작 정의
  const onConnect = useCallback(
    (params) => {
      // 같은 노드끼리 연결 방지
      if (params.source === params.target) return;

      // 새로운 엣지 추가
      const addNewEdge = {
        id: uuidv4(),
        source: params.source,
        target: params.target,
        type: "custom",
        style: { stroke: "black", strokeWidth: "1" },
        labelBgBorderRadius: 4,
        markerEnd: {
          type: MarkerType.Arrow,
          width: 24,
          height: 24,
          color: "#335CCB",
        },
        data: {
          icon: false,
          condition: "",
        },
      };

      // 기존 엣지에 새 엣지를 추가
      setEdges((eds) => addEdge({ ...addNewEdge, ...params }, eds));
    },
    [setEdges]
  );

  // 엣지 업데이트 시 동작 정의
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  // 노드 선택 시 동작 정의
  const handleInitialPosition = (e) => {
    const { clientX, clientY, offsetX, offsetY } = e.nativeEvent;
    const targetIsPane = e.target.classList.contains("react-flow__pane");
    if (targetIsPane) {
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      setNodePosition({
        allPos: { clientX, clientY, offsetX, offsetY },
        position,
      });
    }
  };

  // 드래그 종료 시 최종 위치 저장
  const handleLastPosition = (e) => {
    const { clientX, clientY, offsetX, offsetY } = e.nativeEvent;
    const lastNodePosition = { clientX, clientY, offsetX, offsetY };
    const singleBlankNode = getNodeDimensionsAndPosition(
      nodePosition.allPos,
      lastNodePosition
    );
    Object.assign(singleBlankNode, {
      type: "blank",
      label: "Blank Node",
      id: uuidv4(),
      position: nodePosition.position,
    });
    stepBlankNode(singleBlankNode);
  };

  // 두 점 간의 노드 크기와 위치 계산
  function getNodeDimensionsAndPosition(obj1, obj2) {
    const width = Math.abs(obj2.clientX - obj1.clientX);
    const height = Math.abs(obj2.clientY - obj1.clientY);
    const left = Math.min(obj1.clientX, obj2.clientX);
    const top = Math.min(obj1.clientY, obj2.clientY);

    return {
      width: width,
      height: height,
      left: left,
      top: top,
    };
  }

  return (
    <div style={{ height: "calc(100vh - 75px)", width: "100vw" }} className="flex justify-center gap-y2 bg-white">
      <div className="bg-white" style={{ width: openSidebar && currentSideData.id ? "calc(100% - 40px)" : "100%" }}>
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edges}
          onEdgeUpdate={onEdgeUpdate}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={proOptions}
          zoomOnScroll={false}
          zoomOnPinch={false}
          elementsSelectable={true}
          onInit={setReactFlowInstance}
          zoomOnDoubleClick={false}
          panOnScroll
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectionMode={SelectionMode.Partial}
          defaultViewport={defaultViewport}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={(e, f) => { }}
          onNodeClick={(e, f) => handleNodeClick(e, f)}
        >
          <Controls showInteractive={false} position="bottom-left" />

          {/* 격자무늬 배경 */}
          <Background gap={100} color="rgb(243 244 246)" size={3} variant={BackgroundVariant.Lines} />
          
          <Panel position="top-left">
            <button onClick={() => setIsModalOpen(true)}>Add Empty Node</button>
          </Panel>
        </ReactFlow>
      </div>
      {openSidebar && currentSideData.id && <SideBar currentSideData={currentSideData} />}
      <SelectNodeModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <NodeSelectTab stepActionHandle={stepActionHandle} />
      </SelectNodeModal>
    </div>

  );
};

export { Flowbuilder };
