import {
  buildCertificateCredentialId,
  certificateSkillCopyKey,
} from '@/lib/certificateIdentity';
import { pathTitleKey } from '@/lib/pathProgress';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export type CertificateViewModel = {
  pathTitle: string;
  skillLabel: string;
  skillStatement: string;
  evidenceLabel: string;
  credentialId: string;
  credentialLabel: string;
  badgeLabel: string;
  awardedToLabel: string;
  completedOnLabel: string;
  brandTagline: string;
  shareDialogTitle: string;
};

export function buildCertificateViewModel(input: {
  pathId: string;
  recipientName: string;
  completedAt: string;
  chaptersCompleted: number;
  chaptersTotal: number;
  t: Translate;
}): CertificateViewModel {
  const pathTitle = input.t(pathTitleKey(input.pathId));
  const skillStatement = input.t(certificateSkillCopyKey(input.pathId));
  const credentialId = buildCertificateCredentialId({
    pathId: input.pathId,
    recipientName: input.recipientName,
    completedAt: input.completedAt,
  });

  return {
    pathTitle,
    skillLabel: input.t('certificate.skillLabel'),
    skillStatement,
    evidenceLabel: input.t('certificate.evidence', {
      completed: input.chaptersCompleted,
      total: input.chaptersTotal,
    }),
    credentialId,
    credentialLabel: input.t('certificate.credentialLabel'),
    badgeLabel: input.t('certificate.badge'),
    awardedToLabel: input.t('certificate.awardedTo'),
    completedOnLabel: input.t('certificate.completedOn'),
    brandTagline: input.t('certificate.brandTagline'),
    shareDialogTitle: input.t('certificate.shareDialogTitle', {
      skill: skillStatement,
      name: input.recipientName,
    }),
  };
}
