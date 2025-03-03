"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from "./toolbar/editor-toolbar"
import React from "react"

interface EditorProps {
  content: string
  placeholder?: string
  onChange: (value: string) => void
}

const Editor = ({ content, placeholder, onChange,  }: EditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({
        codeBlock: false
    }), TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['center', 'left', 'right'],
      }), Placeholder.configure({
        placeholder: "Write your article here..."
      })],
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-auto admin',
        }
    },
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return <></>

  return (
    <div className="prose max-w-none w-full border border-input bg-background text-foreground dark:prose-invert">
      <EditorToolbar editor={editor}/>
      <div className="editor">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  )
}

export default Editor