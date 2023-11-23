import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tech Boy Assistance",
    short_name: "Tech Boy Assistance",
    description: "Request tech assistance",
    start_url: "/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000",
    icons: [
      {
        src: "favicon.ico",
        type: "image/x-icon",
        sizes: "48x48",
      },
      { src: "apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
