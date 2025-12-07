import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Note: findDOMNode warning from react-quill is a known issue with React 18
// It doesn't affect functionality and will be fixed in future react-quill versions
// We can safely ignore this warning in development

const RichTextEditor = ({ value, onChange, placeholder = "Enter detailed description..." }) => {
  const quillRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastPropValueRef = useRef(value);
  
  // Normalize value to always be a string
  const normalizedValue = useMemo(() => {
    return typeof value === 'string' ? value : (value || '');
  }, [value]);
  
  // Internal state - only update when prop changes externally
  const [internalValue, setInternalValue] = useState(normalizedValue);
  
  // Sync internal state with prop value only when prop changes externally
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    // Only sync if prop value actually changed (not from our onChange)
    if (normalizedValue !== lastPropValueRef.current) {
      setInternalValue(normalizedValue);
      lastPropValueRef.current = normalizedValue;
    }
  }, [normalizedValue]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const imageHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Save current selection before opening file dialog
    const range = quill.getSelection();
    const savedIndex = range ? range.index : quill.getLength();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    // Restore focus to quill after file dialog closes (if cancelled)
    input.addEventListener('cancel', () => {
      setTimeout(() => {
        quill.focus();
        if (range) {
          quill.setSelection(range);
        }
      }, 100);
    });

    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) {
        // Restore focus if no file selected
        setTimeout(() => {
          quill.focus();
          if (range) {
            quill.setSelection(range);
          }
        }, 100);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        setTimeout(() => {
          quill.focus();
          if (range) {
            quill.setSelection(range);
          }
        }, 100);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        setTimeout(() => {
          quill.focus();
          if (range) {
            quill.setSelection(range);
          }
        }, 100);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);

        // Upload image to server - try seller endpoint first, fallback to admin
        let response;
        try {
          response = await api.post('/seller/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
          // Fallback to admin endpoint if seller endpoint fails
          response = await api.post('/admin/products/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        const imageUrl = response.data.imageUrl || response.data.image;
        
        // Get current selection again (might have changed)
        const currentRange = quill.getSelection();
        const insertIndex = currentRange ? currentRange.index : savedIndex;
        
        // Insert image at saved or current position
        quill.insertEmbed(insertIndex, 'image', imageUrl);
        
        // Move cursor after image and restore focus
        setTimeout(() => {
          quill.setSelection(insertIndex + 1);
          quill.focus();
          // Trigger onChange to update parent component and internal state
          const content = quill.root.innerHTML;
          const contentString = content || '';
          setInternalValue(contentString);
          lastPropValueRef.current = contentString;
          if (onChange) {
            onChange(contentString);
          }
        }, 50);
        
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Failed to upload image:', error);
        toast.error('Failed to upload image. Please try again.');
        // Restore focus on error
        setTimeout(() => {
          quill.focus();
          if (range) {
            quill.setSelection(range);
          }
        }, 100);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'color', 'background'
  ];


  // Handle onChange - debounced to prevent excessive updates
  const handleChange = useCallback((content) => {
    if (!isMountedRef.current) return;
    
    const contentString = content || '';
    
    // Update internal state immediately for responsive UI
    setInternalValue(contentString);
    
    // Update ref to prevent sync loop
    lastPropValueRef.current = contentString;
    
    // Notify parent
    if (onChange) {
      onChange(contentString);
    }
  }, [onChange]);

  // Ensure value is always a valid string
  const safeValue = typeof internalValue === 'string' ? internalValue : '';

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={safeValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={false}
      />
      <style>{`
        .rich-text-editor {
          position: relative;
          z-index: 1;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          background: white;
          pointer-events: auto !important;
          user-select: text !important;
        }
        .rich-text-editor * {
          pointer-events: auto !important;
        }
        .rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f8fafc;
          pointer-events: auto !important;
          z-index: 2;
        }
        .rich-text-editor .ql-toolbar button {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        .rich-text-editor .ql-container {
          border: none;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
          background-color: white;
          pointer-events: auto !important;
          z-index: 1;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
          font-size: 14px;
          pointer-events: auto !important;
          cursor: text !important;
          color: #1e293b;
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        .rich-text-editor .ql-editor * {
          pointer-events: auto !important;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          pointer-events: none;
          color: #94a3b8;
          font-style: italic;
        }
        /* Ensure quill is visible and interactive */
        .rich-text-editor .quill,
        .rich-text-editor > div {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
};


export default RichTextEditor;
