export function getNetworkById(id: number): string {
  switch (id) {
    case 1:
      return 'MTN';

    case 2:
      return 'GLO';

    case 3:
      return '9MOBILE';

    case 4:
      return 'AIRTEL';

    case 5:
      return 'SMILE';
    default:
      return 'MTN';
  }
}
