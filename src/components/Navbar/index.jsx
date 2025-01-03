import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toJSON } from '../../flowbuilder/Utils';
import { Flowbuilder } from '../../flowbuilder/Flowbuilder';

const Navbar = ({ jsonElements }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-[500px] h-screen bg-gray-100">
      {/* 상단 Navbar */}
      <div className="w-full h-[75px] px-6 flex justify-between items-center bg-white border border-zinc-900 border-opacity-20">
        <div className="flex gap-4 cursor-pointer w-auto" onClick={() => navigate(-1)}>
          <ArrowLeftIcon style={{ width: '24px', height: '24px' }} className="text-black" aria-hidden="true" />
          <p className="text-black text-base font-semibold">Voice Builder</p>
        </div>
        <div className="flex justify-between">
          <button
            className="rounded-lg py-2.5 px-6 bg-blue-800 text-white font-medium shadow-md hover:bg-blue-700"
            onClick={() => toJSON(jsonElements)}
          >
            Extract JSON
          </button>
          <button className="rounded-lg py-2.5 px-6 bg-green-600 text-white font-medium shadow-md hover:bg-green-500">
            Execute
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 p-6">
        {/* Flowbuilder와 같은 메인 컴포넌트 렌더링 */}
        <div
          className="w-full h-full bg-white rounded-lg shadow-md border border-gray-300"
          id="flowbuilder-container"
          style={{ width: '100%', height: 'calc(100vh - 75px)' }} /* 원하는 높이를 계산하여 지정 */
        >
          <Flowbuilder jsonElements={jsonElements} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;