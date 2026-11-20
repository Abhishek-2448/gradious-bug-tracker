import { labelOf } from "../utils/constants.js";

function Badge({ value }) {
  return <span className={`badge badge-${value}`}>{labelOf(value)}</span>;
}

export default Badge;
