import { promises as fsp } from 'fs';
import { join } from 'path';

export class Collection {
  constructor(collectionName) {
    this.filePath = join(process.cwd(), 'data', collectionName + '.json');
  }

  list() {
    return this._readData();
  }

  async findOne(id) {
    const data = await this._readData();
    return await data.find(element => element.id === id);
  }

  async delete(id) {    
    const data = await this._readData();
    const filtered = await data.filter(eachHW => eachHW.id !== id);
    await fsp.writeFile('./data/homeworks.json', JSON.stringify(filtered, null, 2));
  }

  async _readData() {
    const fileData = await fsp.readFile(this.filePath, 'utf8');
    return JSON.parse(fileData);
  }
}