import { notebookLinks } from "./notebooks";
import { areas } from "./areas";

// Build a map from video.id to notebook URL by sequential order
const allVideoIds = areas.flatMap((area) => area.videos.map((v) => v.id));

const videoIdToNotebook: Record<string, string> = {};

// video-01 maps to the 2nd video (index 1), since the intro (index 0) has no notebook
// Actually let's map video-01 to index 0 first and see if count matches
// 91 videos, 90 notebooks. Skip the intro video (hv-0).
allVideoIds.forEach((videoId, index) => {
  if (index === 0) return; // Skip intro video (hv-0)
  const notebookIndex = index - 1;
  const notebook = notebookLinks[notebookIndex];
  if (notebook) {
    videoIdToNotebook[videoId] = notebook.url;
  }
});

export function getNotebookUrl(videoId: string): string | undefined {
  return videoIdToNotebook[videoId];
}
