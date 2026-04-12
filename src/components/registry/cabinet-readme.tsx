interface CabinetReadmeProps {
  html: string;
}

export function CabinetReadme({ html }: CabinetReadmeProps) {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
