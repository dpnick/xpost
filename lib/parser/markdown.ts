const MardownHtmlConversion: [RegExp, string][] = [
  //title rules
  [/#{3}\s?([^\n]+)/g, '$1'],
  [/#{2}\s?([^\n]+)/g, '$1'],
  [/#{1}\s?([^\n]+)/g, '$1'],
  //bold, italics and paragragh rules
  [/\*\*\s?([^\n]+)\*\*/g, '$1'],
  [/\*\s?([^\n]+)\*/g, '$1'],
  [/__([^_]+)__/g, '$1'],
  [/_([^_`]+)_/g, '$1'],
  [/([^\n]+\n?)/g, '$1'],
  //links
  [/\[([^\]]+)\]\(([^)]+)\)/g, '$1'],
  //highlights
  [/(`)(\s?[^\n,]+\s?)(`)/g, '$2'],
  //Lists
  [/([^\n]+)(\+)([^\n]+)/g, '$3'],
  [/([^\n]+)(\*)([^\n]+)/g, '$3'],
  //Image
  // removed at the moment bc we don't want to include it in our description
  /*[
    /!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,
    '<img src="$2" alt="$1" title="$3" />',
  ],*/
];

// parse simple markdown to html for post preview
export function parseMarkdownToText(markdown: string): string {
  let plainText = markdown;
  MardownHtmlConversion.forEach(([rule, template]) => {
    plainText = plainText.replace(rule, template);
  });
  return plainText;
}
