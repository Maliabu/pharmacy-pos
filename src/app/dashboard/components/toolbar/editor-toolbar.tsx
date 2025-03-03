import React from "react"
import { Editor } from "@tiptap/react"
import {
    AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, Toolbar } from "@/components/toolbar"
import { FormatType } from "./format-type"
import ToolButton from "./toolButton"

interface EditorToolbarProps {
  editor: Editor
}


const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (<div>
    <Toolbar className="m-0 flex items-center justify-between p-2" aria-label="Formatting options">
      <ToggleGroup className="flex flex-row items-center" type="multiple">
        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}>
            <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
          value="italic">
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          pressed={editor.isActive("strike")}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          pressed={editor.isActive("bulletList")}>
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          pressed={editor.isActive("orderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <FormatType editor={editor} />
      </ToggleGroup>
      <div className="flex flex-row justify-between">
        <ToolButton onClick={() => editor.chain().focus().setTextAlign("left").run()} 
        active={editor?.isActive({textAlign: "left"})}>
            <AlignLeft className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setTextAlign("center").run()} 
        active={editor?.isActive({textAlign: "center"})}>
            <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setTextAlign("right").run()} 
        active={editor?.isActive({textAlign: "right"})}>
            <AlignRight className="h-4 w-4" />
        </ToolButton>
      </div>
    </Toolbar></div>
  )
}

export default EditorToolbar