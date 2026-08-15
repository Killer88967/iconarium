import Octicon from "@/components/octicon";

type StatusKind = "loading" | "empty" | "error";

interface StatusPanelProps {
  kind: StatusKind;
  title: string;
  description?: string;
}

export default function StatusPanel({
  kind,
  title,
  description,
}: StatusPanelProps) {
  const icon =
    kind === "loading" ? "sync" : kind === "error" ? "alert" : "search";

  return (
    <div className={`status-panel status-panel-${kind}`}>
      <div className="status-panel-icon">
        <Octicon name={icon} size={24} />
      </div>

      <div>
        <strong>{title}</strong>

        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
