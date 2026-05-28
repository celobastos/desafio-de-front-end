import { StatusShell } from "@/components/StatusShell";

export default function NotFound() {
  return (
    <StatusShell
      title="City not found"
      message="Select one of the listed cities to view weather details."
      backHref="/"
    />
  );
}
