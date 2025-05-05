
interface AgentDisplayProps {
  agentName: string;
}

export function AgentDisplay({ agentName }: AgentDisplayProps) {
  return (
    <div className="mb-4">
      <p className="font-semibold mb-1">Assign Agent</p>
      <p>{agentName || "No agent assigned"}</p>
    </div>
  );
}
