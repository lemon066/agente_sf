'use strict';

const JsonStore = require('./jsonStore');
const config = require('../config/config');

const ROOT_STATE = 'menuPrincipal';

class ConversationStore extends JsonStore {
  constructor() {
    super(config.stateFile, {});
  }

  get(userId) {
    if (!this.data[userId]) {
      this.data[userId] = {
        state: ROOT_STATE,
        lastInteractionAt: 0,
        invalidAttempts: 0,
        context: {},
      };
    }
    return this.data[userId];
  }

  isExpired(userId) {
    const session = this.get(userId);
    return Boolean(
      session.lastInteractionAt &&
        Date.now() - session.lastInteractionAt > config.inactivityMs,
    );
  }

  touch(userId) {
    const session = this.get(userId);
    session.lastInteractionAt = Date.now();
    this.save();
    return session;
  }

  setState(userId, state, context = undefined) {
    const session = this.get(userId);
    session.state = state;
    session.lastInteractionAt = Date.now();
    session.invalidAttempts = 0;
    if (context !== undefined) session.context = context;
    this.save();
    return session;
  }

  incrementInvalid(userId) {
    const session = this.get(userId);
    session.invalidAttempts += 1;
    session.lastInteractionAt = Date.now();
    this.save();
    return session.invalidAttempts;
  }

  reset(userId) {
    this.data[userId] = {
      state: ROOT_STATE,
      lastInteractionAt: Date.now(),
      invalidAttempts: 0,
      context: {},
    };
    this.save();
    return this.data[userId];
  }

  cleanup(maxAgeMs = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAgeMs;
    let changed = false;
    for (const [userId, session] of Object.entries(this.data)) {
      if ((session.lastInteractionAt || 0) < cutoff) {
        delete this.data[userId];
        changed = true;
      }
    }
    if (changed) this.save();
  }
}

module.exports = new ConversationStore();
module.exports.ROOT_STATE = ROOT_STATE;
