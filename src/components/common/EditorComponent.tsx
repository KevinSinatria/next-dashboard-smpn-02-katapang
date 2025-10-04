/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/common/EditorComponent.tsx
"use client";

import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  holder: string;
}

export function EditorComponent({ data, onChange, holder }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    // Inisialisasi editor hanya jika belum ada
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: {
          paragraph: {
            class: Paragraph as any,
            inlineToolbar: true,
          },
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [2, 3, 4],
              defaultLevel: 3,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
        },
        data: data,
        async onChange(api, event) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
      });
      editorRef.current = editor;
    }

    // Cleanup function untuk menghancurkan instance editor saat komponen unmount
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id={holder}
      className="prose max-w-full rounded-md border border-input bg-transparent px-3 py-2"
    />
  );
}
