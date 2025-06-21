
import CryptoJS from 'crypto-js';

const CLE_CRYPTAGE = 'riziky-boutic-secure-key-2024';

export const crypterDonneesCarte = (donneesCarte: any) => {
  const donneesString = JSON.stringify(donneesCarte);
  return CryptoJS.AES.encrypt(donneesString, CLE_CRYPTAGE).toString();
};

export const decrypterDonneesCarte = (donneesChiffrees: string) => {
  const bytes = CryptoJS.AES.decrypt(donneesChiffrees, CLE_CRYPTAGE);
  const donneesString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(donneesString);
};
