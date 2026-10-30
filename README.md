# testing

A simple testing example repository with Node.js testing patterns and standalone TypeScript utilities for wiki operations.

## Usage

### wikiRetentionDeadline

Calculate retention deadlines using fixed 24-hour elapsed periods:

```typescript
import { retentionDeadline } from './utils/wikiRetentionDeadline.js';

const issued = new Date('2024-01-01T12:00:00Z');
const deadline = retentionDeadline(issued, 30); // 30 days later
```

**Why fixed 24-hour periods?** The function uses elapsed milliseconds (`days * 86_400_000`) rather than local calendar-date arithmetic. This ensures that daylight-saving time changes do not affect the elapsed duration. A 30-day retention period is always exactly 720 hours, regardless of when clocks spring forward or fall back.

## Run tests

```bash
npm test
```
