
interface BRCodeParams {
  pixKey: string;
  amount: string;
  merchantName: string;
  merchantCity: string;
  txid: string;
}

/**
 * Formats a field for BRCode, adding ID, length, and value.
 * @param id The field ID.
 * @param value The field value.
 * @returns The formatted string "IDLLValue".
 */
const formatField = (id: string, value: string): string => {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
};

/**
 * Calculates CRC16-CCITT checksum.
 * @param payload The string payload to calculate the checksum for.
 * @returns The 4-character hexadecimal checksum.
 */
const crc16 = (payload: string): string => {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

/**
 * Generates a full BRCode payload for a static PIX QR code with amount.
 * @param params The parameters for the BRCode.
 * @returns The complete BRCode string.
 */
export const generateBRCode = (params: BRCodeParams): string => {
  const { pixKey, amount, merchantName, merchantCity, txid } = params;

  const payload = [
    formatField('00', '01'), // Payload Format Indicator
    formatField('26', 
      formatField('00', 'br.gov.bcb.pix') +
      formatField('01', pixKey)
    ), // Merchant Account Information
    formatField('52', '0000'), // Merchant Category Code
    formatField('53', '986'), // Transaction Currency (BRL)
    formatField('54', amount), // Transaction Amount
    formatField('58', 'BR'), // Country Code
    formatField('59', merchantName), // Merchant Name
    formatField('60', merchantCity), // Merchant City
    formatField('62', formatField('05', txid)), // Additional Data Field (TXID)
  ].join('');

  const payloadWithCrc = payload + '6304'; // Add CRC16 ID and length placeholder
  const checksum = crc16(payloadWithCrc);
  
  return payloadWithCrc + checksum;
};
