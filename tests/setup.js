// So next/config works when testing
jest.mock('next/config', () => jest.fn(() => jest.requireActual('../next.config')));
