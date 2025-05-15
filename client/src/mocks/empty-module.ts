// A completely empty module that satisfies the import
export const connect = () => {
  return {
    close: () => {},
    on: () => {},
    off: () => {},
    write: () => false,
    end: () => {}
  }
}

export default {
  connect,
  Socket: class DummySocket {}
}