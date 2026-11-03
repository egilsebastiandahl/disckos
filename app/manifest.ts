import type { MetadataRoute } from "next";

/**
 * Makes Disckos installable as an app. On Android the installed app then shows
 * up in the share sheet, so a UDisc "Export to CSV" can be sent straight to the
 * import page (see public/sw.js for the hand-off).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Disckos",
    short_name: "Disckos",
    description: "Discgolf for legender",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5F1E8",
    theme_color: "#5F7D4D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    share_target: {
      action: "/share-target",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        title: "title",
        text: "text",
        files: [
          {
            name: "file",
            accept: [
              "text/csv",
              ".csv",
              "text/comma-separated-values",
              "application/csv",
              "application/vnd.ms-excel",
              "text/plain",
            ],
          },
        ],
      },
    },
  };
}
