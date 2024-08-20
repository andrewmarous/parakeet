"use client";

import React, { ForwardedRef } from "react";
import { LuUploadCloud } from "react-icons/lu";
import FileCard from "../../Cards/FileCard/FileCard";
import IconBubble from "../../IconBubble/IconBubble";

interface MediaInputProps {
  id: string;
  label: string;
  onChange: (files: File[]) => void;
  value?: File[];
  error?: string;
  title?: string;
}

export const MediaInput = React.forwardRef(
    (
        { id, label, error, value, title, onChange }: MediaInputProps,
        ref: ForwardedRef<HTMLInputElement>
    ) => {
      const [inputKey, setInputKey] = React.useState(0);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files ? Array.from(e.target.files) : [];
        const allFiles = (value || []).concat(fileList);
        onChange(allFiles);
      };

      const removeFile = (file: File) => {
        const filteredFiles = (value || []).filter(
            (currentFile) => currentFile !== file
        );
        onChange(filteredFiles);
        setInputKey((prev) => prev + 1);
      };

      return (
          <div className="space-y-6">
            <label
                className="relative flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border border-grey-300 bg-grey-50 p-6 text-center focus-within:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-400"
                id={id}
            >
              <IconBubble Icon={LuUploadCloud} size="md" />
              <div className="flex cursor-pointer flex-col gap-1">
                <p className="text-md font-medium text-grey-700">Click to upload</p>
                <span className="text-sm text-medium-grey">{label}</span>
              </div>
              <input
                  key={inputKey}
                  type="file"
                  id={id}
                  onChange={handleFileChange}
                  ref={ref}
                  multiple
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label={label}
              />
            </label>
            {error && <p className="text-red-500">{error}</p>}
            {value && value.length > 0 && (
                <div className="flex flex-col gap-4">
                  {value.map((file, index) => (
                      <FileCard
                          name={file.name}
                          size={file.size}
                          type={file.type}
                          key={index}
                          onRemove={() => removeFile(file)}
                      />
                  ))}
                </div>
            )}
          </div>
      );
    }
);

MediaInput.displayName = "MediaInput";