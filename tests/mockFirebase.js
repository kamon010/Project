// mockFirebase.js

const mockFirebase = {
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: () => ({}) }),
        set: jest.fn().mockResolvedValue(),
      })),
    })),
  })),
  storage: jest.fn(() => ({
    ref: jest.fn(() => ({
      getDownloadURL: jest.fn().mockResolvedValue("mock-url"),
    })),
  })),
};

global.firebase = mockFirebase;
