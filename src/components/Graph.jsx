import { useState } from 'react';

const nodeCoords = [
  [122.5, 186],
  [317.5, 135],
  [158.5, 410],
  [247.5, 257]
]

const edgeCoords = [
  [168.5, 267,]
]

const Graph = ({ active }) => {
  const [nodes, setNodes] = useState(nodeCoords);
  const [edges, setEdges] = useState(edgeCoords);

  return (
    <div className="w-100px">
      <svg viewBox="0 0 388.5 451"
        width="388.5px"
        height="451px">
          {/* nodes */}
        {nodes.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="10"
              fill="#7388FF"
              stroke="#25369A"
              stroke-width="1"
            />
        ))}
        {/* edges */}
      </svg>
    </div >
  )
}

export default Graph;