import React, { Fragment, useEffect, useState } from "react";
import SideBarTopPortion from "./SideBarTopPortion"; // 경로 수정
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ErrorMessage from "./ErrorMessage"; // 경로 수정
import { Transition } from "@headlessui/react";
import useUpdateNode from "../../hooks/useUpdateNode"; // 경로 수정
import { Button } from "../Button"; // 경로 수정
import { nanoid } from "nanoid";
import AutoComplete from "./AutoComplete"; // 경로 수정
import { NodeTypes } from "../../flowbuilder/Utils"; // 경로 수정
import { getConnectedEdges, useReactFlow } from "reactflow";
import useUpdateEdge from "../../hooks/useUpdateEdge"; // 경로 수정

const SideBar = ({ sideBarOpen, currentSideData, setOpenSidebar }) => {
  const { getNodes, getEdges } = useReactFlow();
  const allNodes = getNodes();
  const except = allNodes.filter((item) => item.type !== NodeTypes.startNode);
  const exceptFloat = except.filter(
    (item) => item.type !== NodeTypes.FloatNode
  );
  const FinalNode = exceptFloat.filter(
    (item) => item.id !== currentSideData.id
  );

  const renderNodes = FinalNode.map((item) => ({
    node: item.data.description,
    id: item.id,
  }));
  const addInput = () => {
    append({ id: nanoid(8), value: "", step: "" });
  };

  const initialDefault = {
    description: "",
    gotoStep: "",
  };
  const [defaultValues, setdefaultValues] = useState(initialDefault);
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });
  const { handleSubmitNode } = useUpdateNode();
  const { handleSubmitEdge } = useUpdateEdge();

  const edges = getConnectedEdges([currentSideData], getEdges()).filter(
    (item) => item.source !== "start-node" && item.source === currentSideData.id
  );

  useEffect(() => {
    if (currentSideData) {
      setdefaultValues((prev) => ({
        ...prev,
        description:
          currentSideData?.data?.description ||
          currentSideData?.data?.condition,
        gotoStep: currentSideData?.data?.gotoStep,
        conditions: edges.map((item) => {
          const step = FinalNode.find((i) => i.id === item.target).data;
          return {
            id: item.id,
            value: item.data.condition,
            step: { id: item.target, node: step.description },
            target: item.target,
          };
        }),
      }));
    }
  }, [currentSideData]);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "conditions",
    }
  );

  const onSubmit = async (data) => {
    if (currentSideData.source) {
      handleSubmitEdge(data, currentSideData);
    } else {
      handleSubmitNode(data, currentSideData);
    }
    reset();
    setOpenSidebar(false);
  };

  return (
    <Transition appear show={sideBarOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          style={{
            width: sideBarOpen ? "40%" : "0%",
            overflow: "auto",
          }}
          className="sidebarWrapper shadow-lg"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4">
              <SideBarTopPortion item={currentSideData} />
              <div className="space-y-5">
                {/* ... 나머지 코드 */}
              </div>
            </div>
          </form>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default SideBar;
