"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllEmailTemplates,
  getEmailTemplateBySlug,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from "@/lib/email_template";
import { Eye } from "lucide-react";
import { LuPencilLine, LuTrash2 } from "react-icons/lu";

// ─── TipTap ───────────────────────────────────────────────────────────────────
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
// ─── Types ────────────────────────────────────────────────────────────────────
interface EmailTemplate {
  id: number | string;
  slug: string;
  subject: string;
  template: string;
  variables?: any;
}
const emptyForm: Omit<EmailTemplate, "id"> & { id: number | string | null } = {
  id: null,
  slug: "",
  subject: "",
  template: "",
  variables: "",
};

const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
    };
  },
});

// ─── Helper: parse variables safely into string[] ─────────────────────────────
function parseVariables(raw: any): string[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {}
  return [];
}

// ─── TipTap Toolbar Button ────────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors border-none cursor-pointer select-none ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

// ─── TipTap Editor ────────────────────────────────────────────────────────────
function TipTapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        multicolor: true,
      }),
      
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] max-h-[200px] overflow-y-auto px-4 py-3 text-sm text-gray-800 outline-none prose max-w-none " +
          "prose-h1:text-3xl prose-h1:font-bold " +
          "prose-h2:text-2xl prose-h2:font-semibold " +
          "prose-h3:text-xl prose-h3:font-semibold " +
          "prose-h4:text-lg prose-h4:font-medium " +
          "prose-h5:text-base prose-h5:font-medium",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={editor.isActive("heading", { level: 4 })}
          title="Heading 4"
        >
          H4
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          active={editor.isActive("heading", { level: 5 })}
          title="Heading 5"
        >
          H5
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraph"
        >
          P
        </ToolbarBtn>

        <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <span className="underline">U</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarBtn>
        <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
        <label
          title="Text Color"
          className="relative flex items-center px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-600 cursor-pointer"
        >
          <span className="font-semibold">A</span>
          <input
            type="color"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>
        <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          • List
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          1. List
        </ToolbarBtn>
        <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          ⬅
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          ↔
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          ➡
        </ToolbarBtn>
        <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
        <ToolbarBtn
          onClick={addLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          🔗
        </ToolbarBtn>
        <ToolbarBtn onClick={addImage} title="Insert Image">
          🖼
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          {"</>"}
        </ToolbarBtn> 
      
        <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          ↩
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          ↪
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Variables Badge List (shared between view & edit) ────────────────────────
function VariablesBadges({
  variables,
}: {
  variables: any;
  copyable?: boolean;
}) {
  const vars = parseVariables(variables);
  if (vars.length === 0) return null;

  const copyVar = (v: string) => {
    navigator.clipboard.writeText(`\${${v}}`);
    toast.success(`Copied \${${v}}`, { duration: 1500 });
  };

  return (
    <div className="mb-5">
      <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">
        Variables
      </div>
      <div className="flex flex-wrap gap-1.5">
        {vars.map((item, i) => (
          <span
            key={i}
            onClick={() => copyVar(item)}
            title="Click to copy"
            className="px-2.5 py-0.5 rounded-md bg-primary/10 text-gray-700 text-xs font-semibold font-mono border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors select-all"
          >
            {`\${${item}}`}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">
        Click a variable to copy it, then paste into the template body.
      </p>
    </div>
  );
}

// ─── Confirm Toast ─────────────────────────────────────────────────────────────
function confirmToast(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="text-gray-800">{message}</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-1.5 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  });
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({
  open,
  onClose,
  children,
  title,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl w-full ${wide ? "max-w-3xl" : "max-w-xl"} max-h-[90vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-primary m-0">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none bg-transparent border-none cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-7 pt-6 pb-7">{children}</div>
      </div>
    </div>
  );
}

// ─── Field (View) ──────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  isHtml,
}: {
  label: string;
  value: any;
  isHtml?: boolean;
}) {
  return (
    <div className="mb-5">
      <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-1">
        {label}
      </div>
      {isHtml ? (
        <div
          className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-sm leading-relaxed prose prose-sm max-w-none overflow-auto max-h-[250px]"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-sm text-gray-800 break-all">
          {value ?? <span className="text-gray-400">—</span>}
        </div>
      )}
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────
function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<EmailTemplate | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getAllEmailTemplates();
      setTemplates(res?.data ?? res ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleView = async (slug: string) => {
    setViewOpen(true);
    setViewData(null);
    setViewLoading(true);
    try {
      const res = await getEmailTemplateBySlug(slug);
      setViewData(res?.data ?? res);
    } catch {
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (tpl: EmailTemplate) => {
    setIsCreating(false);
    setFormData({
      id: tpl.id,
      slug: tpl.slug,
      subject: tpl.subject,
      template: tpl.template,
      // keep variables as-is (array or string) — VariablesBadges will parse it
      variables: tpl.variables ?? "",
    });
    setEditOpen(true);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ ...emptyForm });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.subject || !formData.template) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSaving(true);
    try {
      let parsedVars: any = formData.variables;
      if (typeof formData.variables === "string" && formData.variables) {
        try {
          parsedVars = JSON.parse(formData.variables);
        } catch {
          parsedVars = formData.variables;
        }
      }
      if (isCreating) {
        await createEmailTemplate({
          slug: formData.slug,
          subject: formData.subject,
          template: formData.template,
          variables: parsedVars,
        });
      } else {
        await updateEmailTemplate({
          id: formData.id,
          slug: formData.slug,
          subject: formData.subject,
          template: formData.template,
          variables: parsedVars,
        });
      }
      setEditOpen(false);
      fetchAll();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    const confirmed = await confirmToast(
      `Delete template "${slug}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      await deleteEmailTemplate(slug);
      fetchAll();
    } catch {}
  };

  function cleanHTML(html: any) {
    return html
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight m-0">
            Email Templates
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-0">
            Manage all email templates used across the platform
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">⏳</div>Loading templates…
          </div>
        ) : templates.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>No email templates found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Slug", "Subject", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-gray-500 font-[500] text-[15px] border-b border-gray-100"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {templates.map((tpl, idx) => (
                  <tr
                    key={tpl.id}
                    className="border-b border-gray-50 hover:bg-indigo-50/50 transition-colors duration-150"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-400">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-md px-2.5 py-1 font-mono">
                        {tpl.slug}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 max-w-[260px] truncate">
                      {tpl.subject}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(tpl.slug)}
                          className="flex items-center gap-1.5 border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => handleEdit(tpl)}
                          className="flex items-center gap-1.5 border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-pointer"
                        >
                          <LuPencilLine className="w-4 h-4" /> Edit
                        </button>
                        {/* <button
                          onClick={() => handleDelete(tpl.slug)}
                          disabled
                          className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-sm px-3 py-1.5 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-pointer"
                        >
                          <LuTrash2 className="w-4 h-4" /> Delete
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL ─────────────────────────────────────────────────────── */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Template Details"
        wide
      >
        {viewLoading ? (
          <div className="text-center py-10 text-gray-400">Loading…</div>
        ) : viewData ? (
          <>
            <Field label="Slug" value={viewData.slug} />
            <Field label="Subject" value={viewData.subject} />
            <VariablesBadges variables={viewData.variables} />
            <div className="mb-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-1">
                Template Body
              </div>
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 text-sm leading-relaxed max-w-full overflow-x-auto overflow-y-auto max-h-[300px]"
                dangerouslySetInnerHTML={{
                  __html: cleanHTML(viewData.template),
                }}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">No data.</div>
        )}
      </Modal>

      {/* ── EDIT / CREATE MODAL ──────────────────────────────────────────────── */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={isCreating ? "Create Template" : "Edit Template"}
        wide
      >
        <Input
          label="Slug"
          value={formData.slug}
          onChange={(v) => setFormData((f) => ({ ...f, slug: v }))}
          placeholder="e.g. welcome-email"
          required
          disabled
        />
        <Input
          label="Subject"
          value={formData.subject}
          onChange={(v) => setFormData((f) => ({ ...f, subject: v }))}
          placeholder="Email subject line"
          required
        />

        {/* ── Variables — read-only display, same style as view modal ── */}
        <VariablesBadges variables={formData.variables} />

        {/* TipTap Rich Text Editor */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
            Template Body <span className="text-red-500">*</span>
          </label>
          <TipTapEditor
            value={formData.template}
            onChange={(v) => setFormData((f) => ({ ...f, template: v }))}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => setEditOpen(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`text-white text-sm font-semibold px-6 py-2.5 rounded-lg border-none transition-all ${saving ? "bg-violet-300 cursor-not-allowed" : "bg-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"}`}
          >
            {saving ? "Saving…" : isCreating ? "Create" : "Save Changes"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
