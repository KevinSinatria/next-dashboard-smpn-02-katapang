/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/common/EditorComponent.tsx
"use client";

import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";

interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  holder: string;
  fullFeature?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function EditorComponent({
  data,
  onChange,
  holder,
  fullFeature,
}: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);

  // Pisahkan logika inisialisasi ke dalam sebuah fungsi
  const initializeEditor = () => {
    // Hancurkan instance lama jika ada, untuk mencegah duplikasi
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    // Tools-mu sudah benar, bisa disederhanakan agar tidak duplikat kode
    const baseTools = {
      paragraph: { class: Paragraph as any, inlineToolbar: true },
      header: {
        class: Header as any,
        inlineToolbar: true,
        config: {
          placeholder: "Enter a header",
          levels: [2, 3, 4, 5, 6],
          defaultLevel: 3,
        },
        shortcut: "CMD+SHIFT+H",
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
    };

    // 2. Definisikan tools tambahan yang hanya ada jika fullFeature=true
    const fullFeatureTools = {
      quote: { class: Quote, inlineToolbar: true },
      table: Table,
      embed: {
        class: Embed,
        inlineToolbar: true,
        config: {
          service: {
            youtube: true,
            coub: true,
            vimeo: true,
          },
        },
      },
      image: {
        class: Image,
        config: {
          endpoints: {
            byFile: `${BASE_URL}/articles/image`,
          },
          field: "image",
        },
      },
    };

    // 3. Gabungkan keduanya. Jika fullFeature=false, maka tidak ada yang ditambahkan.
    const tools = {
      ...baseTools,
      ...(fullFeature ? fullFeatureTools : {}),
    };

    const editor = new EditorJS({
      holder: holder,
      tools: tools,
      data: data,
      async onChange(api) {
        const savedData = await api.saver.save();
        onChange(savedData);
      },
      // Tambahkan onReady untuk memastikan editor siap
      onReady: () => {
        console.log("Editor.js is ready to work!");
      },
    });
    editorRef.current = editor;
  };

  // Gunakan useEffect untuk memanggil inisialisasi
  useEffect(() => {
    if (data && !editorRef.current) {
      initializeEditor();
    }

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
