"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertToMarkdownString,
  TRANSFORMERS as MarkdownTransformers,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $getRoot,
  CLEAR_EDITOR_COMMAND,
  EditorState as EditorStateT,
} from "lexical";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "./styles.css";

const AutoFocusPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalAutoFocusPlugin").then(
      (module) => module.AutoFocusPlugin
    ),
  { ssr: false }
);
const LexicalComposer = dynamic(
  () =>
    import("@lexical/react/LexicalComposer").then(
      (module) => module.LexicalComposer
    ),
  { ssr: false }
);
const ContentEditable = dynamic(
  () =>
    import("@lexical/react/LexicalContentEditable").then(
      (module) => module.ContentEditable
    ),
  { ssr: false }
);
const LexicalErrorBoundary = dynamic(
  () =>
    import("@lexical/react/LexicalErrorBoundary").then(
      (module) => module.default
    ),
  { ssr: false }
);
const HistoryPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalHistoryPlugin").then(
      (module) => module.HistoryPlugin
    ),
  { ssr: false }
);
const LinkPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalLinkPlugin").then(
      (module) => module.LinkPlugin
    ),
  { ssr: false }
);
const ListPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalListPlugin").then(
      (module) => module.ListPlugin
    ),
  { ssr: false }
);
const MarkdownShortcutPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalMarkdownShortcutPlugin").then(
      (module) => module.MarkdownShortcutPlugin
    ),
  { ssr: false }
);
const RichTextPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalRichTextPlugin").then(
      (module) => module.RichTextPlugin
    ),
  { ssr: false }
);
const ClearEditorPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalClearEditorPlugin").then(
      (module) => module.ClearEditorPlugin
    ),
  { ssr: false }
);

// Custom React component plugins
const AutoLinkPlugin = dynamic(
  () => import("./plugins/AutoLinkPlugin").then((module) => module.default),
  { ssr: false }
);
const CodeHighlightPlugin = dynamic(
  () =>
    import("./plugins/CodeHighlightPlugin").then((module) => module.default),
  { ssr: false }
);
const ListMaxIndentLevelPlugin = dynamic(
  () =>
    import("./plugins/ListMaxIndentLevelPlugin").then(
      (module) => module.default
    ),
  { ssr: false }
);
const ToolbarPlugin = dynamic(
  () => import("./plugins/ToolbarPlugin").then((module) => module.default),
  { ssr: false }
);

function Placeholder() {
  return <div className="editor-placeholder">Enter your post...</div>;
}

const Theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

function OnChangePlugin({
  onChange,
}: {
  onChange: (value: EditorStateT) => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

function ResetPlugin({ clearEditor }: { clearEditor: boolean }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  }, [editor, clearEditor]);

  return null;
}

function IsEmptyPlugin({
  checkIsEmpty,
  setIsEmpty,
}: {
  checkIsEmpty?: boolean;
  setIsEmpty?: (value: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (checkIsEmpty !== undefined && setIsEmpty !== undefined) {
      $getRoot().isEmpty() ? setIsEmpty(true) : setIsEmpty(false);
    }
  }, [editor, checkIsEmpty, setIsEmpty]);

  return null;
}

function MarkdownExtractor({
  setMarkdownText,
}: {
  setMarkdownText?: (text: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  editor.update(() => {
    if (setMarkdownText) {
      setMarkdownText($convertToMarkdownString(MarkdownTransformers));
    }
  });

  return null;
}

export default function RichTextEditor({
  onEditorChange,
  clearEditor,
  setIsEmpty,
  checkIsEmpty,
  setMarkdownText,
}: {
  onEditorChange: (value: string) => void;
  clearEditor: boolean;
  setIsEmpty?: (value: boolean) => void;
  checkIsEmpty?: boolean;
  setMarkdownText?: (text: string) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Provide the reset function to the parent component
  }, []);

  if (!isMounted) return null;

  const editorConfig = {
    namespace: "editor",
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <OnChangePlugin
            onChange={(state) => {
              onEditorChange(JSON.stringify(state.toJSON()));
            }}
          />
          <IsEmptyPlugin checkIsEmpty={checkIsEmpty} setIsEmpty={setIsEmpty} />
          <ClearEditorPlugin />
          <ResetPlugin clearEditor={clearEditor} />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <MarkdownExtractor setMarkdownText={setMarkdownText} />
        </div>
      </div>
    </LexicalComposer>
  );
}
