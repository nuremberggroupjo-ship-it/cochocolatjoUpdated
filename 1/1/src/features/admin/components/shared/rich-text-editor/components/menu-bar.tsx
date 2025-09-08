import { FC, JSX } from "react"

import { type Editor } from "@tiptap/react"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

import { AppTooltip } from "@/components/shared/app-tooltip"

interface MenuBarProps {
  editor: Editor | null
}

type Option = {
  icon: JSX.Element
  label: string
  onClick: () => void
  pressed?: boolean
  disabled?: boolean
}

export const MenuBar: FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  const options: Option[] = [
    {
      icon: <UndoIcon className="size-4" />,
      label: "Undo (Ctrl + Z)",
      onClick: () => editor.chain().focus().undo().run(),
      pressed: editor.isActive("undo"),
      disabled: !editor.can().undo(),
    },
    {
      icon: <RedoIcon className="size-4" />,
      label: "Redo (Ctrl + Shift + Z)",
      onClick: () => editor.chain().focus().redo().run(),
      pressed: editor.isActive("redo"),
      disabled: !editor.can().redo(),
    },
    {
      icon: <Heading1Icon className="size-4" />,
      label: "Heading 1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2Icon className="size-4" />,
      label: "Heading 2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3Icon className="size-4" />,
      label: "Heading 3",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <BoldIcon className="size-4" />,
      label: "Bold (Ctrl + B)",
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <ItalicIcon className="size-4" />,
      label: "Italic (Ctrl + I)",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <StrikethroughIcon className="size-4" />,
      label: "Strikethrough (Ctrl + Shift + S)",
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <UnderlineIcon className="size-4" />,
      label: "Underline (Ctrl + U)",
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("underline"),
    },
    {
      icon: <AlignLeftIcon className="size-4" />,
      label: "Left (Ctrl + Shift + L)",
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenterIcon className="size-4" />,
      label: "Center (Ctrl + Shift + E)",
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRightIcon className="size-4" />,
      label: "Right (Ctrl + Shift + R)",
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <AlignJustifyIcon className="size-4" />,
      label: "Justify (Ctrl + Shift + F)",
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      pressed: editor.isActive({ textAlign: "justify" }),
    },
    {
      icon: <ListIcon className="size-4" />,
      label: "Bullet List (Ctrl + Shift + 8)",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrderedIcon className="size-4" />,
      label: "Numbered List (Ctrl + Shift + 7)",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <HighlighterIcon className="size-4" />,
      label: "Highlight",
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ]
  return (
    <div className="bg-sidebar z-50 space-x-2 rounded-md border p-1">
      {options.map(({ icon, onClick, pressed, label, disabled }, index) => (
        <AppTooltip
          key={index}
          trigger={
            <div className="mr-0 inline-block">
              <Toggle
                key={index}
                aria-label={`Toggle ${index}`}
                className="data-[state=on]:bg-primary/60 hover:bg-primary/20 hover:text-foreground cursor-pointer transition-all duration-200"
                pressed={pressed}
                onPressedChange={onClick}
                disabled={disabled}
              >
                {icon}
              </Toggle>
            </div>
          }
        >
          <span>{label}</span>
        </AppTooltip>
      ))}
    </div>
  )
}
