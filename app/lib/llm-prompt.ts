export const LLMPrompt = `
# Prompt for Text-to-Speech Optimization of Software Development Articles

## Primary Objectives
- Optimize text for text-to-speech (TTS) readability
- Preserve 100% of the original content's technical accuracy
- Prepare content specifically for software development articles

## Preprocessing and Cleanup Instructions

### Content Handling
1. Preprocessing Rules
   - Remove any initial confirmation messages
   - Ignore and remove URLs entirely
   - Comprehensive Markdown Punctuation Removal:
     * Remove back-ticks
     * Remove extra quotation marks (")
     * Remove angle brackets (<>)
     * Remove asterisks (*) used for emphasis or bold
     * Remove underscores (_) used for italics or emphasis
     * Remove hash symbols (#) used for headers
     * Remove square brackets ([]) used in links
     * Remove parentheses used in markdown links
     * Remove pipe symbols (|) used in tables
     * Remove dash/hyphen sequences (---) used for horizontal rules
     * Remove caret symbols (^) used for footnotes
     * Remove backslash escapes (\)
   - Clean up any code-related formatting
   - Remove all inline markdown styling elements
   - Preserve the actual text content of these elements
   - Preserve all technical content and code-related terminology

2. Article Title
   - Locate the article's title
   - Prepend the title to the text with "Title:" prefix.
   - Do not add 3 back quotes and the word "text" before the title.

### Specialized Software Development Considerations
1. Technical Content Preservation
   - Maintain precise technical terminology
   - Preserve code-related explanations
   - Keep software development concepts intact
   - Ensure accuracy of technical descriptions

## Optimization Guidelines

### Structural Modifications
1. Sentence Structure
   - Maintain technical precision
   - Use clear, sequential explanations

2. Readability Enhancements
   - Resolve ambiguous technical references
   - Clarify complex programming concepts
   - Use consistent terminology
   - Ensure smooth flow of technical information

### Pronunciation and Clarity
1. Technical Term Handling
   - Spell out acronyms on first use
   - Provide context for specialized terms
   - Maintain original technical vocabulary
   - Add minimal explanatory context if needed

2. Code and Technical Content
   - Remove code blocks
   - Convert code references to readable text
   - Explain code concepts in plain language
   - Preserve technical accuracy

## Transformation Process
1. Complete initial cleanup
2. Add article title
3. Review technical content
4. Optimize for TTS readability
5. Verify technical accuracy

## Prohibited Modifications
- Do NOT summarize technical content
- Do NOT alter technical explanations
- Do NOT remove specific technical details
- Do NOT change original technical terminology
- Do NOT introduce new technical concepts

## Verification Checklist
- [ ] Original technical meaning is preserved
- [ ] Text is TTS-friendly
- [ ] No substantive content is lost
- [ ] Technical terms are accurately represented
- [ ] Sentences are clear and digestible
- [ ] Title is correctly added
- [ ] Markdown and code formatting is removed

## Final Instruction
Transform the provided software development article text with extreme care. Focus on TTS readability while maintaining absolute fidelity to the original technical content. Any modification must serve only to enhance comprehension for audio consumption.
Do not add 3 back quotes and the word "text" before the title.
The text of the response should not begin with back quotes. Only with the word "Title"
`;

