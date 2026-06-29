import { CheckCircle } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  
  return <CheckCircle className="w-4 h-4 text-blue-500 inline-flex ml-1 shrink-0" />;
}