"use client"

import { FC } from "react"

import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { ControllerRenderProps } from "react-hook-form"

import { cn } from "@/lib/utils"

import { useIsMounted } from "@/hooks/use-is-mounted"

import { SaveProductSchema } from "@/features/admin/features/products/lib/product.schema"

import { MenuBar, RichEditorSkeleton } from "./components"
import "./styles/editor.css"

interface RichTextEditorProps
  extends ControllerRenderProps<SaveProductSchema, "description"> {
  editorClassName?: string
  hasError?: boolean
  placeholder?: string
}

export const RichTextEditor: FC<RichTextEditorProps> = ({
  editorClassName,
  value,
  onChange,
  hasError,
  placeholder = "Write something...",
}) => {
  const isMounted = useIsMounted()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Highlight,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        // Only show placeholder when editor is empty
        showOnlyWhenEditable: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!editor.getText()) {
        onChange("")
        return
      }
      onChange(editor.getHTML())
    },
    /**
     * This option gives us the control to enable the default behavior of rendering the editor immediately.
     */
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[156px] border placeholder:text-muted-foreground px-3 py-2 rounded-md",
          "focus-visible:border-ring focus-visible:ring-ring/50 bg-transparent outline-none focus-visible:ring-[3px] shadow-xs transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
          hasError ? "border-destructive" : "border-input",
          editorClassName,
        ),
      },
    },
  })

  // Show loading state when not mounted
  if (!isMounted) {
    return <RichEditorSkeleton />
  }

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}
