<!-- Sync Impact Report
Version change: None -> 1.0.0
Modified principles: 
- [PRINCIPLE_1_NAME] -> Testing Standards
- [PRINCIPLE_2_NAME] -> Commit Strategy & Incremental Development
- [PRINCIPLE_3_NAME] -> Future Extensibility & Architecture
- [PRINCIPLE_4_NAME] -> Code Quality
- [PRINCIPLE_5_NAME] -> User Experience Consistency
Added sections: 
- Performance Requirements
Removed sections: 
- Additional Constraints (kept heading but cleared content)
Templates requiring updates: 
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# obsidian-rag Constitution

## Core Principles

### I. Testing Standards
Code MUST be rigorously tested. Tests MUST ensure reliability and behavioral correctness across the system.
*Rationale*: A strong test suite reduces regressions and ensures safe, predictable iteration.

### II. Commit Strategy & Incremental Development
Developers MUST commit frequently when writing loosely coupled code to capture modular progress and simplify debugging.
*Exception*: During the initial MVP (Minimum Viable Product) build, this requirement is waived to prioritize rapid prototyping.
*Rationale*: Granular commits aid code review and rollbacks, but rigid commit rules during MVP can stifle initial momentum.

### III. Future Extensibility & Architecture
Code architecture MUST anticipate future extensibility. Components SHOULD be designed to be loosely coupled, allowing new features to be added with minimal changes to existing logic.
*Rationale*: Modules will naturally grow; designing them to be extensible from the start prevents costly rewrites later.

### IV. Code Quality
All code MUST adhere to strict formatting, linting, and readability standards.
*Rationale*: High code quality ensures long-term maintainability and reduces technical debt.

### V. User Experience Consistency
UI components and interactions MUST follow a unified design language and consistent behavioral patterns across the application.
*Rationale*: A consistent UX reduces cognitive load for users and creates a professional product feel.

### VI. Performance Requirements
Systems MUST be designed with performance in mind, ensuring fast response times and efficient resource usage.
*Rationale*: Poor performance directly degrades user experience and limits scalability.

## Additional Constraints

There are no additional runtime constraints or technological mandates defined at this time.

## Development Workflow

Development workflows MUST respect the testing, commit, and quality principles outlined above. During the MVP phase, speed of delivery is prioritized over rigid process, provided that the architectural foundation for extensibility is preserved.

## Governance

This Constitution supersedes all other practices. Any amendments to this document MUST be reviewed and approved by project maintainers. The versioning policy strictly adheres to semantic versioning (MAJOR for breaking governance changes, MINOR for new principles, PATCH for clarifications). All PRs and code reviews MUST verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-03-22 | **Last Amended**: 2026-03-22