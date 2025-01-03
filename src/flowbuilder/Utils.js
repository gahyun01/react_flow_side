// 노드 및 엣지 추가, 중복 제거, JSON 파일로 저장 등의 기능 구현

import { v4 as uuidv4 } from "uuid";
import { flowIcons } from "./flowIcons";
import _ from "lodash"; // 유틸리티 함수들을 ( 여러 가지의 계산과 처리를 대신해주는 라이브러리 함수 ) 제공하는 lodash 라이브러리 가져오기
import { MarkerType } from "reactflow";

// 노드의 유형을 정의하는 객체
export const NodeTypes = {
  StepNode: "StepNode", // 일반 단계 노드
  Condition: "Condition", // 조건 노드
  startNode: "startNode", // 시작 노드
  FloatNode: "FloatNode", // 플로팅 노드
  End: "EndNode", // 종료 노드
};

// 엣지의 유형을 정의하는 객체
export const EdgeTypes = {
  bridge: "bridge", // 아이콘만 표시되는 엣지
  custom: "custom", // 라벨과 아이콘이 있는 엣지
  default: "default", // 기본 엣지
  smoothstep: "smoothstep", // 부드럽게 연결되는 엣지
};


// 노드 유형 정의
export const nodeTypeStage = [
  {
    id: 1,
    label: "Input", // 라벨: 입력
    type: "StepNode", // 유형: StepNode
    stepType: "email", // 단계 유형: 이메일
  },
  {
    id: 2,
    label: "Condition", // 라벨: 조건
    type: "Condition", // 유형: Condition
    stepType: "email", // 단계 유형: 이메일
  },
  {
    id: 3,
    label: "End the process", // 라벨: 프로세스 종료
    type: "EndNode", // 유형: EndNode
    stepType: "email", // 단계 유형: 이메일
  },
];

// 조건과 관련된 노드 정의
export const nodeTypeCondtion = [
  {
    id: 1,
    label: "Condition", // 라벨: 조건
    Icon: flowIcons.HasEmail, // 아이콘: HasEmail
    type: "Condition", // 유형: Condition
    stepType: "email", // 단계 유형: 이메일
  },
];

// 초기 노드 데이터
const initialNodes = [
  {
    id: "start-node", // 고유 ID
    type: "startNode", // 노드 유형: 시작 노드
    position: { x: 0, y: 0 }, // 초기 위치
    data: {
      description: "Begin the process", // 설명: 프로세스 시작
      stepType: "start", // 단계 유형: 시작
      conditions: [], // 조건
    },
  },
];

// 초기 엣지 데이터
const initialEdges = [
  {
    id: "edge-button2", // 고유 ID
    source: "start-node", // 시작 노드 ID
    target: "node-4", // 대상 노드 ID
    type: "default", // 엣지 유형: 기본
    data: {
      condition: "", // 조건
      icon: false, // 아이콘 표시 여부
    },
    markerEnd: {
      type: MarkerType.Arrow, // 끝부분에 화살표 마커
      width: 24,
      height: 24,
      color: "#335CCB", // 화살표 색상
    },
  },
];

// 새로운 노드를 추가하는 함수
const addNewNode = (data, currentNode) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: {
      x: Math.floor(Math.random() * 100) + currentNode?.position?.x, // 현재 노드 위치를 기준으로 X축 계산
      y: Math.floor(Math.random() * 400) + currentNode?.position?.y - 20, // 현재 노드 위치를 기준으로 Y축 계산
    },
    data: {
      description: data.label,
      conditions: [], // 조건 초기화
    },
  };
  return newNode;
};

// 빈 노드를 추가하는 함수
const addEmptyNode = (data) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 400),
    },
    data: {
      description: data.label,
      stepType: data.stepType,
      conditions: [],
    },
  };
  return newNode;
};

// 위치, 크기 등을 설정하여 빈 노드를 추가하는 함수
const addBlankNode = (data) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: data.position,
    data: {
      description: data.label,
      stepType: data.stepType,
      conditions: [],
      height: data.height,
      width: data.width,
    },
  };
  return newNode;
};

// 플로팅 노드를 추가하는 함수
const addNewFloatNode = (currentNode) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: NodeTypes.FloatNode,
    position: { x: currentNode.position.x, y: currentNode.position.y + 100 },
    data: {
      description: "",
      stepType: "",
      conditions: [],
    },
  };
  return newNode;
};

// 새로운 조건 엣지를 추가하는 함수
const addNewConditionEdge = (sourceId, targetId, condition, icon) => {
  let newEdgeId = uuidv4();
  let newEdge = {
    id: newEdgeId,
    source: sourceId,
    target: targetId,
    labelBgBorderRadius: 4,
    type: EdgeTypes.custom,
    data: {
      condition,
      icon,
    },
    style: { stroke: "black", strokeWidth: "1.3" },
    markerEnd: {
      type: MarkerType.Arrow,
      width: 24,
      height: 24,
      color: "#335CCB",
    },
  };
  return newEdge;
};

// 일반 엣지를 추가하는 함수
const addNewEdge = (sourceId, targetId, type, condition) => {
  let newEdgeId = `${sourceId + ">" + targetId}`;
  let newEdge = {
    id: newEdgeId,
    source: sourceId,
    target: targetId,
    type: type,
    style: { stroke: "black", strokeWidth: "1.3" },
    labelBgBorderRadius: 4,
    markerEnd: {
      type: MarkerType.Arrow,
      width: 24,
      height: 24,
      color: "#335CCB",
    },
    data: {
      icon: false,
      condition: condition ?? "",
    },
  };
  return newEdge;
};

// 데이터를 JSON 파일로 내보내는 함수
const toJSON = (elements) => {
  const downloadLink = document.createElement("a");
  const fileBlob = new Blob([JSON.stringify(elements, null, 2)], {
    type: "application/json",
  });
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = `voiceBuilder.json`;
  downloadLink.click();
};

// 배열에서 중복 데이터를 제거하는 함수
const checkduplicity = (arrayData) => {
  const itemsData = arrayData.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arrayData.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  return itemsData;
};

// 두 배열의 공통 데이터를 필터링하는 함수
const removeDuplicates = (array1, array2) =>
  array1.filter((item) => array2.includes(item));

// ID를 기준으로 중복 제거하는 함수
function removeDuplicatesById(array1, array2) {
  const combinedArray = [...array1, ...array2];
  const uniqueArray = _.uniqBy(combinedArray, "id");
  return uniqueArray;
}

// ID를 기준으로 유사 항목 제거
function removeSimilarById(array1, array2) {
  const uniqueArray1 = _.differenceBy(array1, array2, "id");
  return uniqueArray1;
}

export {
  addNewNode,
  addNewFloatNode,
  addNewConditionEdge,
  addNewEdge,
  toJSON,
  checkduplicity,
  removeDuplicates,
  removeDuplicatesById,
  removeSimilarById,
  addEmptyNode,
  addBlankNode,
  initialNodes,
  initialEdges,
};
