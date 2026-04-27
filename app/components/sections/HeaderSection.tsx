import Button from "../button/Button";

interface HeaderSectionProps {
  title: string;
  text?: string;
  buttonText?: string;
  buttonClick?: () => void;
}

export default function HeaderSection({ title, text, buttonText, buttonClick }: HeaderSectionProps) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {text && <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm">{text}</p>}
      {buttonText && (
        <Button className="mt-4" onClick={buttonClick}>
          {buttonText}
        </Button>
      )}
    </header>
  );
}
