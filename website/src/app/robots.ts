import type { MetadataRoute } from "next";
import { getRobotsPolicy } from "@/lib/deployment-environment";

export default function robots(): MetadataRoute.Robots {
  return getRobotsPolicy();
}
