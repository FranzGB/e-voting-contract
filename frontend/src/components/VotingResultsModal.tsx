import React from "react";
import { Modal } from "react-bootstrap";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type VotingResultProps = {
  show: boolean;
  handleClose: () => void;
  proposalTitle: string;
  yesVotes: number;
  noVotes: number;
  blankVotes: number;
};
const COLORS = ["#167347", "#E11017", "#C9ADD6"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const VotingResultsModal: React.FunctionComponent<VotingResultProps> = ({
  yesVotes,
  noVotes,
  blankVotes,
  show,
  handleClose,
  proposalTitle,
}) => {
  const data = [
    { name: "In Favor", value: yesVotes },
    { name: "Against", value: noVotes },
    { name: "Blank", value: blankVotes },
  ];
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header className="bg-dark" closeButton>
        <Modal.Title>
          Results for
          <i> {proposalTitle}</i>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">
        Total Registered Voters: {yesVotes + noVotes + blankVotes}
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Legend />
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Modal.Body>
    </Modal>
  );
};

export default VotingResultsModal;
