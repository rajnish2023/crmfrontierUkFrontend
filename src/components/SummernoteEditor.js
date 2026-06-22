import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
if (!$.now) {
  $.now = () => new Date().getTime();
}
window.jQuery = $;
window.$ = $;
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

const SummernoteEditor = ({ value, onChange, height = 400 }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const $editor = $(editorRef.current);

    $editor.summernote({
      height: height,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview', 'help']],
      ],
      callbacks: {
        onChange: (contents) => {
          const cleaned = contents.replace(/ class=""/g, '');
          onChange(cleaned);
        },
        onPaste: (e) => {
          e.preventDefault();
          const clipboardData = (e.originalEvent || e).clipboardData || window.clipboardData;
          let text = clipboardData.getData('text/plain');
          const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '');
          const html = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
          document.execCommand('insertHTML', false, html);
        }
      }
    });
    $editor.summernote('code', value);

    return () => {
      $editor.summernote('destroy');
    };
  }, []);
  useEffect(() => {
    const $editor = $(editorRef.current);
    if ($editor.summernote('code') !== value) {
      $editor.summernote('code', value);
    }
  }, [value]);

  return <div ref={editorRef} />;
};

export default SummernoteEditor;
