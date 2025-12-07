import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditorSimple = ({ value, onChange, placeholder }) => {
  return (
    <div style={{ 
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      background: 'white'
    }}>
      <ReactQuill
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        theme="snow"
      />
    </div>
  );
};

export default RichTextEditorSimple;
