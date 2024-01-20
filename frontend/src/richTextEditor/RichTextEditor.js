import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RTEditor({ onContentChange, campaignDescription }) {
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    onContentChange(content);
  };

  return (
    <>
      <Editor
        apiKey='qx6jbptilseawidhbs3dcid52uv9k9l1sogyzw7ymg0z1b0i'
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          setup: (editor) => {
            editor.on('change', () => {
              handleEditorChange(editor.getContent(), editor);
            });
          },
        }}
        onChange={(content, editor) => handleEditorChange(content, editor)}
      />
    </>
  );
}