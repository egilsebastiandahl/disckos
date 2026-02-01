import Image from "next/image";

interface TextImageProps {
  orientation: "text-right" | "text-left";
  imageUrl?: string;
  heading?: string;
  paragraph?: string;
  textCenter?: boolean;
}

export default function TextImage({
  orientation,
  imageUrl,
  heading,
  paragraph,
  textCenter,
}: TextImageProps) {
  return (
    <div
      className={`flex flex-col md:flex-row ${orientation === "text-right" ? "" : "md:flex-row-reverse"}  gap-8 ${textCenter ? "items-center" : ""} max-w-3xl`}
    >
      <div className="w-full md:w-1/2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Image"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-md"
          />
        ) : (
          <Image
            src="/Disckos-bilde-chat.png"
            alt="Placeholder"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-md"
          />
        )}
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">{heading}</h2>
        <p>{paragraph}</p>
        {/* <p className="text-gray-700 dark:text-gray-300">{paragraph}</p> */}
      </div>
    </div>
  );
}
