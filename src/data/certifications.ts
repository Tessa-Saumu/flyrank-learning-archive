import records from './certifications.json' with { type: 'json' };

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  recipient: string;
  status: 'completed';
  pdfPath: string;
  previewImage: string;
  previewWidth: number;
  previewHeight: number;
  sourceFilename: string;
  sha256: string;
}

export const certifications: Certification[] = records.map(record => ({ ...record, status: 'completed' }));
export const certificationGoal = 20;
export const certificationCompleted = certifications.filter(c => c.status === 'completed').length;
export const certificationPercent = Math.round(certificationCompleted / certificationGoal * 100);
export const certificationZip = '/evidence/certifications/claude-certificates.zip';
