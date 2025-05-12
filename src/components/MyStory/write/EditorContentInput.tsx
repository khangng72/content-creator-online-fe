import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';

interface EditorContentInputProps {
  editor: Editor | null;
  textSize: number;
  lineHeight: number;
  wordSpacing: number;
}

const EditorContentInput = ({
  editor,
  textSize,
  lineHeight,
  wordSpacing,
}: EditorContentInputProps) => {
  return (
    <EditorContent
      editor={editor}
      style={{
        fontSize: `${textSize}px`,
        lineHeight: `${lineHeight}`,
        wordSpacing: `${wordSpacing}px`,
      }}
    />
  );
};

export default EditorContentInput;
