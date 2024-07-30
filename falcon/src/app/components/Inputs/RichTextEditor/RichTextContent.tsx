"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { EditorState } from "lexical";
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
const RichTextPlugin = dynamic(
  () =>
    import("@lexical/react/LexicalRichTextPlugin").then(
      (module) => module.RichTextPlugin
    ),
  { ssr: false }
);
const CodeHighlightPlugin = dynamic(
  () =>
    import("./plugins/CodeHighlightPlugin").then((module) => module.default),
  { ssr: false }
);
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

export default function RichTextContent({ content }: { content?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {}, [content]);

  if (!isMounted) return null;

  const init = () => {
    return content;
  };

  const ct = init();

  const initConfig = {
    namespace: "MyEditor",
    theme: Theme,
    onError(error: any) {
      throw error;
    },

    editable: false,
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
    editorState: ct,
  };

  return (
    <LexicalComposer initialConfig={initConfig}>
      <div className="display-container">
        <div className="display-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="display-input" />}
            placeholder={<></>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
