# Memory Guidelines

This document outlines the memory guidelines for agent interactions and runtime testing.

## Core Principles

- Maintain clear context across interactions
- Preserve state information for runtime tests
- Document memory requirements for PR76 testing

## Guidelines

1. **State Management**: Agents must maintain consistent state throughout test execution
2. **Context Preservation**: Memory should be preserved between related test runs
3. **Runtime Testing**: All memory operations must be validated during PR76 runtime tests
