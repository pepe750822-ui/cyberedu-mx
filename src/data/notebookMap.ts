import { notebookLinks } from "./notebooks";
import { areas } from "./areas";

// Build maps from video.id to notebook URL and notebook key
const allVideoIds = areas.flatMap((area) => area.videos.map((v) => v.id));

const videoIdToNotebook: Record<string, string> = {};
const videoIdToNotebookKey: Record<string, string> = {};

allVideoIds.forEach((videoId, index) => {
  if (index === 0) return; // Skip intro video (hv-0)
  const notebookIndex = index - 1;
  const notebook = notebookLinks[notebookIndex];
  if (notebook) {
    videoIdToNotebook[videoId] = notebook.url;
    videoIdToNotebookKey[videoId] = notebook.id;
  }
});

export function getNotebookUrl(videoId: string): string | undefined {
  return videoIdToNotebook[videoId];
}

export function getNotebookKey(videoId: string): string | undefined {
  return videoIdToNotebookKey[videoId];
}
