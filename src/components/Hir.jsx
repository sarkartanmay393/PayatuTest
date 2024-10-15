import React, { useState, useEffect, useRef } from "react";

export default function TreeStructure() {
  const [state, dispatch] = useState(fileStructure);

  const handleStateChange = (path = [], checked) => {
    if (path.length === 0) {
      return;
    }
    const topMostNode = state.find((node) => node.name === path[0]);
    if (topMostNode) {
      const updatedNode = updateState(topMostNode, path.slice(1), checked);
      dispatch(
        state.map((node) => (node.name === path[0] ? updatedNode : node))
      );
    }
  };

  const updateState = (node, path = [], value) => {
    if (path.length === 0) {
      return updateNestedNodes(node, value);
    } else {
      const childNode = node.children.find((n) => n.name === path[0]);
      if (childNode) {
        const updatedChild = updateState(childNode, path.slice(1), value);
        const updatedChildrenOfCurrentNode = node.children.map((n) =>
          n.name === updatedChild.name ? updatedChild : n
        );

        const allChecked = updatedChildrenOfCurrentNode.every(
          (child) => child.checked && !child.indeterminate
        );
        const someChecked = updatedChildrenOfCurrentNode.some(
          (child) => child.checked || child.indeterminate
        );

        return {
          ...node,
          children: updatedChildrenOfCurrentNode,
          checked: allChecked,
          indeterminate: !allChecked && someChecked,
        };
      } else {
        return node;
      }
    }
  };

  const updateNestedNodes = (node, value) => {
    return {
      ...node,
      checked: value,
      indeterminate: false,
      children: node.children.map((child) => updateNestedNodes(child, value)),
    };
  };

  return (
    <ol className="space-y-2 flex flex-col items-start border-l-[0.1px]">
      {state.map((node, idx) => (
        <RenderNode
          key={node.name}
          node={node}
          idx={++idx}
          path={[node.name]}
          handleStateChange={handleStateChange}
        />
      ))}
    </ol>
  );
}

const RenderNode = ({ node, idx, path, handleStateChange }) => {
  const checkboxRef = useRef();

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = node.indeterminate;
    }
  }, [node.indeterminate]);

  if (node.children.length === 0) {
    return (
      <li key={path.join(",")} className="ml-6 flex justify-center items-center">
        <input
          ref={checkboxRef}
          type="checkbox"
          className="mr-2"
          checked={node.checked}
          onChange={(e) => handleStateChange(path, e.target.checked)}
        />
        {node.name}
      </li>
    );
  }

  return (
    <li key={path.join(",")} className="ml-6">
      <input
        ref={checkboxRef}
        type="checkbox"
        className="mr-2"
        checked={node.checked}
        onChange={(e) => handleStateChange(path, e.target.checked)}
      />
      {node.name}
      <ul className="border-l-[0.1px]">
        {node.children.map((c, i) => (
          <RenderNode
            key={path.concat(c.name).join(",")}
            node={c}
            idx={++i}
            path={[...path, c.name]}
            handleStateChange={handleStateChange}
          />
        ))}
      </ul>
    </li>
  );
};

const fileStructure = [
  {
    name: "home",
    checked: false,
    indeterminate: false,
    children: [
      {
        name: "h1",
        checked: false,
        indeterminate: false,
        children: [
          {
            name: "h11",
            checked: false,
            indeterminate: false,
            children: [
              {
                name: "h111",
                checked: false,
                indeterminate: false,
                children: [],
              },
            ],
          },
          {
            name: "h12",
            checked: false,
            indeterminate: false,
            children: [
              {
                name: "h121",
                checked: false,
                indeterminate: false,
                children: [],
              },
              {
                name: "h122",
                checked: false,
                indeterminate: false,
                children: [],
              },
              {
                name: "h123",
                checked: false,
                indeterminate: false,
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "nestedNode",
        checked: false,
        indeterminate: false,
        children: [],
      },
    ],
  },
  {
    name: "about",
    checked: false,
    indeterminate: false,
    children: [],
  },
];
