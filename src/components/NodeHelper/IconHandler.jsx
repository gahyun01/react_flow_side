// UI 컴포넌트
import React from "react";
import { NodeTypes } from "../../utils/Utils";  // 경로 수정
import { Imaged } from "../flowIcons";  // 경로 수정

const IconHandler = ({ props, data }) => {
  return (
    <>
      {props?.nodeData?.type === NodeTypes.startNode ? (
        <p></p>
      ) : (
        <button className="py-2 px-2 nodrag  bg-white text-black font-semibold hover:border-none rounded hover:outline-none focus:outline-none focus:none focus:none">
          <Imaged stepType={data?.stepType} />
        </button>
      )}
    </>
  );
};

export default IconHandler;
