import homeStarSvg from '../assets/graph/home-star.svg';

const NODE = {
  active: { fill: '#F98972', stroke: '#562016' },
  muted: { fill: '#FFD5CC', stroke: '#F98972' },
};

export function NodeCircle({ size = 20, muted = false }) {
  const { fill, stroke } = muted ? NODE.muted : NODE.active;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9.5" fill={fill} stroke={stroke} />
    </svg>
  );
}

export function HomeStar({ size = 23 }) {
  return (
    <img
      src={homeStarSvg}
      alt=""
      width={size}
      height={size}
      className="block"
      draggable={false}
    />
  );
}
