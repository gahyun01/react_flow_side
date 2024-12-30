import dagre from "dagre";
import _ from "lodash";

// 공통 유틸리티 함수, 예를 들어 layout 관련 설정 등을 포함합니다.
const getLayoutedElements = (_elements, nodeWidth = 367, nodeHeight = 90) => {
  const elements = _.cloneDeep(_elements);
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  const getEdges = elements.filter((item) => item.source);

  elements.forEach((el) => {
    if (el.type === "node") {
      const connectedEdge = getConnectedEdges(new Array(el), getEdges);
      dagreGraph.setNode(el.id, {
        width: el.width || nodeWidth,
        height: connectedEdge[0]?.type === "custom" ? 140 : el.height || nodeHeight,
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (el.type === "node") {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.position = {
        x: nodeWithPosition.x - (el.width || nodeWidth) / 2,
        y: nodeWithPosition.y - (el.height || nodeHeight) / 2,
      };
    }
    return el;
  });
};

export { getLayoutedElements };
