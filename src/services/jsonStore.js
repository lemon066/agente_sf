'use strict';

const fs = require('fs');
const path = require('path');

class JsonStore {
  constructor(filePath, defaultValue) {
    this.filePath = filePath;
    this.defaultValue = defaultValue;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    this.data = this.load();
  }

  load() {
    try {
      if (!fs.existsSync(this.filePath)) return structuredClone(this.defaultValue);
      const raw = fs.readFileSync(this.filePath, 'utf8').trim();
      return raw ? JSON.parse(raw) : structuredClone(this.defaultValue);
    } catch (error) {
      const backup = `${this.filePath}.corrupt-${Date.now()}`;
      try {
        fs.renameSync(this.filePath, backup);
      } catch {}
      console.error(`Archivo JSON inválido. Se creó una base nueva: ${error.message}`);
      return structuredClone(this.defaultValue);
    }
  }

  save() {
    const temporary = `${this.filePath}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(this.data, null, 2), 'utf8');
    fs.renameSync(temporary, this.filePath);
  }
}

module.exports = JsonStore;
