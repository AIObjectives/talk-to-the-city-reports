import { readFileSync } from 'fs';
import { join } from 'path';
import _ from 'lodash';
console.log('checking lang files');

const languages = ['en-US', 'zh-TW'];
const langDir = '$lib/i18n';

const langFiles = languages.map((lang) => {
  const filePath = join(langDir, `${lang}.json`);
  const fileContent = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
});

languages.forEach((lang, index) => {
  const baseLang = langFiles[index];
  langFiles.forEach((compareLang, compareIndex) => {
    if (index !== compareIndex) {
      const missingKeys = _.difference(_.keys(baseLang), _.keys(compareLang));
      if (missingKeys.length > 0) {
        console.log(`Keys missing in ${languages[compareIndex]}: ${missingKeys.join(', ')}`);
      }
    }
  });
});
