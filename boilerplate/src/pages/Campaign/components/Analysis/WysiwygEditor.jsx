import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { useEffect } from "react";
import DOMPurify from "dompurify";
import { Box } from "@mantine/core";
import StyledTextInput from "../../../../StyledComponents/StyledTextInput";

const WysiwygEditor = ({ initialContent, onChange, readOnly, activeTab }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent.content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);

  useEffect(() => {
    // editor?.setOptions({ content: initialContent })
    const sanitizedContent = DOMPurify.sanitize(initialContent.content);
    editor?.commands.insertContent(sanitizedContent);
    console.log("Effect");
  }, [initialContent.file]);

  return (
    <RichTextEditor
      editor={editor}
      readOnly={readOnly}
      styles={{
        root: {
          border: "none",
          position: "relative",
        },
        control: {
          backgroundColor: "transparent",
          border: "none",
        },
        controlsGroup: {
          position: "relative",
          height: 10,
        },
        content: {
          backgroundColor: "transparent",
          overflow: "auto",
          maxHeight: "210px",
        },
        toolbar: {
          backgroundColor: "transparent",
        },
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
        {activeTab === "Email" ? (
          <Box>
            <StyledTextInput w={500} placeholder={"Subject"} />
          </Box>
        ) : null}
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default WysiwygEditor;
