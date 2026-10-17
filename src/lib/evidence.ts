import type { Artifact, DisplayMode, EvidenceStatus } from '../data/types';

export type ViewerKind = 'pdf' | 'video' | 'live';

/** Only file viewers and explicitly registered live sites can be revealed. */
export function evidenceCapability(artifact: Artifact, mode: DisplayMode, status: EvidenceStatus) {
  const restricted = status === 'private' || status === 'missing' || status === 'not-applicable';
  const kind: ViewerKind | undefined =
    artifact.type === 'pdf' || artifact.type === 'video' || artifact.type === 'live'
      ? artifact.type : undefined;
  const src = restricted ? '' : artifact.embedUrl ?? artifact.url ?? '';
  const canReveal = mode !== 'link' && Boolean(kind && src);
  const fileUrl = artifact.type === 'image' ? artifact.previewImage : artifact.embedUrl;
  return {
    kind,
    src: canReveal ? src : '',
    canReveal,
    openUrl: restricted ? undefined : fileUrl ?? artifact.url,
    downloadUrl: !restricted && (artifact.type === 'pdf' || artifact.type === 'video')
      ? artifact.embedUrl : undefined,
  };
}
