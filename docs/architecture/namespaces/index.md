---
layout: default
title: Namespaces
parent: Architecture
nav_order: 3
permalink: /architecture/namespaces/
---

# Namespace Architecture

PineTS mimics Pine Script's namespacing (`ta.`, `math.`, `request.`) through modular namespace classes attached to the `Context`.

## Common Pattern: The Factory

Every function in a namespace is implemented using a factory pattern:

```typescript
// Factory receives the Context
export function myFunc(context: any) {
    // Returns the actual function to be called by user code
    return (arg1, arg2, _callId) => {
        // Logic accessing context...
    };
}
```

## The `param()` Function

Each namespace implements its own `param()` function. This is the interface between the transpiler and the runtime.

-   **Input**: Raw value, Array, or Series.
-   **Output**: `Series` object (usually), or raw value (for `array` namespace).

### Why different `param()` implementations?

1.  **`ta` / `math`**: Need to operate on **Series**. They wrap scalars in Series so `.get(0)` works universally.
2.  **`array`**: Operates on **Pine Array Objects**. `param()` returns the raw object/value, not a Series wrapper.
3.  **`request`**: Handles **Tuples** and needs the **Parameter ID** for caching secondary contexts.

## Specific Namespace Details

For implementation details of specific namespaces, see their source READMEs:

-   [Technical Analysis (`ta`)](./ta.md)
-   [Math (`math`)](./math.md)
-   [Array (`array`)](./array.md)
-   [Request (`request`)](./request.md)
-   [Input (`input`)](./input.md)
