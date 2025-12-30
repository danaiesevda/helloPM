import {
  Bug,
  Sparkles,
  TrendingUp,
  FileText,
  Zap,
  Shield,
  Tag,
} from "lucide-react"

// Label icons mapping by label name
export const labelIcons: Record<string, React.ReactNode> = {
  "Bug": <Bug className="h-3 w-3" />,
  "Feature": <Sparkles className="h-3 w-3" />,
  "Improvement": <TrendingUp className="h-3 w-3" />,
  "Documentation": <FileText className="h-3 w-3" />,
  "Performance": <Zap className="h-3 w-3" />,
  "Security": <Shield className="h-3 w-3" />,
}

export function getLabelIcon(labelName: string, className?: string) {
  const icons: Record<string, React.ReactNode> = {
    "Bug": <Bug className={className || "h-3 w-3"} />,
    "Feature": <Sparkles className={className || "h-3 w-3"} />,
    "Improvement": <TrendingUp className={className || "h-3 w-3"} />,
    "Documentation": <FileText className={className || "h-3 w-3"} />,
    "Performance": <Zap className={className || "h-3 w-3"} />,
    "Security": <Shield className={className || "h-3 w-3"} />,
  }
  return icons[labelName] || <Tag className={className || "h-3 w-3"} />
}





