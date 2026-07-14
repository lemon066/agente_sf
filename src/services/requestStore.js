'use strict';

const crypto = require('crypto');
const JsonStore = require('./jsonStore');
const config = require('../config/config');

class RequestStore extends JsonStore {
  constructor() {
    super(config.requestsFile, []);
  }

  add(type, userId, payload) {
    const record = {
      id: `${type.toUpperCase()}-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      type,
      userId,
      payload,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
    };
    this.data.push(record);
    this.save();
    return record;
  }

  findByUser(userId, type = undefined) {
    return this.data.filter(
      (item) => item.userId === userId && (!type || item.type === type),
    );
  }
}

module.exports = new RequestStore();
