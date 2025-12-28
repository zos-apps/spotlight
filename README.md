# 🔍 Spotlight

Universal search and command launcher for zOS (⌘K).

## Features

- **App Search** - Find and launch any zOS app instantly
- **Quick Actions** - Take screenshot, toggle dark mode, lock screen
- **Calculator** - Type math expressions for instant results  
- **URL Launcher** - Type URLs to open in browser
- **Command Palette** - Prefix with `/` or `>` for commands
- **Keyboard Navigation** - ↑↓ to navigate, Enter to select, Esc to close

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘K` | Open Spotlight |
| `↑↓` | Navigate results |
| `Enter` | Select item |
| `Esc` | Close |
| `Tab` | Next item |

## Installation

```bash
npm install @anthropic/spotlight
```

## Usage

```tsx
import Spotlight from '@anthropic/spotlight';

// Typically opened via ⌘K shortcut in zOS
<Spotlight onClose={() => setOpen(false)} />
```

## License

MIT
