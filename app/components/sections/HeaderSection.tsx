interface HeaderSectionProps {
  title: string;
  text?: string;
}

export default function HeaderSection({ title, text }: HeaderSectionProps) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {text && (
        <p className="text-lg text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </header>
  );
}
