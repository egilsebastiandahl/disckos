import Button from "../button/Button";

interface HeaderSectionProps {
  title: string;
  text?: string;
  buttonText?: string;
  buttonClick?: () => void;
}

export default function HeaderSection({ title, text, buttonText, buttonClick }: HeaderSectionProps) {
  return (
    <header className="flex flex-col mb-12 text-center w-full mx-auto items-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {text && <p className="max-w-lg text-lg text-gray-600 dark:text-gray-400 ">{text}</p>}
      {buttonText && (
        <Button className="mt-4 max-w-sm" onClick={buttonClick}>
          {buttonText}
        </Button>
      )}
    </header>
  );
}
