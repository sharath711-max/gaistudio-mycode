import { printComponent } from '../utils/printUtils';
import ReceiptTemplate from '../components/print/ReceiptTemplate';
import MemoTemplate from '../components/print/MemoTemplate';
import GoldCertificateTemplate from '../components/print/GoldCertificateTemplate';
import SilverCertificateTemplate from '../components/print/SilverCertificateTemplate';
import PhotoCertificateTemplate from '../components/print/PhotoCertificateTemplate';
import { GoldTest } from '../types';

export type PrintDocumentType = 'RECEIPT' | 'MEMO' | 'GOLD_CERT' | 'SILVER_CERT' | 'PHOTO_CERT';

export interface PrintOptions {
  type: PrintDocumentType;
  test: GoldTest;
  testType?: 'gold' | 'silver';
}

export const printService = {
  print({ type, test, testType = 'gold' }: PrintOptions) {
    switch (type) {
      case 'RECEIPT':
        printComponent(ReceiptTemplate, { test, type: testType });
        break;
      case 'MEMO':
        printComponent(MemoTemplate, { test, type: testType });
        break;
      case 'GOLD_CERT':
        printComponent(GoldCertificateTemplate, { test });
        break;
      case 'SILVER_CERT':
        printComponent(SilverCertificateTemplate, { test });
        break;
      case 'PHOTO_CERT':
        printComponent(PhotoCertificateTemplate, { test });
        break;
      default:
        console.error(`Unknown print document type: ${type}`);
    }
  }
};
