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
        initialValue="<h2>Set a Description for your campaign</h2>"
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
            block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
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