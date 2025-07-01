import { Calendar } from "lucide-react"

export function Loading({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Calendar className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
