import { useId } from "react"

import { Label } from "@/components/ui/label"
import { SelectNative } from "@/components/ui/select-native"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Select with auto-width (native)</Label>
      <div className="w-fit">
        <SelectNative id={id}>
          <option value="1">React</option>
          <option value="2">Next.js</option>
          <option value="3">Astro</option>
          <option value="4">Gatsby</option>
        </SelectNative>
      </div>
    </div>
  )
}
