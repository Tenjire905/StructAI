export type { CopyCatalog, CopyEntry, CopyKey } from './copy/types';
export {
  formatCopyText,
  getCopyText,
  resolveCopy,
  streakWeekdayCopyKeys,
} from './copy/types';
export { copyByLocale, getCatalogForLocale } from './copy/index';
export { copyDe } from './copy/de';

/** @deprecated Import from copyByLocale / getCatalogForLocale instead. */
export { copyDe as copy } from './copy/de';
