import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface SpotlightProps {
  onClose: () => void;
}

interface SearchItem {
  id: string;
  type: 'app' | 'file' | 'action' | 'url' | 'calculation' | 'command';
  title: string;
  subtitle?: string;
  icon: string;
  keywords?: string[];
  action?: () => void;
  url?: string;
}

// All zOS apps registry
const APPS: SearchItem[] = [
  // Games
  { id: 'doom', type: 'app', title: 'Doom', subtitle: 'Classic FPS', icon: '👹', keywords: ['game', 'fps', 'shooter'] },
  { id: 'chess', type: 'app', title: 'Chess', subtitle: 'Play against AI', icon: '♟️', keywords: ['game', 'strategy', 'board'] },
  { id: 'arcade', type: 'app', title: 'Arcade', subtitle: 'Retro emulators', icon: '🕹️', keywords: ['game', 'emulator', 'nes', 'snes'] },
  { id: 'snes', type: 'app', title: 'SNES', subtitle: 'Super Nintendo', icon: '🎮', keywords: ['game', 'emulator', 'nintendo'] },
  { id: 'mud', type: 'app', title: 'MUD', subtitle: 'Multiplayer text adventure', icon: '🏰', keywords: ['game', 'rpg', 'text', 'multiplayer'] },
  { id: 'solitaire', type: 'app', title: 'Solitaire', subtitle: 'Card game', icon: '🃏', keywords: ['game', 'cards', 'klondike'] },
  { id: 'minesweeper', type: 'app', title: 'Minesweeper', subtitle: 'Puzzle game', icon: '💣', keywords: ['game', 'puzzle'] },
  { id: 'snake', type: 'app', title: 'Snake', subtitle: 'Classic arcade', icon: '🐍', keywords: ['game', 'arcade'] },
  { id: 'tetris', type: 'app', title: 'Tetris', subtitle: 'Falling blocks', icon: '🧱', keywords: ['game', 'puzzle', 'blocks'] },
  { id: '2048', type: 'app', title: '2048', subtitle: 'Merge numbers', icon: '🔢', keywords: ['game', 'puzzle', 'numbers'] },
  { id: 'sudoku', type: 'app', title: 'Sudoku', subtitle: 'Number puzzle', icon: '🔲', keywords: ['game', 'puzzle', 'numbers'] },
  { id: 'myst', type: 'app', title: 'Myst', subtitle: 'Mystery adventure', icon: '🌫️', keywords: ['game', 'adventure', 'mystery'] },

  // Creative
  { id: 'excalidraw', type: 'app', title: 'Excalidraw', subtitle: 'Whiteboard', icon: '🎨', keywords: ['draw', 'diagram', 'sketch'] },
  { id: 'codepen', type: 'app', title: 'CodePen', subtitle: 'Code playground', icon: '✏️', keywords: ['code', 'html', 'css', 'js'] },
  { id: 'tldraw', type: 'app', title: 'tldraw', subtitle: 'Drawing app', icon: '📐', keywords: ['draw', 'canvas'] },
  { id: 'figma', type: 'app', title: 'Figma', subtitle: 'Design tool', icon: '🎨', keywords: ['design', 'ui', 'prototype'] },
  { id: 'blender', type: 'app', title: 'Blender', subtitle: '3D creation', icon: '🎬', keywords: ['3d', 'model', 'render'] },
  { id: 'final-cut-pro', type: 'app', title: 'Final Cut Pro', subtitle: 'Video editing', icon: '🎥', keywords: ['video', 'edit', 'movie'] },

  // Developer
  { id: 'vscode', type: 'app', title: 'VS Code', subtitle: 'Code editor', icon: '💻', keywords: ['code', 'editor', 'ide'] },
  { id: 'terminal', type: 'app', title: 'Terminal', subtitle: 'Command line', icon: '💻', keywords: ['shell', 'cli', 'bash', 'zsh'] },
  { id: 'console', type: 'app', title: 'Console', subtitle: 'System logs', icon: '🖥️', keywords: ['debug', 'logs'] },
  { id: 'observable', type: 'app', title: 'Observable', subtitle: 'Data notebooks', icon: '📊', keywords: ['data', 'notebook', 'viz'] },

  // Music
  { id: 'spotify', type: 'app', title: 'Spotify', subtitle: 'Music streaming', icon: '🎵', keywords: ['music', 'stream', 'songs'] },
  { id: 'music', type: 'app', title: 'Music', subtitle: 'Local library', icon: '🎶', keywords: ['music', 'player', 'mp3'] },
  { id: 'podcasts', type: 'app', title: 'Podcasts', subtitle: 'Audio shows', icon: '🎙️', keywords: ['podcast', 'audio'] },
  { id: 'ableton-live', type: 'app', title: 'Ableton Live', subtitle: 'Music production', icon: '🎹', keywords: ['daw', 'music', 'produce'] },
  { id: 'rekordbox', type: 'app', title: 'Rekordbox', subtitle: 'DJ software', icon: '💿', keywords: ['dj', 'mix', 'music'] },

  // Productivity
  { id: 'notes', type: 'app', title: 'Notes', subtitle: 'Quick notes', icon: '📝', keywords: ['note', 'write', 'markdown'] },
  { id: 'calculator', type: 'app', title: 'Calculator', subtitle: 'Math', icon: '🧮', keywords: ['calc', 'math'] },
  { id: 'calendar', type: 'app', title: 'Calendar', subtitle: 'Schedule', icon: '📅', keywords: ['date', 'event', 'schedule'] },
  { id: 'reminders', type: 'app', title: 'Reminders', subtitle: 'Tasks', icon: '⏰', keywords: ['todo', 'task', 'remind'] },
  { id: 'contacts', type: 'app', title: 'Contacts', subtitle: 'Address book', icon: '👥', keywords: ['people', 'address'] },
  { id: 'books', type: 'app', title: 'Books', subtitle: 'eReader', icon: '📚', keywords: ['read', 'ebook', 'epub'] },
  { id: 'gmail', type: 'app', title: 'Gmail', subtitle: 'Email', icon: '📧', keywords: ['email', 'mail'] },
  { id: 'files', type: 'app', title: 'Files', subtitle: 'File manager', icon: '📂', keywords: ['folder', 'browse'] },
  { id: 'todo', type: 'app', title: 'Todo', subtitle: 'Task list', icon: '✅', keywords: ['task', 'list', 'gtd'] },
  { id: 'appstore', type: 'app', title: 'App Store', subtitle: 'Get apps', icon: '🏪', keywords: ['app', 'install', 'download'] },

  // Social
  { id: 'discord', type: 'app', title: 'Discord', subtitle: 'Chat', icon: '💬', keywords: ['chat', 'voice', 'community'] },
  { id: 'slack', type: 'app', title: 'Slack', subtitle: 'Team chat', icon: '💼', keywords: ['work', 'chat', 'team'] },
  { id: 'twitter', type: 'app', title: 'Twitter', subtitle: 'Social', icon: '🐦', keywords: ['social', 'tweet'] },
  { id: 'linkedin', type: 'app', title: 'LinkedIn', subtitle: 'Professional', icon: '💼', keywords: ['job', 'career'] },
  { id: 'whatsapp', type: 'app', title: 'WhatsApp', subtitle: 'Messaging', icon: '📱', keywords: ['chat', 'message'] },

  // Media
  { id: 'youtube', type: 'app', title: 'YouTube', subtitle: 'Videos', icon: '📺', keywords: ['video', 'watch'] },
  { id: 'netflix', type: 'app', title: 'Netflix', subtitle: 'Streaming', icon: '🎬', keywords: ['movie', 'tv', 'show'] },
  { id: 'photos', type: 'app', title: 'Photos', subtitle: 'Gallery', icon: '📷', keywords: ['image', 'picture'] },

  // System
  { id: 'clock', type: 'app', title: 'Clock', subtitle: 'Time & timer', icon: '🕐', keywords: ['time', 'timer', 'alarm'] },
  { id: 'weather', type: 'app', title: 'Weather', subtitle: 'Forecast', icon: '☀️', keywords: ['weather', 'forecast'] },
  { id: 'maps', type: 'app', title: 'Maps', subtitle: 'Navigation', icon: '🗺️', keywords: ['map', 'directions', 'gps'] },
  { id: 'spotlight', type: 'app', title: 'Spotlight', subtitle: 'Search & launch', icon: '🔍', keywords: ['search', 'find', 'cmd+k'] },
];

// Quick actions
const ACTIONS: SearchItem[] = [
  { id: 'new-note', type: 'action', title: 'New Note', subtitle: 'Create a quick note', icon: '📝' },
  { id: 'new-file', type: 'action', title: 'New File', subtitle: 'Create a new file', icon: '📄' },
  { id: 'screenshot', type: 'action', title: 'Take Screenshot', subtitle: 'Capture screen', icon: '📸' },
  { id: 'toggle-dark', type: 'action', title: 'Toggle Dark Mode', subtitle: 'Switch theme', icon: '🌙' },
  { id: 'lock', type: 'action', title: 'Lock Screen', subtitle: 'Lock the computer', icon: '🔒' },
  { id: 'sleep', type: 'action', title: 'Sleep', subtitle: 'Put to sleep', icon: '😴' },
  { id: 'restart', type: 'action', title: 'Restart', subtitle: 'Restart system', icon: '🔄' },
  { id: 'shutdown', type: 'action', title: 'Shut Down', subtitle: 'Power off', icon: '⏻' },
];

// Command palette
const COMMANDS: SearchItem[] = [
  { id: 'cmd-apps', type: 'command', title: 'Show All Apps', subtitle: 'Browse installed apps', icon: '📦' },
  { id: 'cmd-settings', type: 'command', title: 'Settings', subtitle: 'System preferences', icon: '⚙️' },
  { id: 'cmd-about', type: 'command', title: 'About This Mac', subtitle: 'System info', icon: 'ℹ️' },
  { id: 'cmd-update', type: 'command', title: 'Check for Updates', subtitle: 'Software update', icon: '⬇️' },
  { id: 'cmd-help', type: 'command', title: 'Help', subtitle: 'Get assistance', icon: '❓' },
];

// Detect if input is a calculation
const isCalculation = (input: string): boolean => {
  return /^[\d\s+\-*/().%^]+$/.test(input) && /[\d]/.test(input);
};

const evaluate = (expr: string): string => {
  try {
    // Simple safe eval for basic math
    const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, '');
    const result = Function(`"use strict"; return (${sanitized})`)();
    return typeof result === 'number' && !isNaN(result) ? result.toString() : '';
  } catch {
    return '';
  }
};

const Spotlight: React.FC<SpotlightProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter and search
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show recent/suggested apps when empty
      return [...APPS.slice(0, 6), ...ACTIONS.slice(0, 2)];
    }

    const q = query.toLowerCase();
    const items: SearchItem[] = [];

    // Check for calculation
    if (isCalculation(query)) {
      const result = evaluate(query);
      if (result) {
        items.push({
          id: 'calc-result',
          type: 'calculation',
          title: result,
          subtitle: `= ${query}`,
          icon: '🔢',
        });
      }
    }

    // Check for URL
    if (query.includes('.') && !query.includes(' ')) {
      const url = query.startsWith('http') ? query : `https://${query}`;
      items.push({
        id: 'url',
        type: 'url',
        title: query,
        subtitle: 'Open in browser',
        icon: '🌐',
        url,
      });
    }

    // Search apps
    const matchingApps = APPS.filter(app => {
      const titleMatch = app.title.toLowerCase().includes(q);
      const keywordMatch = app.keywords?.some(k => k.includes(q));
      return titleMatch || keywordMatch;
    }).map(app => ({ ...app, score: app.title.toLowerCase().startsWith(q) ? 1 : 0 }))
      .sort((a, b) => b.score - a.score);

    items.push(...matchingApps.slice(0, 8));

    // Search actions
    const matchingActions = ACTIONS.filter(action =>
      action.title.toLowerCase().includes(q)
    );
    items.push(...matchingActions.slice(0, 3));

    // Search commands (prefix with > or /)
    if (q.startsWith('>') || q.startsWith('/')) {
      const cmdQuery = q.slice(1);
      const matchingCommands = COMMANDS.filter(cmd =>
        cmd.title.toLowerCase().includes(cmdQuery)
      );
      items.push(...matchingCommands);
    }

    return items;
  }, [query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Scroll selected item into view
  useEffect(() => {
    const selected = listRef.current?.children[selectedIndex] as HTMLElement;
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const executeItem = useCallback((item: SearchItem) => {
    switch (item.type) {
      case 'app':
        // In real zOS: window.dispatchEvent(new CustomEvent('zos:open-app', { detail: item.id }));
        console.log('Opening app:', item.id);
        break;
      case 'url':
        window.open(item.url, '_blank');
        break;
      case 'calculation':
        navigator.clipboard?.writeText(item.title);
        break;
      case 'action':
      case 'command':
        item.action?.();
        break;
    }
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          executeItem(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex(i => Math.max(i - 1, 0));
        } else {
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        }
        break;
    }
  }, [results, selectedIndex, executeItem, onClose]);

  const getTypeColor = (type: SearchItem['type']) => {
    switch (type) {
      case 'app': return 'bg-blue-500/20 text-blue-400';
      case 'action': return 'bg-green-500/20 text-green-400';
      case 'command': return 'bg-purple-500/20 text-purple-400';
      case 'calculation': return 'bg-yellow-500/20 text-yellow-400';
      case 'url': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Search input */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, files, actions, or type to calculate..."
            className="flex-1 bg-transparent text-xl text-white placeholder-gray-500 outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">esc</kbd>
        </div>
      </div>

      {/* Results */}
      <div ref={listRef} className="flex-1 overflow-auto">
        {results.map((item, index) => (
          <div
            key={item.id}
            onClick={() => executeItem(item)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-all ${
              index === selectedIndex
                ? 'bg-blue-600/30'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="text-3xl w-10 text-center">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{item.title}</div>
              {item.subtitle && (
                <div className="text-gray-500 text-sm truncate">{item.subtitle}</div>
              )}
            </div>
            <span className={`px-2 py-1 rounded text-xs ${getTypeColor(item.type)}`}>
              {item.type}
            </span>
          </div>
        ))}

        {results.length === 0 && query && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No results for "{query}"</p>
          </div>
        )}
      </div>

      {/* Footer hints */}
      <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1 bg-white/10 rounded">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1 bg-white/10 rounded">↵</kbd> Select</span>
          <span><kbd className="px-1 bg-white/10 rounded">esc</kbd> Close</span>
        </div>
        <div className="flex items-center gap-2">
          <span><kbd className="px-1 bg-white/10 rounded">/</kbd> Commands</span>
          <span><kbd className="px-1 bg-white/10 rounded">math</kbd> Calculate</span>
        </div>
      </div>
    </div>
  );
};

export default Spotlight;
