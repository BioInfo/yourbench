"use client"

import dynamic from "next/dynamic"

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
)

export interface YAMLEditorProps {
  defaultValue: string
  onChange?: (value: string | undefined) => void
}

export function YAMLEditor({ defaultValue, onChange }: YAMLEditorProps) {
  return (
    <div className="h-[600px] border rounded-md overflow-hidden">
      <MonacoEditor
        defaultValue={defaultValue}
        language="yaml"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
        }}
        onChange={onChange}
      />
    </div>
  )
}