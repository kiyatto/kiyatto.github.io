import { useState } from 'react';

const nodeCoords = [
    [122.5, 186],
    [317.5, 135],
    [158.5, 410],
    [247.5, 257]
]

const Graph = () => {
    const [nodes, setNodes] = useState(nodeCoords);

    return (
      <svg viewBox="0 0 388.5 451">
      {nodes.map(([x, y], i) => (
        <circle
          cx={x}
          cy={y}
          r="10"
        />
      ))}
    </svg>
  )
}

export default Graph;