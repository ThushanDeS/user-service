// In-memory User mock to stand in for a Mongoose model during development/tests
const users = [];

class UserModel {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  async save() {
    const existingIndex = users.findIndex((u) => u.userId === this.userId || u.id === this.id || u.email === this.email);
    if (existingIndex >= 0) {
      // update
      users[existingIndex] = { ...users[existingIndex], ...this };
    } else {
      // ensure userId
      if (!this.userId) this.userId = this.id || `user_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      users.push({ ...this });
    }
    return this;
  }

  // helper to convert stored plain object to model instance
  static _toModel(obj) {
    if (!obj) return null;
    const m = new UserModel(obj);
    return m;
  }

  static async findOne(query = {}) {
    if (query.userId) {
      const u = users.find((x) => x.userId === query.userId || x.id === query.userId || x._id === query.userId);
      return UserModel._toModel(u);
    }
    if (query.email) {
      const u = users.find((x) => x.email === query.email);
      return UserModel._toModel(u);
    }
    return null;
  }

  // for testing/debugging
  static __getAll() {
    return users;
  }
}

module.exports = UserModel;
