import React from "react";
import { useState, useEffect } from "react";

type CollapsibleProps = {
  id: string;
  index: number;
  collapsed: boolean;
  toggleCollapase: (id: string) => void;
};

const CollapsibleArrow: React.FC<CollapsibleProps> = (props) => {
  const [arrow, setArrow] = useState(props.collapsed ? "►" : "▼");

  useEffect(() => {
    setArrow(props.collapsed ? "►" : "▼");
  }, [props.collapsed]);

  return (
    <h1
      className="font-gilroy text-xl whitespace-nowrap font-medium cursor-pointer"
      onClick={() => props.toggleCollapase(props.id)}
    >
      {arrow} Question {props.index + 1}
    </h1>
  );
};

export default CollapsibleArrow;
