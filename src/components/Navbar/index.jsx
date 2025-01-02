import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toJSON } from '../../flowbuilder/Utils';

const Navbar = ({ jsonElements }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      {/* 상단 Navbar */}
      <div className="w-full h-[75px] px-6 flex justify-between items-center bg-white border border-zinc-900 border-opacity-20">
        <div
          className="h-6 flex items-center gap-4 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6 text-black" aria-hidden="true" />
          <p className="text-black text-base font-semibold">Voice Builder</p>
        </div>
        <div className="flex gap-2">
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
        >
          {/* Flowbuilder 컴포넌트를 여기에 넣으세요 */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
