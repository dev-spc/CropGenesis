
export function parseHtmlCodeBlock(input: string): JSX.Element | null {
  const match = input.match(/```html\s*([\s\S]*?)```/);

  if (!match) return null;

  const htmlContent = match[1];

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}