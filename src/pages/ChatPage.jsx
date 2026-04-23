import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, Loader, Paperclip, X, GitBranch,
  ChevronDown, Copy, Check, RefreshCw, FileText, FileCode
} from 'lucide-react';
import { chatAPI } from '../api';
import useUserStore from '../store/userStore';

// ── Document Editor Modal ─────────────────────────────────────────────────────
function DocumentEditor({ edit, onClose }) {
  const content_raw = edit.code ?? edit.raw ?? '';
  const [content, setContent] = useState(content_raw);
  const [copied, setCopied] = useState(false);

  // sync if edit prop changes (shouldn't happen due to key, but safety net)
  useEffect(() => { setContent(edit.code ?? edit.raw ?? ''); }, [edit]);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileCode size={18} className="text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{edit.filename ?? edit.lang ?? 'Code'}</p>
              <p className="text-xs text-gray-400">{edit.language ?? edit.lang ?? ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <X size={16} />
          </button>
        </div>

        {edit.description && (
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 text-xs text-blue-700">
            💡 {edit.description}
          </div>
        )}

        {/* Editable document body */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 font-mono text-sm text-gray-800 px-6 py-4 resize-none focus:outline-none overflow-auto leading-relaxed"
          spellCheck={false}
          placeholder="No code content found."
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <span className="text-xs text-gray-400">{content.split('\n').length} lines</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition">
              Close
            </button>
            <button
              onClick={() => { copy(); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyBtn({ text, className = '' }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`flex items-center gap-1 text-xs transition ${className}`}
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── HTML entity decoder ─────────────────────────────────────────────────────
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// ── Message Renderer ──────────────────────────────────────────────────────────
function MessageContent({ text, onOpenEditor }) {
  const parts = [];
  const allMatches = [];
  let m;

  const re1 = /```json:code_edit[ \t]*\n([\s\S]*?)```/g;
  while ((m = re1.exec(text)) !== null)
    allMatches.push({ type: 'code_edit', index: m.index, end: m.index + m[0].length, raw: m[1] });

  const re2 = /```(\w+)?[ \t]*\n([\s\S]*?)```/g;
  while ((m = re2.exec(text)) !== null)
    if (!allMatches.some(x => x.index === m.index))
      allMatches.push({ type: 'code', index: m.index, end: m.index + m[0].length, lang: m[1] || 'text', code: m[2].replace(/\n$/, '') });

  allMatches.sort((a, b) => a.index - b.index);

  let cursor = 0;
  allMatches.forEach((block, i) => {
    const preceding = text.slice(cursor, block.index);
    // extract ### filename heading immediately before this block
    const headingMatch = preceding.match(/###\s+([^\n]+)\s*\n?\s*$/);
    const filename = headingMatch ? headingMatch[1].trim() : (block.lang || 'code');

    if (block.index > cursor)
      parts.push(<PlainText key={`t${i}`} text={preceding} />);

    if (block.type === 'code_edit') {
      try {
        const edit = JSON.parse(block.raw);
        parts.push(
          <div key={`ce${i}`} className="my-3 rounded-xl overflow-hidden border border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between px-4 py-2 bg-blue-100 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-blue-500" />
                <span className="text-xs font-semibold text-blue-700">{edit.filename}</span>
                <span className="text-xs text-blue-400">{edit.language}</span>
              </div>
              <button
                onClick={() => onOpenEditor(edit)}
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                Open Document
              </button>
            </div>
            {edit.description && <p className="px-4 py-2 text-xs text-blue-600">{edit.description}</p>}
            <pre className="px-4 py-3 text-xs text-gray-700 font-mono overflow-x-auto max-h-40 bg-white/60">
              <code>{edit.code?.slice(0, 400)}{edit.code?.length > 400 ? '\n...' : ''}</code>
            </pre>
          </div>
        );
      } catch {
        parts.push(<pre key={`ce${i}`} className="text-xs text-gray-400 p-2">{block.raw}</pre>);
      }
    } else {
      parts.push(
        <div key={`cb${i}`} className="my-2 rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
            <span className="text-xs text-gray-400 font-mono">{block.lang}</span>
            <div className="flex items-center gap-2">
              <CopyBtn text={block.code} className="text-gray-400 hover:text-white" />
              <button
                onClick={() => onOpenEditor({ filename, lang: block.lang, code: block.code })}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Open
              </button>
            </div>
          </div>
          <pre className="px-4 py-3 text-xs text-gray-200 font-mono overflow-x-auto max-h-64">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    }
    cursor = block.end;
  });

  if (cursor < text.length) parts.push(<PlainText key="tlast" text={text.slice(cursor)} />);
  return <div className="space-y-1 text-sm">{parts}</div>;
}

function PlainText({ text }) {
  return (
    <div className="space-y-0.5">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        if (line.startsWith('## ')) return <p key={i} className="font-bold text-gray-900 mt-2 text-base">{line.slice(3)}</p>;
        if (line.startsWith('### ')) return <p key={i} className="font-semibold text-gray-800 mt-1">{line.slice(4)}</p>;
        if (/^\d+\.\s/.test(line)) return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-500 font-medium shrink-0">{line.match(/^\d+/)[0]}.</span><span>{inlineFmt(line.replace(/^\d+\.\s/, ''))}</span></div>;
        if (/^[-*]\s/.test(line)) return <div key={i} className="flex gap-2 ml-2"><span className="text-blue-500 shrink-0">•</span><span>{inlineFmt(line.slice(2))}</span></div>;
        return <p key={i}>{inlineFmt(line)}</p>;
      })}
    </div>
  );
}

function inlineFmt(text) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="bg-gray-100 text-red-600 px-1 rounded text-xs font-mono">{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

// ── Main ChatPage ─────────────────────────────────────────────────────────────
const DEFAULT_MSG = {
  role: 'assistant',
  text: "Hi! I'm your ProjectPilot AI assistant 👋\n\nI can help you with:\n- **Code review & suggestions** from your git repos\n- **Document analysis** — upload any file\n- **Coding help** — debugging, architecture, best practices\n- **Platform questions** — groups, topics, reports, diary\n\nTo get started with repo context, click **Select Repo** above. Or just ask me anything!",
};

export default function ChatPage({ Sidebar, Topbar }) {
  const { user } = useUserStore();
  const storageKey = `chat_v2_${user?.id || user?._id}`;

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || [DEFAULT_MSG]; } catch { return [DEFAULT_MSG]; }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaceContext, setWorkspaceContext] = useState(null);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);

  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [activeEdit, setActiveEdit] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    chatAPI.getWorkspaces().then(r => setWorkspaces(r.data.workspaces || [])).catch(() => {});
  }, []);

  const selectRepo = async (ws) => {
    setSelectedWorkspace(ws);
    setShowRepoDropdown(false);
    setLoadingRepo(true);
    try {
      const r = await chatAPI.getWorkspaceContext(ws._id);
      setWorkspaceContext(r.data);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `✅ Loaded repo **${ws.name}** (${r.data.files?.length || 0} files). I now have context of your codebase. Ask me anything about it!`
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Could not load repo context. The workspace may still be cloning.' }]);
    } finally { setLoadingRepo(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const r = await chatAPI.uploadDoc(file);
      setUploadedDoc(r.data);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `📎 Document **${r.data.filename}** uploaded! What would you like to know about it?`
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Failed to upload document. Please try again.' }]);
    } finally { setUploadingDoc(false); e.target.value = ''; }
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    const updated = [...messages, { role: 'user', text: userText }];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      const history = updated.slice(1, -1).map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
      const r = await chatAPI.sendMessage(userText, history, workspaceContext, uploadedDoc);
      setMessages(prev => [...prev, { role: 'assistant', text: decodeEntities(r.data.reply) }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: err.response?.data?.error || 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([DEFAULT_MSG]);
    setUploadedDoc(null);
    setWorkspaceContext(null);
    setSelectedWorkspace(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-4 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-800">ProjectPilot AI</h1>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowRepoDropdown(v => !v)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    selectedWorkspace ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {loadingRepo ? <Loader size={14} className="animate-spin" /> : <GitBranch size={14} />}
                  {selectedWorkspace ? selectedWorkspace.name : 'Select Repo'}
                  <ChevronDown size={14} />
                </button>
                {showRepoDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Workspaces</p>
                    </div>
                    {workspaces.length === 0 ? (
                      <p className="px-4 py-4 text-sm text-gray-400">No workspaces found. Create one in the Workspace section.</p>
                    ) : (
                      workspaces.map(ws => (
                        <button key={ws._id} onClick={() => selectRepo(ws)}
                          className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left ${selectedWorkspace?._id === ws._id ? 'bg-blue-50' : ''}`}>
                          <GitBranch size={16} className="text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{ws.name}</p>
                            <p className="text-xs text-gray-400">{ws.groupId?.groupName} · {ws.type}</p>
                            {ws.gitUrl && <p className="text-xs text-blue-500 truncate">{ws.gitUrl}</p>}
                          </div>
                        </button>
                      ))
                    )}
                    {selectedWorkspace && (
                      <button onClick={() => { setSelectedWorkspace(null); setWorkspaceContext(null); setShowRepoDropdown(false); }}
                        className="w-full px-4 py-2 text-xs text-red-500 hover:bg-red-50 border-t transition text-left">
                        Clear repo context
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button onClick={clearChat} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition" title="Clear chat">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Context badges */}
          {(selectedWorkspace || uploadedDoc) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedWorkspace && (
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium">
                  <GitBranch size={12} /> {selectedWorkspace.name}
                  <button onClick={() => { setSelectedWorkspace(null); setWorkspaceContext(null); }} className="ml-1 hover:text-red-500"><X size={11} /></button>
                </span>
              )}
              {uploadedDoc && (
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium">
                  <FileText size={12} /> {uploadedDoc.filename}
                  <button onClick={() => setUploadedDoc(null)} className="ml-1 hover:text-red-500"><X size={11} /></button>
                </span>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-600" />}
                </div>
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant'
                      ? <MessageContent text={msg.text} onOpenEditor={setActiveEdit} />
                      : msg.text}
                  </div>
                  <CopyBtn
                    text={msg.text}
                    className={`text-gray-400 hover:text-gray-600 self-${msg.role === 'user' ? 'end' : 'start'} px-1`}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 my-3">
              {[
                'Review my code for bugs',
                'Explain this file to me',
                'How do I submit a topic?',
                'Suggest improvements to my project structure',
                'Help me debug this error',
              ].map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-blue-400 hover:text-blue-600 transition">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-end gap-2 px-4 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={selectedWorkspace ? `Ask about ${selectedWorkspace.name}...` : uploadedDoc ? `Ask about ${uploadedDoc.filename}...` : 'Ask anything — code, docs, platform help...'}
                rows={1}
                className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-32"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <input ref={fileInputRef} type="file" className="hidden"
                  accept=".txt,.md,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.html,.css,.json,.xml,.yaml,.yml,.pdf,.docx"
                  onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingDoc}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition disabled:opacity-40" title="Upload document">
                  {uploadingDoc ? <Loader size={16} className="animate-spin" /> : <Paperclip size={16} />}
                </button>
                <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="px-4 pb-2 flex items-center gap-3 text-xs text-gray-400">
              <span>Enter to send · Shift+Enter for new line</span>
              {selectedWorkspace && <span className="text-blue-500">· Repo context active</span>}
              {uploadedDoc && <span className="text-green-500">· Document loaded</span>}
            </div>
          </div>
        </div>
      </div>

      {activeEdit && <DocumentEditor key={activeEdit.filename + activeEdit.code?.slice(0, 20)} edit={activeEdit} onClose={() => setActiveEdit(null)} />}
    </div>
  );
}
